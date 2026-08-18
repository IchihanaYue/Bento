// Music Player Interactivity for Bento (Auto-Detection HTML5 Engine)
(function () {
	let playlist = [
		{
			title: 'Fly-Day Chinatown',
			artist: 'Ichihana Yue',
			src: 'assets/musics/01 - Fly-Day Chinatown.flac',
		},
		{
			title: 'Daydream',
			artist: 'Ichihana Yue',
			src: 'assets/musics/02 Daydream.flac',
		},
		{
			title: 'Paul Porry Polor',
			artist: 'Ichihana Yue',
			src: 'assets/musics/07 - Paul Porry Polor.flac',
		},
	];

	let trackIndex = 0;
	const audio = new Audio();
	window.bentoAudio = audio;
	window.bentoPlaylist = playlist;

	const titleElem = document.getElementById('trackTitle');
	const artistElem = document.getElementById('trackArtist');
	const playPauseBtn = document.getElementById('playPauseBtn');
	const nextBtn = document.getElementById('nextTrackBtn');
	const prevBtn = document.getElementById('prevTrackBtn');
	const spinningDisk = document.getElementById('spinningDisk');

	if (!titleElem) return;

	function parseFilenameToTrack(filename) {
		const nameWithoutExt = filename.replace(/\.(mp3|wav|ogg|m4a|flac)$/i, '');
		const cleanName = nameWithoutExt.replace(/^\d+[\s\-_]*/, '').trim();

		if (cleanName.includes(' - ')) {
			const parts = cleanName.split(' - ');
			return {
				title: parts[1].trim(),
				artist: parts[0].trim(),
				src: `assets/musics/${filename}`
			};
		}

		return {
			title: cleanName || filename,
			artist: 'Ichihana Yue',
			src: `assets/musics/${filename}`
		};
	}

	function updatePlayState(isPlaying) {
		if (spinningDisk) {
			if (isPlaying) {
				spinningDisk.classList.add('is-playing');
			} else {
				spinningDisk.classList.remove('is-playing');
			}
		}
		if (playPauseBtn) {
			playPauseBtn.innerHTML = isPlaying ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';
			if (window.lucide) window.lucide.createIcons();
		}
	}

	function loadTrack(index, shouldPlay = false) {
		if (!playlist || playlist.length === 0) return;
		trackIndex = (index + playlist.length) % playlist.length;
		const track = playlist[trackIndex];

		if (titleElem) titleElem.innerText = track.title;
		if (artistElem) artistElem.innerText = track.artist;

		audio.src = track.src;
		audio.load();

		if (shouldPlay) {
			playAudio();
		} else {
			updatePlayState(false);
		}
	}

	function playAudio() {
		audio.play().then(() => {
			updatePlayState(true);
		}).catch(err => {
			console.log('Audio playback error / autoplay policy:', err);
			updatePlayState(false);
		});
	}

	function pauseAudio() {
		audio.pause();
		updatePlayState(false);
	}

	function togglePlay() {
		if (audio.paused) {
			playAudio();
		} else {
			pauseAudio();
		}
	}

	function nextTrack(autoPlay = true) {
		loadTrack(trackIndex + 1, autoPlay);
	}

	function prevTrack(autoPlay = true) {
		loadTrack(trackIndex - 1, autoPlay);
	}

	// Auto-detect audio files from assets/musics/index.json
	async function autoDetectMusics() {
		try {
			const response = await fetch('assets/musics/index.json');
			if (response.ok) {
				const filenames = await response.json();
				if (Array.isArray(filenames) && filenames.length > 0) {
					playlist = filenames.map(parseFilenameToTrack);
					window.bentoPlaylist = playlist;
				}
			}
		} catch (e) {
			console.log('Using default detected musics playlist:', e);
		}
		loadTrack(0, false);
	}

	if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
	if (nextBtn) nextBtn.addEventListener('click', () => nextTrack(!audio.paused));
	if (prevBtn) prevBtn.addEventListener('click', () => prevTrack(!audio.paused));

	audio.addEventListener('play', () => updatePlayState(true));
	audio.addEventListener('pause', () => updatePlayState(false));
	audio.addEventListener('ended', () => nextTrack(true));

	// Initialize auto-detection
	autoDetectMusics();
})();
