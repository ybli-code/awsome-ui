// Ring Particles, using a CSS Houdinig PaintWorklet
if ('paintWorklet' in CSS) {
	
	// Register the PaintWorklet
	CSS.paintWorklet.addModule(
		'https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js'
	);
	
	// The ring should follow the mouse on hover
	// In the future this can hopefull be done with CSS,
	// if the CSSWG ever comes to tackling https://github.com/w3c/csswg-drafts/issues/6733
	let isInteractive = false;
	const $welcome = document.querySelector('#welcome');
	$welcome.addEventListener('pointermove', (e) => {
		if (!isInteractive) { $welcome.classList.add('interactive'); isInteractive = true; }
		$welcome.style.setProperty('--ring-x', (e.clientX / window.innerWidth) * 100);
		$welcome.style.setProperty('--ring-y', (e.clientY / window.innerHeight) * 100);
		$welcome.style.setProperty('--ring-interactive', 1);
	});
	$welcome.addEventListener('pointerleave', (e) => {
		$welcome.classList.remove('interactive'); isInteractive = false;
		$welcome.style.setProperty('--ring-x', 50);
		$welcome.style.setProperty('--ring-y', 50);
		$welcome.style.setProperty('--ring-interactive', 0);
	});
}