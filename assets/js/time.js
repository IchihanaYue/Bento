// ┌┬┐┬┌┬┐┌─┐
//  │ ││││├┤
//  ┴ ┴┴ ┴└─┘
// Set time and Date

window.onload = displayClock();
function displayClock() {
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var d = new Date();
	var dayName = dayNames[d.getDay()];
	var mm = monthNames[d.getMonth()];
	var dd = d.getDate();
	var yyyy = d.getFullYear();

	var min = ('0' + d.getMinutes()).slice(-2);
	var hh = d.getHours();
	var ampm = '';

	if (CONFIG.twelveHourFormat) {
		ampm = hh >= 12 ? ' pm' : ' am';
		hh = hh % 12;
		hh = hh ? hh : 12;
	}

	var hourElem = document.getElementById('hour');
	var sepElem = document.getElementById('separator');
	var minElem = document.getElementById('minutes');

	if (hourElem) hourElem.innerText = hh;
	if (sepElem) sepElem.innerText = ':';
	if (minElem) minElem.innerText = min + ampm;

	var fullDateElem = document.getElementById('full-date');
	if (fullDateElem) {
		fullDateElem.innerText = `${dayName}, ${mm} ${dd}, ${yyyy}`;
	}

	var monthElem = document.getElementById('month');
	var dayElem = document.getElementById('day');
	if (monthElem) monthElem.innerText = mm;
	if (dayElem) dayElem.innerText = dd;

	setTimeout(displayClock, 1000);
}

