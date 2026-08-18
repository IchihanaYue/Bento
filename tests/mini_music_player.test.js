const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runMiniMusicPlayerTests() {
	console.log('--- Running Mini Music Player TDD Tests ---');

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

		// 1. Verify miniMusicBlock container exists below search bar
		const miniPlayer = await page.$('#miniMusicBlock');
		assert.ok(miniPlayer !== null, '#miniMusicBlock element must exist in DOM');

		// 2. Verify spinning disk element exists
		const spinningDisk = await page.$('#spinningDisk');
		assert.ok(spinningDisk !== null, '#spinningDisk element must exist');

		// 3. Verify tag banner with track title and controls exist
		const trackTitle = await page.$eval('#trackTitle', el => el.innerText.trim());
		console.log('Initial track title:', trackTitle);
		assert.ok(trackTitle.length > 0, 'Track title must not be empty');

		const playPauseBtn = await page.$('#playPauseBtn');
		const prevBtn = await page.$('#prevTrackBtn');
		const nextBtn = await page.$('#nextTrackBtn');

		assert.ok(playPauseBtn !== null, '#playPauseBtn must exist');
		assert.ok(prevBtn !== null, '#prevTrackBtn must exist');
		assert.ok(nextBtn !== null, '#nextTrackBtn must exist');

		// 4. Test Play/Pause toggle animation class / state
		let isSpinningBefore = await page.$eval('#spinningDisk', el => el.classList.contains('is-playing'));
		console.log('Disk spinning state before click:', isSpinningBefore);

		await page.click('#playPauseBtn');
		await page.evaluate(() => new Promise(r => setTimeout(r, 300)));

		let isSpinningAfter = await page.$eval('#spinningDisk', el => el.classList.contains('is-playing'));
		console.log('Disk spinning state after click:', isSpinningAfter);
		assert.strictEqual(isSpinningAfter, true, 'Disk should add is-playing class when play button clicked!');

		// 5. Test next track button
		await page.click('#nextTrackBtn');
		await page.evaluate(() => new Promise(r => setTimeout(r, 200)));

		const newTrackTitle = await page.$eval('#trackTitle', el => el.innerText.trim());
		console.log('Next track title:', newTrackTitle);
		assert.notStrictEqual(newTrackTitle, trackTitle, 'Track title should change when next button clicked');

		// Take screenshot of mini music player
		const screenshotDir = path.resolve(__dirname, '../artifacts_output');
		if (!fs.existsSync(screenshotDir)) {
			fs.mkdirSync(screenshotDir, { recursive: true });
		}
		const screenshotPath = path.join(screenshotDir, 'mini_music_player.png');
		await page.screenshot({ path: screenshotPath });
		console.log('Screenshot saved to:', screenshotPath);

		console.log('--- Mini Music Player Tests Passed Successfully! ---');
	} finally {
		await browser.close();
	}
}

if (require.main === module) {
	runMiniMusicPlayerTests().catch(err => {
		console.error('Test Failed:', err);
		process.exit(1);
	});
}

module.exports = { runMiniMusicPlayerTests };
