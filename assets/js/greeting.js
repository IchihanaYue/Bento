// ┌─┐┬─┐┌─┐┌─┐┌┬┐┬┌┐┌┌─┐┌─┐
// │ ┬├┬┘├┤ ├┤  │ │││││ ┬└─┐
// └─┘┴└─└─┘└─┘ ┴ ┴┘└┘└─┘└─┘
// Function to set Greetings

(function () {
	const greetingsElem = document.getElementById('greetings');
	if (!greetingsElem) return;

	const today = new Date();
	const hour = today.getHours();

	const gree1 = `${CONFIG.greetingNight}\xa0`;
	const gree2 = `${CONFIG.greetingMorning}\xa0`;
	const gree3 = `${CONFIG.greetingAfternoon}\xa0`;
	const gree4 = `${CONFIG.greetingEvening}\xa0`;

	if (hour >= 23 || hour < 6) {
		greetingsElem.innerText = gree1;
	} else if (hour >= 6 && hour < 12) {
		greetingsElem.innerText = gree2;
	} else if (hour >= 12 && hour < 17) {
		greetingsElem.innerText = gree3;
	} else {
		greetingsElem.innerText = gree4;
	}
})();
