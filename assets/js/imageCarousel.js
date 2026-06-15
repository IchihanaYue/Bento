// Image Carousel for imageBlock
// Cycles through all images in assets/floating-img/

(function () {
	const floatingImages = [
		'assets/floating-img/GhdXPCPakAA3XCs.jfif',
		'assets/floating-img/GhdtMl9bgAAJI0g.jfif',
		'assets/floating-img/GhdtTUYacAADz0v.jfif',
		'assets/floating-img/Ghej89jacAIPBZw.png',
	];

	const CYCLE_INTERVAL = 10000; // 10 seconds between transitions
	const SLIDE_DURATION = 800; // ms for slide transition

	let currentIndex = 0;
	const imageBlock = document.getElementById('imageBlock');
	if (!imageBlock) return;

	// Pick a random starting image
	currentIndex = Math.floor(Math.random() * floatingImages.length);

	// Create an inner wrapper to handle overflowing and positioning
	// This prevents the padding from being an issue while retaining original layout
	const innerWrapper = document.createElement('div');
	innerWrapper.style.position = 'relative';
	innerWrapper.style.width = '100%';
	innerWrapper.style.height = '100%';
	innerWrapper.style.overflow = 'hidden';
	innerWrapper.style.display = 'block';
	
	innerWrapper.className = 'carousel-wrapper';

	// Setup the existing image
	const existingImg = imageBlock.querySelector('img');
	if (existingImg) {
		existingImg.src = floatingImages[currentIndex];
		existingImg.style.position = 'absolute';
		existingImg.style.left = '0%';
		existingImg.style.top = '0%';
		existingImg.style.width = '100%';
		existingImg.style.height = '100%';
		
		// Transition only for slide effect now
		existingImg.style.transition = `left ${SLIDE_DURATION}ms ease-in-out`;

		// Wrap the image
		imageBlock.innerHTML = '';
		innerWrapper.appendChild(existingImg);
		imageBlock.appendChild(innerWrapper);
	}

	function cycleImage() {
		const nextIndex = (currentIndex + 1) % floatingImages.length;

		// Create the next image off-screen to the right
		const nextImg = document.createElement('img');
		nextImg.src = floatingImages[nextIndex];
		nextImg.style.position = 'absolute';
		nextImg.style.left = '100%'; // Start outside the view
		nextImg.style.top = '0%';
		nextImg.style.width = '100%';
		nextImg.style.height = '100%';
		nextImg.style.transition = `left ${SLIDE_DURATION}ms ease-in-out`;
		nextImg.alt = 'Carousel Image';

		innerWrapper.appendChild(nextImg);

		// Force reflow so the browser registers the starting position before animating
		void nextImg.offsetWidth;

		// Find the current image (the one currently at left: 0%)
		// In some rare cases, multiple images might be there if transitions overlap,
		// but the first child is the oldest one being viewed.
		const currentImg = innerWrapper.children[0];

		// Animate both images: current moves left, next moves in
		currentImg.style.left = '-100%';
		nextImg.style.left = '0%';

		// Clean up the old image after the transition completes
		setTimeout(() => {
			if (currentImg && currentImg.parentNode) {
				currentImg.parentNode.removeChild(currentImg);
			}
		}, SLIDE_DURATION);

		currentIndex = nextIndex;
	}

	setInterval(cycleImage, CYCLE_INTERVAL);
})();
