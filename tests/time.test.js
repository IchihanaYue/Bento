const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTests() {
	console.log('Starting automated tests with Microsoft Edge...');

	const browser = await puppeteer.launch({
		executablePath: EDGE_PATH,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	try {
		const page = await browser.newPage();
		await page.setViewport({ width: 1280, height: 800 });

		const indexPath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
		console.log('Loading page:', indexPath);
		await page.goto(indexPath, { waitUntil: 'load' });

		// Verify hour, separator, minutes exist
		const hourText = await page.$eval('#hour', el => el.innerText.trim());
		const separatorText = await page.$eval('#separator', el => el.innerText.trim());
		const minutesText = await page.$eval('#minutes', el => el.innerText.trim());

		console.log(`Clock rendered: ${hourText}${separatorText}${minutesText}`);
		assert.ok(hourText.length > 0, 'Hour should not be empty');
		assert.ok(minutesText.length > 0, 'Minutes should not be empty');

		// Verify #full-date exists and has expected format (e.g., "Monday, Aug 17, 2026")
		const fullDateElem = await page.$('#full-date');
		assert.ok(fullDateElem !== null, '#full-date element must exist in DOM');

		const fullDateText = await page.$eval('#full-date', el => el.innerText.trim());
		console.log('Full date rendered:', fullDateText);

		// Format regex check: Weekday, Month Day, Year (e.g. "Monday, Aug 17, 2026")
		const datePattern = /^[A-Z][a-z]+,\s[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$/;
		assert.ok(datePattern.test(fullDateText), `Full date "${fullDateText}" should match pattern "Weekday, Month Day, Year"`);

		// Verify greetings element inside .time-header
		const greetingsText = await page.$eval('#greetings', el => el.innerText.trim());
		console.log('Greetings rendered:', greetingsText);
		assert.ok(greetingsText.length > 0, 'Greetings should not be empty');

		// Verify date-pill structure
		const pillBtn = await page.$('.date-pill .date-pill-icon-btn');
		assert.ok(pillBtn !== null, '.date-pill-icon-btn should exist inside .date-pill');

		// Verify peeking carousel images in imageBlock (Left, Center, Right)
		const imagesInBlock = await page.$$eval('#imageBlock img', imgs => imgs.length);
		console.log('Images count in imageBlock:', imagesInBlock);
		assert.ok(imagesInBlock >= 3, 'imageBlock should contain at least 3 peeking carousel card images');


		// Focus search input to demonstrate focus border
		await page.focus('.search-input');

		// Take visual screenshot for verification

		const screenshotDir = path.resolve(__dirname, '../artifacts_output');
		if (!fs.existsSync(screenshotDir)) {
			fs.mkdirSync(screenshotDir, { recursive: true });
		}
		const screenshotPath = path.join(screenshotDir, 'redesigned_bento.png');
		await page.screenshot({ path: screenshotPath });
		console.log('Screenshot saved to:', screenshotPath);


		console.log('ALL TESTS PASSED SUCCESSFULLY!');
	} finally {
		await browser.close();
	}
}

runTests().catch(err => {
	console.error('TEST FAILED:', err);
	process.exit(1);
});
