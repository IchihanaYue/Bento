// ┌┬┐┬┌┬┐┌─┐
//  │ ││││├┤
//  ┴ ┴┴ ┴└─┘
// Set time and Date

function displayClock() {
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	const d = new Date();
	const dayName = dayNames[d.getDay()];
	const mm = monthNames[d.getMonth()];
	const dd = d.getDate();
	const yyyy = d.getFullYear();

	const min = ('0' + d.getMinutes()).slice(-2);
	let hh = d.getHours();
	let ampm = '';

	if (CONFIG.twelveHourFormat) {
		ampm = hh >= 12 ? ' pm' : ' am';
		hh = hh % 12;
		hh = hh ? hh : 12;
	}

	const hourElem = document.getElementById('hour');
	const sepElem = document.getElementById('separator');
	const minElem = document.getElementById('minutes');

	if (hourElem) hourElem.innerText = hh;
	if (sepElem) sepElem.innerText = ':';
	if (minElem) minElem.innerText = min + ampm;

	const fullDateElem = document.getElementById('full-date');
	if (fullDateElem) {
		fullDateElem.innerText = `${dayName}, ${mm} ${dd}, ${yyyy}`;
	}

	const monthElem = document.getElementById('month');
	const dayElem = document.getElementById('day');
	if (monthElem) monthElem.innerText = mm;
	if (dayElem) dayElem.innerText = dd;

	setTimeout(displayClock, 1000);
}

displayClock();
