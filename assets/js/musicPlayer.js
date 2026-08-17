// Music Player Interactivity for Bento
(function () {
	const playlist = [
		{
			title: 'Cyberpunk Synthwave',
			artist: 'Yue Beats',
			cover: 'assets/floating-img/GhdXPCPakAA3XCs.jfif',
			duration: '3:20',
			seconds: 200,
		},
		{
			title: 'Lo-Fi Chill & Relax',
			artist: 'Ichihana Yue',
			cover: 'assets/floating-img/GhdtMl9bgAAJI0g.jfif',
			duration: '2:45',
			seconds: 165,
		},
		{
			title: 'Midnight Starlight',
			artist: 'Mori Melody',
			cover: 'assets/floating-img/Ghej89jacAIPBZw.png',
			duration: '3:50',
			seconds: 230,
		},
		{
			title: 'Neon Horizon',
			artist: 'Vocaloid Sunset',
			cover: 'assets/floating-img/GhdtTUYacAADz0v.jfif',
			duration: '4:12',
			seconds: 252,
		},
	];

	let trackIndex = 0;
	let isPlaying = false;
	let currentSec = 84; // 1:24 default
	let timer = null;

	const coverElem = document.getElementById('musicCover');
	const titleElem = document.getElementById('trackTitle');
	const artistElem = document.getElementById('trackArtist');
	const currentTimeElem = document.getElementById('currentTime');
	const totalTimeElem = document.getElementById('totalTime');
	const progressFill = document.getElementById('progressBarFill');
	const playPauseBtn = document.getElementById('playPauseBtn');
	const nextBtn = document.getElementById('nextTrackBtn');
	const prevBtn = document.getElementById('prevTrackBtn');
	const progressBg = document.getElementById('progressBarBg');

	if (!titleElem) return;

	function formatTime(secs) {
		const m = Math.floor(secs / 60);
		const s = Math.floor(secs % 60);
		return `${m}:${s < 10 ? '0' : ''}${s}`;
	}

	function updateTrackDisplay() {
		const track = playlist[trackIndex];
		if (coverElem) coverElem.src = track.cover;
		if (titleElem) titleElem.innerText = track.title;
		if (artistElem) artistElem.innerText = track.artist;
		if (totalTimeElem) totalTimeElem.innerText = track.duration;
		currentSec = 0;
		updateProgress();
	}

	function updateProgress() {
		const track = playlist[trackIndex];
		const pct = Math.min(100, (currentSec / track.seconds) * 100);
		if (progressFill) progressFill.style.width = `${pct}%`;
		if (currentTimeElem) currentTimeElem.innerText = formatTime(currentSec);
	}

	function togglePlay() {
		isPlaying = !isPlaying;
		if (isPlaying) {
			if (playPauseBtn) playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
			if (window.lucide) window.lucide.createIcons();
			timer = setInterval(() => {
				currentSec++;
				if (currentSec > playlist[trackIndex].seconds) {
					nextTrack();
				} else {
					updateProgress();
				}
			}, 1000);
		} else {
			if (playPauseBtn) playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
			if (window.lucide) window.lucide.createIcons();
			clearInterval(timer);
		}
	}

	function nextTrack() {
		trackIndex = (trackIndex + 1) % playlist.length;
		updateTrackDisplay();
	}

	function prevTrack() {
		trackIndex = (trackIndex - 1 + playlist.length) % playlist.length;
		updateTrackDisplay();
	}

	if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
	if (nextBtn) nextBtn.addEventListener('click', nextTrack);
	if (prevBtn) prevBtn.addEventListener('click', prevTrack);

	if (progressBg) {
		progressBg.addEventListener('click', (e) => {
			const rect = progressBg.getBoundingClientRect();
			const clickPos = (e.clientX - rect.left) / rect.width;
			currentSec = Math.floor(clickPos * playlist[trackIndex].seconds);
			updateProgress();
		});
	}
})();
