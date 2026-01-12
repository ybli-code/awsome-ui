// THE GRAND FINALE 2026

class GrandFinale {
	constructor() {
		this.cursor = document.getElementById("cursor");
		this.fireworksContainer = document.getElementById("fireworks");
		this.neonRing = document.getElementById("neonRing");
		this.message = document.getElementById("message");
		this.celebrateBtn = document.getElementById("celebrateBtn");
		this.audioControl = document.getElementById("audioControl");

		this.isCelebrating = false;
		this.audioContext = null;
		this.isAudioPlaying = false;

		this.init();
	}

	init() {
		this.createStarfield();
		this.createSnow();
		this.createFloatingParticles();
		this.createVisualizer();
		this.initCursor();
		this.initCountdown();
		this.initEventListeners();
	}

	// ===== STARFIELD =====
	createStarfield() {
		const starfield = document.getElementById("starfield");
		const starCount = 200;

		for (let i = 0; i < starCount; i++) {
			const star = document.createElement("div");
			star.className = "star";
			star.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            --duration: ${Math.random() * 3 + 2}s;
            --opacity: ${Math.random() * 0.5 + 0.3};
            animation-delay: ${Math.random() * 3}s;
          `;
			starfield.appendChild(star);
		}

		// Add shooting stars
		this.createShootingStars();
	}

	createShootingStars() {
		setInterval(() => {
			if (Math.random() > 0.7) {
				const starfield = document.getElementById("starfield");
				const shootingStar = document.createElement("div");
				shootingStar.className = "shooting-star";
				shootingStar.style.cssText = `
              left: ${Math.random() * 50}%;
              top: ${Math.random() * 30}%;
              animation-duration: ${Math.random() * 1 + 0.5}s;
            `;
				starfield.appendChild(shootingStar);

				setTimeout(() => shootingStar.remove(), 2000);
			}
		}, 2000);
	}

	//  SNOW
	createSnow() {
		const snowContainer = document.getElementById("snow");
		const snowflakes = ["❄", "❅", "❆", "✧", "✦"];

		setInterval(() => {
			const snowflake = document.createElement("div");
			snowflake.className = "snowflake";
			snowflake.textContent =
				snowflakes[Math.floor(Math.random() * snowflakes.length)];
			snowflake.style.cssText = `
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 1 + 0.5}rem;
            animation-duration: ${Math.random() * 5 + 5}s;
            animation-delay: ${Math.random() * 2}s;
          `;
			snowContainer.appendChild(snowflake);

			setTimeout(() => snowflake.remove(), 12000);
		}, 200);
	}

	//  FLOATING PARTICLES
	createFloatingParticles() {
		const container = document.getElementById("floatingParticles");
		const colors = ["#ffd700", "#ff6b6b", "#4ecdc4", "#a29bfe", "#fd79a8"];

		for (let i = 0; i < 30; i++) {
			const particle = document.createElement("div");
			particle.className = "floating-particle";
			particle.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-duration: ${Math.random() * 10 + 10}s;
            animation-delay: ${Math.random() * 10}s;
          `;
			container.appendChild(particle);
		}
	}

	//  VISUALIZER
	createVisualizer() {
		const visualizer = document.getElementById("visualizer");
		const barCount = 20;

		for (let i = 0; i < barCount; i++) {
			const bar = document.createElement("div");
			bar.className = "bar";
			bar.style.cssText = `
            --min-height: ${Math.random() * 10 + 5}px;
            --max-height: ${Math.random() * 40 + 20}px;
            animation-delay: ${i * 0.05}s;
          `;
			visualizer.appendChild(bar);
		}
	}

	//  CURSOR
	initCursor() {
		const trailColors = ["#ffd700", "#ff6b6b", "#4ecdc4", "#a29bfe", "#fd79a8"];
		let colorIndex = 0;

		document.addEventListener("mousemove", (e) => {
			this.cursor.style.left = e.clientX - 10 + "px";
			this.cursor.style.top = e.clientY - 10 + "px";

			// Create trail
			if (Math.random() > 0.5) {
				const trail = document.createElement("div");
				trail.className = "trail";
				trail.style.cssText = `
              left: ${e.clientX - 4}px;
              top: ${e.clientY - 4}px;
              background: ${trailColors[colorIndex]};
              box-shadow: 0 0 10px ${trailColors[colorIndex]};
            `;
				document.body.appendChild(trail);

				colorIndex = (colorIndex + 1) % trailColors.length;

				setTimeout(() => trail.remove(), 1000);
			}
		});
	}

	//  COUNTDOWN
	initCountdown() {
		const targetDate = new Date("January 1, 2026 00:00:00").getTime();

		const updateCountdown = () => {
			const now = new Date().getTime();
			const distance = targetDate - now;

			if (distance > 0) {
				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				this.animateValue("days", days);
				this.animateValue("hours", hours);
				this.animateValue("minutes", minutes);
				this.animateValue("seconds", seconds);
			} else {
				// It's 2026!
				this.triggerCelebration();
			}
		};

		updateCountdown();
		setInterval(updateCountdown, 1000);
	}

	animateValue(id, value) {
		const element = document.getElementById(id);
		const currentValue = element.textContent;
		const newValue = value.toString().padStart(2, "0");

		if (currentValue !== newValue) {
			element.style.transform = "scale(1.1)";
			element.textContent = newValue;
			setTimeout(() => {
				element.style.transform = "scale(1)";
			}, 150);
		}
	}

	//  EVENT LISTENERS
	initEventListeners() {
		this.celebrateBtn.addEventListener("click", () => this.triggerCelebration());

		this.audioControl.addEventListener("click", () => this.toggleAudio());

		// Click anywhere for mini fireworks
		document.addEventListener("click", (e) => {
			if (
				e.target !== this.celebrateBtn &&
				!this.celebrateBtn.contains(e.target)
			) {
				this.createFirework(e.clientX, e.clientY, 20);
			}
		});
	}

	//  CELEBRATION
	triggerCelebration() {
		if (this.isCelebrating) return;
		this.isCelebrating = true;

		// Show message
		this.message.classList.add("show");

		// Neon ring effect
		this.neonRing.classList.add("active");

		// Launch multiple fireworks
		this.launchFireworksShow();

		// Create confetti
		this.createConfetti(150);

		// Play celebration sound
		this.playCelebrationSound();

		// Reset after animation
		setTimeout(() => {
			this.message.classList.remove("show");
			this.neonRing.classList.remove("active");
			this.isCelebrating = false;
		}, 5000);
	}

	//  FIREWORKS
	createFirework(x, y, particleCount = 30) {
		const colors = [
			"#ff0000",
			"#ffd700",
			"#00ff00",
			"#00ffff",
			"#ff00ff",
			"#ff6b6b",
			"#4ecdc4",
			"#a29bfe"
		];
		const color = colors[Math.floor(Math.random() * colors.length)];

		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement("div");
			particle.className = "firework-particle";

			const angle = (i / particleCount) * Math.PI * 2;
			const velocity = Math.random() * 100 + 50;
			const tx = Math.cos(angle) * velocity;
			const ty = Math.sin(angle) * velocity;

			particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            background: ${color};
            box-shadow: 0 0 6px ${color}, 0 0 12px ${color};
            --tx: ${tx}px;
            --ty: ${ty}px;
          `;

			this.fireworksContainer.appendChild(particle);

			setTimeout(() => particle.remove(), 1500);
		}
	}

	launchFireworksShow() {
		const duration = 5000;
		const interval = 200;
		let elapsed = 0;

		const fireworkInterval = setInterval(() => {
			const x = Math.random() * window.innerWidth;
			const y = Math.random() * (window.innerHeight * 0.6);
			this.createFirework(x, y, Math.floor(Math.random() * 30 + 20));

			elapsed += interval;
			if (elapsed >= duration) {
				clearInterval(fireworkInterval);
			}
		}, interval);
	}

	//  CONFETTI
	createConfetti(count) {
		const colors = [
			"#ff0000",
			"#ffd700",
			"#00ff00",
			"#00ffff",
			"#ff00ff",
			"#ff6b6b"
		];

		for (let i = 0; i < count; i++) {
			setTimeout(() => {
				const confetti = document.createElement("div");
				confetti.className = "confetti";
				confetti.style.cssText = `
              left: ${Math.random() * 100}%;
              background: ${colors[Math.floor(Math.random() * colors.length)]};
              width: ${Math.random() * 10 + 5}px;
              height: ${Math.random() * 15 + 10}px;
              animation-duration: ${Math.random() * 2 + 2}s;
              animation-delay: ${Math.random() * 0.5}s;
            `;
				document.body.appendChild(confetti);

				setTimeout(() => confetti.remove(), 4000);
			}, Math.random() * 500);
		}
	}

	//  AUDIO
	toggleAudio() {
		if (!this.audioContext) {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}

		this.isAudioPlaying = !this.isAudioPlaying;

		if (this.isAudioPlaying) {
			this.playBackgroundMusic();
			document.getElementById("audioIcon").style.opacity = "1";
		} else {
			if (this.oscillator) {
				this.oscillator.stop();
				this.oscillator = null;
			}
			document.getElementById("audioIcon").style.opacity = "0.5";
		}
	}

	playBackgroundMusic() {
		// Simple synthesized celebration melody
		const melody = [
			523.25,
			587.33,
			659.25,
			698.46,
			783.99,
			698.46,
			659.25,
			587.33
		];
		let noteIndex = 0;

		const playNote = () => {
			if (!this.isAudioPlaying) return;

			this.oscillator = this.audioContext.createOscillator();
			const gainNode = this.audioContext.createGain();

			this.oscillator.connect(gainNode);
			gainNode.connect(this.audioContext.destination);

			this.oscillator.frequency.value = melody[noteIndex];
			this.oscillator.type = "sine";

			gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				this.audioContext.currentTime + 0.5
			);

			this.oscillator.start();
			this.oscillator.stop(this.audioContext.currentTime + 0.5);

			noteIndex = (noteIndex + 1) % melody.length;

			setTimeout(playNote, 500);
		};

		playNote();
	}

	playCelebrationSound() {
		if (!this.audioContext) {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		}

		// Create a celebration sound effect
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(
			800,
			this.audioContext.currentTime + 0.1
		);
		oscillator.frequency.exponentialRampToValueAtTime(
			600,
			this.audioContext.currentTime + 0.2
		);

		gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(
			0.01,
			this.audioContext.currentTime + 0.3
		);

		oscillator.start();
		oscillator.stop(this.audioContext.currentTime + 0.3);
	}
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	new GrandFinale();
});
