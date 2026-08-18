const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runLinksBlockCenterTest() {
	console.log('--- Running LinksBlock Vertical Centering Test ---');

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

		const metrics = await page.evaluate(() => {
			const linksBlock = document.querySelector('.linksBlock');
			const buttonsContainer = document.querySelector('.buttonsContainer');
			if (!linksBlock || !buttonsContainer) return null;

			const blockRect = linksBlock.getBoundingClientRect();
			const buttonsRect = buttonsContainer.getBoundingClientRect();

			// Calculate top and bottom distance of buttons inside linksBlock
			const topOffset = buttonsRect.top - blockRect.top;
			const bottomOffset = blockRect.bottom - buttonsRect.bottom;

			const style = window.getComputedStyle(linksBlock);
			const containerStyle = window.getComputedStyle(buttonsContainer);

			return {
				alignItems: style.alignItems,
				alignContent: containerStyle.alignContent,
				topOffset,
				bottomOffset,
				offsetDifference: Math.abs(topOffset - bottomOffset)
			};
		});

		console.log('LinksBlock layout metrics:', metrics);
		assert.ok(metrics !== null, '.linksBlock and .buttonsContainer elements must exist');
		assert.strictEqual(metrics.alignItems, 'center', '.linksBlock align-items must be "center"');
		assert.strictEqual(metrics.alignContent, 'center', '.buttonsContainer align-content must be "center"');
		assert.ok(metrics.offsetDifference < 10, 'Buttons container must be vertically centered inside linksBlock!');

		// Take screenshot
		const screenshotDir = path.resolve(__dirname, '../artifacts_output');
		if (!fs.existsSync(screenshotDir)) {
			fs.mkdirSync(screenshotDir, { recursive: true });
		}
		const screenshotPath = path.join(screenshotDir, 'linksblock_centered.png');
		await page.screenshot({ path: screenshotPath });
		console.log('Screenshot saved to:', screenshotPath);

		console.log('--- LinksBlock Vertical Centering Test Passed! ---');
	} finally {
		await browser.close();
	}
}

if (require.main === module) {
	runLinksBlockCenterTest().catch(err => {
		console.error('Test Failed:', err);
		process.exit(1);
	});
}

module.exports = { runLinksBlockCenterTest };
