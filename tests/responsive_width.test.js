const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const VIEWPORTS = [
	{ name: 'laptop-1366x768', width: 1366, height: 768 },
	{ name: 'laptop-1536x864', width: 1536, height: 864 },
	{ name: 'desktop-1920x1080', width: 1920, height: 1080 },
	{ name: 'desktop-2560x1440', width: 2560, height: 1440 },
	{ name: 'ultrawide-3440x1440', width: 3440, height: 1440 },
	{ name: 'tablet-1024x768', width: 1024, height: 768 },
	{ name: 'mobile-390x844', width: 390, height: 844 }
];

async function runResponsiveTests() {
	console.log('--- Running Responsive Width & Layout Tests ---');

	const browser = await puppeteer.launch({
		executablePath: EDGE_PATH,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	try {
		const page = await browser.newPage();
		const indexPath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

		const results = [];

		for (const vp of VIEWPORTS) {
			await page.setViewport({ width: vp.width, height: vp.height });
			await page.goto(indexPath, { waitUntil: 'load' });

			// Check layout metrics
			const metrics = await page.evaluate(() => {
				const body = document.body;
				const container = document.querySelector('.container');
				const searchForm = document.querySelector('.search-form');
				const timeBlock = document.querySelector('.timeBlock');
				const imageBlock = document.querySelector('.imageBlock');
				const linksBlock = document.querySelector('.linksBlock');

				const containerRect = container ? container.getBoundingClientRect() : null;
				const searchRect = searchForm ? searchForm.getBoundingClientRect() : null;
				const timeRect = timeBlock ? timeBlock.getBoundingClientRect() : null;
				const imageRect = imageBlock ? imageBlock.getBoundingClientRect() : null;

				// Check for horizontal overflow
				const hasHorizontalOverflow = body.scrollWidth > body.clientWidth;

				return {
					bodyWidth: body.clientWidth,
					containerWidth: containerRect ? containerRect.width : 0,
					containerLeftMargin: containerRect ? containerRect.left : 0,
					containerRightMargin: containerRect ? (window.innerWidth - containerRect.right) : 0,
					containerWidthRatio: containerRect ? (containerRect.width / window.innerWidth) : 0,
					searchWidthRatio: searchRect && containerRect ? (searchRect.width / containerRect.width) : 0,
					hasHorizontalOverflow
				};
			});

			console.log(`\nViewport [${vp.name}] (${vp.width}x${vp.height}):`);
			console.log(`  Container Width: ${metrics.containerWidth.toFixed(1)}px (${(metrics.containerWidthRatio * 100).toFixed(1)}% of viewport)`);
			console.log(`  Container Margins: Left ${metrics.containerLeftMargin.toFixed(1)}px, Right ${metrics.containerRightMargin.toFixed(1)}px`);
			console.log(`  Search/Container Ratio: ${(metrics.searchWidthRatio * 100).toFixed(1)}%`);
			console.log(`  Horizontal Overflow: ${metrics.hasHorizontalOverflow}`);

			results.push({ viewport: vp, metrics });

			// Assertions for responsive consistency
			assert.strictEqual(metrics.hasHorizontalOverflow, false, `Horizontal overflow detected in viewport ${vp.name}!`);
		}

		console.log('\n--- Responsive Test Finished ---');
		return results;
	} finally {
		await browser.close();
	}
}

if (require.main === module) {
	runResponsiveTests().catch(err => {
		console.error('Test Failed:', err);
		process.exit(1);
	});
}

module.exports = { runResponsiveTests };
