
const API_KEY = '1c9498a3a3535712396335c5211ee55f';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_STORAGE_KEY = 'lastWeatherData';


// get a dom elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');

// This is an arrow function
const fetchLocation = async () => {
    const response = await fetch('http://ipinfo.io/json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    drawResults(data);
}

const drawResults = (data) => {
    const geoCity = data.city;
    document.getElementById('cityInput').value = geoCity;
    submit();
    document.getElementById('cityInput').value = "";
}

fetchLocation();

// TODO:

// 2. Understand how to use async and await and Promise object.   +
// 3. Use html templates and string interpolation to draw the results  +
// 4. Merge tempSwitchC and tempSwitch into one function and reuse it  +
// 5. Use addEventListener instead of inline onclick event handlers   +
// 6. Save the state of the latest results in the browser storage (use localStorage) +
// Example
// document.querySelector('button').addEventListener('click', (e) => {
//     alert('Button clicked!');
// })

const cache = {};


function loader()
{
    document.querySelector('.loader-container').classList.add('active');
}
function removeLoader()
{
    document.querySelector('.loader-container').classList.remove('active');
}
function fadeOut()
{
    setTimeout(removeLoader,3000);
}

async function fetchWeather(city) {

    if (cache[city]) {
        // console.log('City: ', city, ' was cached')
        return cache[city];
    }

    const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error('City not found');
    }

    const data = await response.json();
    cache[city] = data;
    return data;
    // console.log(data)

}

async function submit() {
    loader();

    const city = cityInput.value.trim();
    if (city) {
        try {
            const weatherData = await fetchWeather(city);
            updateUI(weatherData);
        } catch (error) {

            const hasLastData = await loadLastWeather();
            if (!hasLastData) {
                weatherInfo.innerHTML = `<div class="alert alert-danger" role="alert">
                    ${error.message}. Last saved Not.
                </div>`;
            }
        }
    } else {
        weatherInfo.innerHTML = `<div class="alert alert-warning" role="alert">
           City name Not found
        </div>`;
    }

    fadeOut();
}



function createWeatherDisplay(template, data) {
    const {name, main, weather, wind} = data;
    const tempTipe = "°C";

    const display = template.content.cloneNode(true);

    const updates = {
        '.city-name': name,
        '#temp': Math.round(main.temp),
        '#tempTipe': tempTipe,
        '#tempSwitch': "°F",
        '.weather-description': weather[0].description,
        '.humidity': `humidity : ${main.humidity}`,
        '.wind-speed': `wind speed : ${wind.speed}`
    };


    Object.entries(updates).forEach(([selector, value]) => {
        const element = display.querySelector(selector);
        if (element) element.textContent = value;
    });


    const weatherIcon = display.querySelector('.weather-icon');
    weatherIcon.src = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
    weatherIcon.alt = weather[0].description;

    return display;
}

async function updateUI(data) {
    const template = document.getElementById('weather-template');
    const weatherDisplay = createWeatherDisplay(template, data);

    weatherInfo.innerHTML = '';
    weatherInfo.appendChild(weatherDisplay);

    // Сохраняем данные
    saveWeatherData(data);

    document.getElementById('tempSwitch').addEventListener('click', toggleTemperature);
}



        function convertTemperature(temp, fromUnit) {
    return new Promise((resolve, reject) => {
        try {
            let result;
            if (fromUnit === "°C") {
                result = {
                    temp:  Math.round((temp * 9/5) + 32),
                    newUnit: "°F",
                    nextUnit: "°C"
                };
            } else {
                result = {
                    temp:  Math.round((temp - 32) * 5/9),
                    newUnit: "°C",
                    nextUnit: "°F"
                };
            }
            resolve(result);
        } catch (error) {
            reject(new Error('error converting temperature'));
        }
    });
}

async function toggleTemperature() {
    const tempElement = document.getElementById('temp');
    const tempTipeElement = document.getElementById('tempTipe');
    const currentTemp = parseFloat(tempElement.innerHTML);
    const currentUnit = tempTipeElement.innerHTML;

    try {
        const result = await convertTemperature(currentTemp, currentUnit);

        tempElement.innerHTML = result.temp.toFixed(2);
        tempTipeElement.innerHTML = result.newUnit;

        document.getElementById('temps').innerHTML = `
            <button onclick="toggleTemperature()" class="btn btn-primary">${result.nextUnit}</button>
        `;
    } catch (error) {
        console.error('Ошибка:', error.message);
        document.getElementById('weatherInfo').innerHTML += `
            <div class="alert alert-danger" role="alert">
                error converting temperature
            </div>
        `;
    }
}
function saveWeatherData(data) {
    try {
        const weatherData = {
            ...data,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(weatherData));
    } catch (error) {
        console.error('error saving data', error);
    }
}

function getLastWeatherData() {
    try {
        const data = localStorage.getItem(WEATHER_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('error gating data', error);
        return null;
    }
}
        async function loadLastWeather() {
            const lastData = getLastWeatherData();

            if (lastData) {
                const savedTime = new Date(lastData.timestamp);
                const currentTime = new Date();
                const timeDiff = (currentTime - savedTime) / 1000 / 60; // разница в минутах

                if (timeDiff < 30) {
                    updateUI(lastData);
                    return true;
                }
            }
            return false;
        }


        document.addEventListener('DOMContentLoaded', async () => {
            await loadLastWeather();
        });


fadeOut();
searchBtn.addEventListener('click', submit);





