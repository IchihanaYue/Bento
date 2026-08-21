// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

(function () {
	const iconElement = document.querySelector('.weatherIcon');
	const tempElement = document.querySelector('.weatherValue p');
	const descElement = document.querySelector('.weatherDescription p');

	if (!iconElement || !tempElement || !descElement) return;

	const weather = {
		temperature: {
			value: 24,
			unit: 'celsius',
		},
		description: 'Few Clouds',
		iconId: '02d'
	};

	const tempUnit = CONFIG.weatherUnit || 'C';
	const KELVIN = 273.15;
	const key = `${CONFIG.weatherKey}`;

	function setPosition() {
		if (!CONFIG.trackLocation || !navigator.geolocation) {
			getWeather(CONFIG.defaultLatitude || '37.775', CONFIG.defaultLongitude || '-122.419');
			return;
		}
		navigator.geolocation.getCurrentPosition(
			pos => {
				getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
			},
			err => {
				console.log('Location error / fallback to default:', err);
				getWeather(CONFIG.defaultLatitude || '37.775', CONFIG.defaultLongitude || '-122.419');
			},
			{ timeout: 5000 }
		);
	}

	function getWeather(latitude, longitude) {
		if (!key || key.includes('InsertYourAPIKeyHere')) {
			displayWeather();
			return;
		}

		let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${CONFIG.language || 'en'}&appid=${key}`;
		fetch(api)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Weather API returned status ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				if (data && data.main && data.weather && data.weather.length > 0) {
					let celsius = Math.floor(data.main.temp - KELVIN);
					weather.temperature.value = tempUnit === 'C' ? celsius : (celsius * 9) / 5 + 32;
					weather.description = data.weather[0].description;
					weather.iconId = data.weather[0].icon;
					displayWeather();
				}
			})
			.catch(err => {
				console.log('Weather fetch notice:', err.message);
				displayWeather();
			});
	}

	function displayWeather() {
		const iconFolder = CONFIG.weatherIcons || 'OneDark';
		const iconSrc = `assets/icons/${iconFolder}/${weather.iconId}.png`;
		iconElement.innerHTML = `<img src="${iconSrc}" alt="${weather.description}" onerror="this.src='assets/icons/${iconFolder}/unknown.png'"/>`;
		tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="tempUnit">${tempUnit}</span>`;
		descElement.innerHTML = weather.description;
	}

	// Initialize
	setPosition();
})();
