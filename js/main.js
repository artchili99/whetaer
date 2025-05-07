
const API_KEY = '1c9498a3a3535712396335c5211ee55f';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// get a dom elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
$.get("http://ipinfo.io", function(response) {

    const geoCity = response.city;
    console.log(geoCity);
    // window.onload = fetchWeather(geoCity);
    document.getElementById('cityInput').value = geoCity;
    submit();
    document.getElementById('cityInput').value = "";
}, "jsonp");

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
    // console.log(data)

}

async function submit() {
    loader();

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
    fadeOut();
}


function updateUI(data) {
    const {name, main, weather, wind} = data;
    var tempTipe = "°C";


    weatherInfo.innerHTML = `
        <h2>${name}</h2>
        <div>  
         <div id="temp">${main.temp}</div>
        <span id="tempTipe">${tempTipe}</span>
        </div>
        <div id="temps">
        <button onclick="tempSwitch()" class="btn btn-primary" id="tempSwitch">°F</button>
        </div>
        <div>${weather[0].description}</div>
        <div>humidity : ${main.humidity}</div>
        <div>wind speed : ${wind.speed}</div>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
      `;
}
function tempSwitchC() {
    var temp = document.getElementById('temp').innerHTML;
    temp = (temp - 32) * 5/9;
    document.getElementById('temp').innerHTML = temp;
    document.getElementById('tempTipe').innerHTML = "°C";
    document.getElementById('tempSwitchC').style.display = "none";
    temps = document.getElementById('temps');
    temps.innerHTML =
        `
       <button onclick="tempSwitch()" class="btn btn-primary" id="tempSwitch">°F</button>
        `;



}
function tempSwitch() {

    var temp = document.getElementById('temp').innerHTML;
    temp = (temp * 9/5) + 32;
    document.getElementById('temp').innerHTML = temp;
    document.getElementById('tempTipe').innerHTML = "°F";
    document.getElementById('tempSwitch').style.display = "none";
    temps = document.getElementById('temps');
    temps.innerHTML =
        `
        <button onclick="tempSwitchC()" class="btn btn-primary" id="tempSwitchC">°C</button>
        `;

}
fadeOut();
searchBtn.addEventListener('click', submit);


