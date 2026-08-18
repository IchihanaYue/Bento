const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runAudioPlaybackTest() {
	console.log('--- Running Real Audio Playback TDD Tests ---');

	const musicsDir = path.resolve(__dirname, '../assets/musics');
	assert.ok(fs.existsSync(musicsDir), 'assets/musics directory must exist');

	const audioFiles = fs.readdirSync(musicsDir);
	console.log('Files in assets/musics:', audioFiles);
	assert.ok(audioFiles.length > 0, 'assets/musics directory must contain audio files');

	const browser = await puppeteer.launch({
		executablePath: EDGE_PATH,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
	});

	try {
		const page = await browser.newPage();
		await page.setViewport({ width: 1536, height: 864 });

		const indexPath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
		await page.goto(indexPath, { waitUntil: 'load' });

		// Check audio source configuration
		const currentAudioSrc = await page.evaluate(() => {
			const audio = window.bentoAudio;
			return audio ? audio.src : null;
		});

		console.log('Current Audio src:', currentAudioSrc);
		assert.ok(currentAudioSrc !== null && currentAudioSrc.includes('assets/musics'), 'Audio src must load from assets/musics');

		// Click Play
		await page.click('#playPauseBtn');
		await page.evaluate(() => new Promise(r => setTimeout(r, 500)));

		const isAudioPlaying = await page.evaluate(() => {
			const audio = window.bentoAudio;
			return audio ? !audio.paused : false;
		});

		console.log('Is audio playing after click?:', isAudioPlaying);
		assert.strictEqual(isAudioPlaying, true, 'Audio must be playing after play button click');

		// Click Next Track
		await page.click('#nextTrackBtn');
		await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

		const nextAudioSrc = await page.evaluate(() => {
			const audio = window.bentoAudio;
			return audio ? audio.src : null;
		});

		console.log('Next Audio src:', nextAudioSrc);
		assert.notStrictEqual(nextAudioSrc, currentAudioSrc, 'Audio src should change to next track in assets/musics');

		console.log('--- Audio Playback Tests Passed Successfully! ---');
	} finally {
		await browser.close();
	}
}

if (require.main === module) {
	runAudioPlaybackTest().catch(err => {
		console.error('Test Failed:', err);
		process.exit(1);
	});
}

module.exports = { runAudioPlaybackTest };
