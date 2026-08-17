// Image Carousel for imageBlock
// Cover Flow / Peeking Carousel: Displays 1 focused image in the center with previous and next images peeking on left & right sides.

(function () {
	const floatingImages = [
		'assets/floating-img/Ghej89jacAIPBZw.png',
		'assets/floating-img/GhdtMl9bgAAJI0g.jfif',
		'assets/floating-img/GhdXPCPakAA3XCs.jfif',
		'assets/floating-img/GhdtTUYacAADz0v.jfif',
	];

	const CYCLE_INTERVAL = 8000;
	const TRANSITION_DURATION = 800;

	const imageBlock = document.getElementById('imageBlock');
	if (!imageBlock) return;

	let activeIndex = 0;
	const total = floatingImages.length;

	// Viewport track
	const track = document.createElement('div');
	track.className = 'peek-carousel-track';
	imageBlock.innerHTML = '';
	imageBlock.appendChild(track);

	function getIndex(offset) {
		return (activeIndex + offset + total) % total;
	}

	function createCard(imgSrc, positionClass) {
		const card = document.createElement('div');
		card.className = `peek-card ${positionClass}`;
		card.innerHTML = `<img src="${imgSrc}" alt="Carousel Artwork">`;
		return card;
	}

	let leftCard = createCard(floatingImages[getIndex(-1)], 'peek-left');
	let centerCard = createCard(floatingImages[getIndex(0)], 'peek-center');
	let rightCard = createCard(floatingImages[getIndex(1)], 'peek-right');

	track.appendChild(leftCard);
	track.appendChild(centerCard);
	track.appendChild(rightCard);

	function cycleNext() {
		activeIndex = (activeIndex + 1) % total;

		// The current left card moves to far left and gets removed
		leftCard.className = 'peek-card peek-far-left';

		// The current center card becomes the left peeking card
		centerCard.className = 'peek-card peek-left';

		// The current right card becomes the center active card
		rightCard.className = 'peek-card peek-center';

		// Create new right peeking card entering from far right
		const newRightIndex = getIndex(1);
		const newRightCard = createCard(floatingImages[newRightIndex], 'peek-far-right');
		track.appendChild(newRightCard);

		// Force reflow
		void newRightCard.offsetWidth;

		// Move new right card into peek-right position
		newRightCard.className = 'peek-card peek-right';

		// Cleanup old left card
		const oldLeft = leftCard;
		setTimeout(() => {
			if (oldLeft && oldLeft.parentNode) {
				oldLeft.parentNode.removeChild(oldLeft);
			}
		}, TRANSITION_DURATION);

		// Update card references
		leftCard = centerCard;
		centerCard = rightCard;
		rightCard = newRightCard;
	}

	setInterval(cycleNext, CYCLE_INTERVAL);
})();




