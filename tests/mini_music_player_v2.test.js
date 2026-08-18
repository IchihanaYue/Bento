const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runMiniMusicPlayerV2Test() {
	console.log('--- Running Mini Music Player V2 Layout TDD Tests ---');

	const browser = await puppeteer.launch({
		executablePath: EDGE_PATH,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	try {
		const page = await browser.newPage();
		await page.setViewport({ width: 1536, height: 864 });

		const indexPath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
		await page.goto(indexPath, { waitUntil: 'load' });

		// 1. Verify cover image is removed from disk
		const musicCover = await page.$('#musicCover');
		assert.strictEqual(musicCover, null, '#musicCover image should be removed from disk!');

		// 2. Verify vinyl center hole exists
		const vinylHole = await page.$('.vinyl-center-hole');
		assert.ok(vinylHole !== null, '.vinyl-center-hole element must exist inside disk');

		// 3. Verify track info text is positioned OUTSIDE / ABOVE .music-tag-banner
		const isTextOutsideTag = await page.evaluate(() => {
			const tagBanner = document.querySelector('.music-tag-banner');
			const trackInfo = document.querySelector('.tag-track-info');
			if (!tagBanner || !trackInfo) return false;

			// trackInfo should NOT be a child of tagBanner
			const isChild = tagBanner.contains(trackInfo);
			const trackRect = trackInfo.getBoundingClientRect();
			const tagRect = tagBanner.getBoundingClientRect();

			// trackInfo top should be above tagBanner top
			return !isChild && trackRect.top < tagRect.top;
		});

		console.log('Is track text positioned above tag banner?:', isTextOutsideTag);
		assert.strictEqual(isTextOutsideTag, true, 'Track info text must sit above the tag banner!');

		// 4. Verify only media controls exist inside tag banner
		const controlsInsideTag = await page.evaluate(() => {
			const tagBanner = document.querySelector('.music-tag-banner');
			const controls = tagBanner ? tagBanner.querySelector('.mini-music-controls') : null;
			return controls !== null;
		});
		assert.strictEqual(controlsInsideTag, true, 'Media controls must stay inside tag banner!');

		// 5. Test Play/Pause toggle spinning state
		await page.click('#playPauseBtn');
		await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

		const isSpinning = await page.$eval('#spinningDisk', el => el.classList.contains('is-playing'));
		assert.strictEqual(isSpinning, true, 'Vinyl disk must spin when play button clicked!');

		// Take screenshot
		const screenshotDir = path.resolve(__dirname, '../artifacts_output');
		if (!fs.existsSync(screenshotDir)) {
			fs.mkdirSync(screenshotDir, { recursive: true });
		}
		const screenshotPath = path.join(screenshotDir, 'mini_music_player_v2.png');
		await page.screenshot({ path: screenshotPath });
		console.log('Screenshot saved to:', screenshotPath);

		console.log('--- Mini Music Player V2 Tests Passed! ---');
	} finally {
		await browser.close();
	}
}

if (require.main === module) {
	runMiniMusicPlayerV2Test().catch(err => {
		console.error('Test Failed:', err);
		process.exit(1);
	});
}

module.exports = { runMiniMusicPlayerV2Test };
