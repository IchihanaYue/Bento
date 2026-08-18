const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runAutoDetectMusicsTest() {
	console.log('--- Running Auto-Detect Musics TDD Tests ---');

	const musicsDir = path.resolve(__dirname, '../assets/musics');
	const indexJsonPath = path.join(musicsDir, 'index.json');

	assert.ok(fs.existsSync(indexJsonPath), 'assets/musics/index.json file must exist for auto-detection');

	const indexFiles = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));
	console.log('Detected files in index.json:', indexFiles);
	assert.ok(Array.isArray(indexFiles) && indexFiles.length > 0, 'index.json must contain array of music filenames');

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

		// Evaluate auto-detected playlist in browser
		const detectedPlaylist = await page.evaluate(() => {
			return window.bentoPlaylist || [];
		});

		console.log('Browser Auto-Detected Playlist:', detectedPlaylist);
		assert.ok(detectedPlaylist.length >= indexFiles.length, 'Auto-detected playlist length must match or exceed files in assets/musics/index.json');

		// Verify first track matches first file in index.json
		const firstFile = indexFiles[0];
		const firstTrack = detectedPlaylist[0];
		assert.ok(firstTrack.src.includes(firstFile), `First track src (${firstTrack.src}) must contain filename (${firstFile})`);

		console.log('--- Auto-Detect Musics Tests Passed Successfully! ---');
	} finally {
		await browser.close();
	}
}

if (require.main === module) {
	runAutoDetectMusicsTest().catch(err => {
		console.error('Test Failed:', err);
		process.exit(1);
	});
}

module.exports = { runAutoDetectMusicsTest };
