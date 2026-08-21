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
	let isAnimating = false;
	let timer = null;

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
		card.innerHTML = `<img src="${imgSrc}" alt="Carousel Artwork" loading="lazy">`;
		return card;
	}

	let leftCard = createCard(floatingImages[getIndex(-1)], 'peek-left');
	let centerCard = createCard(floatingImages[getIndex(0)], 'peek-center');
	let rightCard = createCard(floatingImages[getIndex(1)], 'peek-right');

	track.appendChild(leftCard);
	track.appendChild(centerCard);
	track.appendChild(rightCard);

	function cycleNext() {
		if (isAnimating) return;
		isAnimating = true;
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
			isAnimating = false;
		}, TRANSITION_DURATION);

		// Update card references
		leftCard = centerCard;
		centerCard = rightCard;
		rightCard = newRightCard;
	}

	function cyclePrev() {
		if (isAnimating) return;
		isAnimating = true;
		activeIndex = (activeIndex - 1 + total) % total;

		// Current right card moves to far right and gets removed
		rightCard.className = 'peek-card peek-far-right';

		// Current center becomes right peeking card
		centerCard.className = 'peek-card peek-right';

		// Current left becomes center active card
		leftCard.className = 'peek-card peek-center';

		// Create new left peeking card entering from far left
		const newLeftIndex = getIndex(-1);
		const newLeftCard = createCard(floatingImages[newLeftIndex], 'peek-far-left');
		track.insertBefore(newLeftCard, track.firstChild);

		// Force reflow
		void newLeftCard.offsetWidth;

		// Move new left card into peek-left position
		newLeftCard.className = 'peek-card peek-left';

		// Cleanup old right card
		const oldRight = rightCard;
		setTimeout(() => {
			if (oldRight && oldRight.parentNode) {
				oldRight.parentNode.removeChild(oldRight);
			}
			isAnimating = false;
		}, TRANSITION_DURATION);

		// Update card references
		rightCard = centerCard;
		centerCard = leftCard;
		leftCard = newLeftCard;
	}

	function resetTimer() {
		if (timer) clearInterval(timer);
		timer = setInterval(cycleNext, CYCLE_INTERVAL);
	}

	// Click on peeking cards to navigate
	track.addEventListener('click', (e) => {
		const targetCard = e.target.closest('.peek-card');
		if (!targetCard) return;
		if (targetCard.classList.contains('peek-left')) {
			cyclePrev();
			resetTimer();
		} else if (targetCard.classList.contains('peek-right')) {
			cycleNext();
			resetTimer();
		}
	});

	// Touch swipe support for mobile / tablets
	let touchStartX = 0;
	let touchStartY = 0;

	track.addEventListener('touchstart', (e) => {
		if (e.touches.length === 1) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		}
	}, { passive: true });

	track.addEventListener('touchend', (e) => {
		if (e.changedTouches.length === 1) {
			const deltaX = e.changedTouches[0].clientX - touchStartX;
			const deltaY = e.changedTouches[0].clientY - touchStartY;
			if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX < 0) {
					cycleNext();
				} else {
					cyclePrev();
				}
				resetTimer();
			}
		}
	}, { passive: true });

	resetTimer();
})();
