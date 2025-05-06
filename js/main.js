
const API_KEY = '1c9498a3a3535712396335c5211ee55f';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// get a dom elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');

const cache = {};

async function fetchWeather(city) {
    if (cache[city]) {
        console.log('City: ', city, ' was cached')
        return cache[city];
    }

    const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error('City not found');
    }

    const data = await response.json();
    cache[city] = data;
    return data;
}

async function submit() {
    const city = cityInput.value.trim();
    if (city) {
        try {
            const weatherData = await fetchWeather(city);
            updateUI(weatherData);
            // console.log(weatherData)
        } catch (error) {
            weatherInfo.innerHTML = `<div class="alert alert-danger" role="alert">${error.message}</div>`;
        }
    }
}


function updateUI(data) {
    const { name, main, weather } = data;

    weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <div>${main.temp}°C</div>
        <div>${weather[0].description}</div>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
      `;
}


searchBtn.addEventListener('click', submit);


