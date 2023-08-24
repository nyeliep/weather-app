const apiKey = '2a14029fe834e7220a1cc0fb2319d2ca';
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const weatherContainer = document.getElementById('weatherContainer');

searchButton.addEventListener('click', fetchWeather);

function fetchWeather() {
  const city = cityInput.value.trim();
  if (city === '') return;

  const currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  Promise.all([
    fetch(currentApiUrl),
    fetch(forecastApiUrl)
  ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(dataArray => {
      const currentWeatherData = dataArray[0];
      const forecastData = dataArray[1];

      displayCurrentWeather(currentWeatherData);
      displayForecast(forecastData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      weatherContainer.innerHTML = 'Error fetching data. Please try again later.';
    });
}

function displayCurrentWeather(data) {
  weatherContainer.innerHTML = '';

  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  const currentCard = document.createElement('div');
  currentCard.classList.add('card');
  currentCard.innerHTML = `
    <i class="weather-icon fas fa-${getWeatherIcon(iconCode)}"></i>
    <br>
    <br>
    <p><i class="fas fa-thermometer-half">${temp}°C</p>
    <p><i class="fas fa-tint"></i> ${humidity}%</p>
    <p>Description: ${description}</p>

  `;

  weatherContainer.appendChild(currentCard);
}

function displayForecast(data) {
  const forecasts = data.list.filter((forecast, index) => index % 8 === 0);

  for (const forecast of forecasts) {
    const date = new Date(forecast.dt * 1000);
    const temp = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const description = forecast.weather[0].description;
    const iconCode = forecast.weather[0].icon;

    const forecastCard = document.createElement('div');
    forecastCard.classList.add('card');
    forecastCard.innerHTML = `
      <i class="weather-icon fas fa-${getWeatherIcon(iconCode)}"></i>
      <p>${date.toDateString()}</p>
      <p><i class="fas fa-thermometer-half"> ${temp}°C</p>
      <p><i class="fas fa-tint"></i> ${humidity}%</p>
      <p>Description: ${description}</p>
    
    `;

    weatherContainer.appendChild(forecastCard);
  }
}

// Function to map weather icon codes to Font Awesome icons
function getWeatherIcon(iconCode) {
  const iconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud-sun',
    '02n': 'cloud-moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-showers-heavy',
    '09n': 'cloud-showers-heavy',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'bolt',
    '11n': 'bolt',
    '13d': 'snowflake',
    '13n': 'snowflake',
    '50d': 'smog',
    '50n': 'smog'
  };

  return iconMap[iconCode] || 'question';
}

// Function to get user's geolocation and fetch weather data
function getUserGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            displayForecast(data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            weatherContainer.innerHTML = 'Error fetching data. Please try again later.';
          });
      },
      error => {
        console.error('Error getting geolocation:', error);
        weatherContainer.innerHTML = 'Error getting geolocation. Please try again later.';
      }
    );
  } else {
    console.log('Geolocation is not available.');
  }
}

// Call the geolocation function on page load
getUserGeolocation();







const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark');
    body.classList.toggle('light');
});

// Initial theme setting based on user preference or default
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
} else {
    body.classList.add('light');
}





