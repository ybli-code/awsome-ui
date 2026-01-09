// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // How dramatically the blob reacts to audio (0.5 = subtle, 2.0 = dramatic)
  intensity: 1.5,
  
  // Base depth when no audio playing
  baseDepth: 0.3,
  
  // Animation speed multiplier on hover
  hoverSpeedMultiplier: 5,
  
  // Audio analysis settings
  fftSize: 256,
  onsetThreshold: 0.015,
  onsetSensitivity: 3,
  
  // Smoothing factors (0-1, higher = smoother but less responsive)
  energySmoothing: 0.3,
  depthSmoothing: 0.5,
  depthDecay: 0.92
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
  blob: document.querySelector('.blob'),
  playPauseBtn: document.getElementById('playPauseBtn'),
  audioPlayer: document.getElementById('audioPlayer'),
  playIcon: document.getElementById('playIcon'),
  pauseIcon: document.getElementById('pauseIcon')
};

// ============================================
// AUDIO STATE
// ============================================

let audioContext = null;
let analyser = null;
let audioSource = null;
let dataArray = null;
let isAnimating = false;

// Audio analysis state
let depth = CONFIG.baseDepth;
let smoothedDepth = CONFIG.baseDepth;
let prevEnergy = 0;
let smoothedEnergy = 0;

// ============================================
// HOVER INTERACTION
// ============================================

function setupHoverInteraction() {
  const animations = elements.blob.getAnimations();
  
  elements.blob.addEventListener('mouseenter', () => {
    animations.forEach(anim => {
      anim.playbackRate = CONFIG.hoverSpeedMultiplier;
    });
  });
  
  elements.blob.addEventListener('mouseleave', () => {
    animations.forEach(anim => {
      anim.playbackRate = 1;
    });
  });
}

// ============================================
// AUDIO PLAYBACK
// ============================================

async function initializeAudio() {
  if (audioContext) return;
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = CONFIG.fftSize;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    audioSource = audioContext.createMediaElementSource(elements.audioPlayer);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  } catch (error) {
    console.error('Failed to initialize Web Audio API:', error);
  }
}

async function togglePlayback() {
  await initializeAudio();
  
  if (elements.audioPlayer.paused) {
    try {
      await elements.audioPlayer.play();
      elements.playPauseBtn.classList.add('active');
      elements.playIcon.style.display = 'none';
      elements.pauseIcon.style.display = 'block';
      
      if (!isAnimating) {
        isAnimating = true;
        updateDepthFromAudio();
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  } else {
    elements.audioPlayer.pause();
    elements.playPauseBtn.classList.remove('active');
    elements.playIcon.style.display = 'block';
    elements.pauseIcon.style.display = 'none';
  }
}

// ============================================
// AUDIO REACTIVITY
// ============================================

function updateDepthFromAudio() {
  if (!analyser) {
    requestAnimationFrame(updateDepthFromAudio);
    return;
  }
  
  // Get time-domain data (waveform)
  analyser.getByteTimeDomainData(dataArray);
  
  // Calculate RMS (root mean square) energy
  let sumSquares = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const normalized = (dataArray[i] - 128) / 128; // Normalize to -1 to 1
    sumSquares += normalized * normalized;
  }
  const rmsEnergy = Math.sqrt(sumSquares / dataArray.length);
  
  // Smooth energy to reduce noise
  smoothedEnergy += (rmsEnergy - smoothedEnergy) * CONFIG.energySmoothing;
  
  // Onset detection: detect positive energy changes (syllable starts)
  const energyDelta = smoothedEnergy - prevEnergy;
  prevEnergy = smoothedEnergy;
  
  // React to onsets (sharp increases in energy)
  if (energyDelta > CONFIG.onsetThreshold) {
    const impulse = energyDelta * CONFIG.onsetSensitivity * CONFIG.intensity;
    depth = Math.min(1.0, depth + impulse);
  }
  
  // Natural decay back to baseline
  depth = CONFIG.baseDepth + (depth - CONFIG.baseDepth) * CONFIG.depthDecay;
  
  // Smooth the final output to reduce flickering
  smoothedDepth += (depth - smoothedDepth) * CONFIG.depthSmoothing;
  
  // Apply to CSS variable
  elements.blob.style.setProperty('--depth', smoothedDepth.toFixed(3));
  
  requestAnimationFrame(updateDepthFromAudio);
}

// ============================================
// EVENT LISTENERS
// ============================================

elements.playPauseBtn.addEventListener('click', togglePlayback);

elements.audioPlayer.addEventListener('ended', () => {
  elements.playIcon.style.display = 'block';
  elements.pauseIcon.style.display = 'none';
  elements.playPauseBtn.classList.remove('active');
});

// Handle audio loading errors
elements.audioPlayer.addEventListener('error', (e) => {
  console.error('Audio loading error:', e);
  alert('Failed to load audio. This may be due to CORS restrictions.');
});

// ============================================
// INITIALIZATION
// ============================================

// Wait for animations to be registered before setting up hover
requestAnimationFrame(setupHoverInteraction);