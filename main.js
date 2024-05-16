const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const currentDate = new Date();

document.getElementById('submit-search').addEventListener('click', function () {
    cityName = document.getElementById('location').value;
    fetchFromCityLocation(cityName);
});

const fetchWeatherData = function (lat, lon, city) {
    const fetchUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=ca90637f0ed0bcfecc469a57ea89c230`;

    fetch(fetchUrl, {
        method: 'GET',
        dataType: 'json'
    }).then(data => data.json()).then(data => readWeatherData(data, city));
}

const fetchFromCityLocation = function (city) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=ca90637f0ed0bcfecc469a57ea89c230`;

    fetch(geoUrl, {
        method: 'GET',
        dataType: 'json'
    }).then(data => data.json()).then(data => fetchWeatherData(data[0].lat, data[0].lon, city));
}

const readWeatherData = function (data, city) {
    const weatherData = [];

    for(let i = 0; i < data.list.length; i += 8) {
        const currentWeatherData = data.list[i];

        const weather = {
            temp: ((currentWeatherData.main.temp - 273.15) * (9/5) + 32),
            main: currentWeatherData.weather[0].main
        };

        weatherData.push(weather);
    }

    console.log(weatherData);
    renderWeather(weatherData, city);
}

const renderWeather = function (weatherData, city) {
    if(document.querySelector('.main-weather').hasChildNodes() && document.querySelector('.sub-weather').hasChildNodes()) {
        document.querySelector('.main-weather').replaceChildren();
        document.querySelector('.sub-weather').replaceChildren();
    }


    for(let i = 0; i < weatherData.length; i++) {
        const mainWeatherTemplate = `
        <div class="row">
          <div class="col-md-2 col-md-offset-2">
              <ul class="list-unstyled">
                  <li class="text-center temperature">${Math.floor(weatherData[i].temp)}&deg;</li>
                  <li class="text-center location">${city}</li>
                  <li class="text-center description">${weatherData[i].main}</li>
              </ul>
          </div>
          <div class="col-md-2">
              <image src="https://openweathermap.org/img/wn/${returnWeatherIcon(weatherData[i].main)}d@2x.png" alt="${weatherData[i].main} Icon" />
          </div>
        </div>`;

        const subWeatherTemplate = `
        <div class="col-md-2">
          <div class="sub-weather-item">
            <ul class="list-unstyled">
              <li class="text-center temperature">${Math.floor(weatherData[i].temp)}&deg;</li>
              <li class="text-center description">${weatherData[i].main}</li>
            </ul>
            <image src="https://openweathermap.org/img/wn/${returnWeatherIcon(weatherData[i].main)}d@2x.png" alt="${weatherData[i].main} Icon" />
            <p>${returnDayOfWeek(i)}</p>
          </div>
        </div>`;

        if(i != 0) {
            document.querySelector('.sub-weather').insertAdjacentHTML('beforeend', subWeatherTemplate);
        } else {
            document.querySelector('.main-weather').insertAdjacentHTML('beforeend', mainWeatherTemplate);
        }
    }
}

const returnWeatherIcon = function (description) {
    switch(description) {
        case 'Thunderstorm':
            return '11';
        case 'Drizzle':
            return '09';
        case 'Rain':
            return '10';
        case 'Snow':
            return '13';
        case 'Atmosphere':
            return '50';
        case 'Clear':
            return '01';
        case 'Clouds':
            return '04';    
    }
}   

const returnDayOfWeek = function (offset) {
    let currentDay = currentDate.getDay() + offset;
    if (currentDay > 6) {
        currentDay -= 7;
    }
    return daysOfWeek[currentDay];
}