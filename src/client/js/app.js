// API URLs and Keys
const geonamesBaseURL = 'http://api.geonames.org/searchJSON?q=';
const geonamesUsername = process.env.GEONAMES_USERNAME
const weatherbitBaseURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherbitApiKey = process.env.WEATHERBIT_API_KEY

const pixabayBaseURL = 'https://pixabay.com/api/?';
const pixabayApiKey = process.env.PIXABAY_API_KEY;


let appData = {};

e
const getCurrentDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};


const getGeonamesData = async (city) => {
  const url = `${geonamesBaseURL}${city}&maxRows=1&username=${geonamesUsername}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.geonames.length > 0) {
      return {
        lat: data.geonames[0].lat,
        lon: data.geonames[0].lng,
        country: data.geonames[0].countryName,
      };
    }
    throw new Error('City not found.');
  } catch (error) {
    console.error('Error fetching Geonames data:', error);
  }
};


const getWeatherData = async (lat, lon) => {
  const url = `${weatherbitBaseURL}lat=${lat}&lon=${lon}&key=${weatherbitApiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data[0]; 
  } catch (error) {
    console.error('Error fetching Weatherbit data:', error);
  }
};

const getImage = async (city) => {
  const url = `${pixabayBaseURL}key=${pixabayApiKey}&q=${city}&image_type=photo`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.hits.length > 0) {
      return data.hits[0].webformatURL;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Pixabay data:', error);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const city = document.getElementById('city').value;
  const date = document.getElementById('date').value;

  if (!city || !date) {
    alert('Please enter both a city and a date.');
    return;
  }

  try {
    const geonamesData = await getGeonamesData(city);
    appData = { ...appData, ...geonamesData };

    const weatherData = await getWeatherData(geonamesData.lat, geonamesData.lon);
    appData = { ...appData, weather: weatherData };

    const imageUrl = await getImage(city);
    appData = { ...appData, image: imageUrl };

    updateUI();
  } catch (error) {
    console.error('Error handling form submission:', error);
  }
};

const updateUI = () => {
  document.getElementById('output-city').innerText = appData.city || 'Unknown City';
  document.getElementById('output-country').innerText = appData.country || 'Unknown Country';
  document.getElementById('output-weather').innerText = appData.weather
    ? `${appData.weather.temp}°C - ${appData.weather.weather.description}`
    : 'No weather data available.';
  document.getElementById('output-date').innerText = appData.date || getCurrentDate();

  const imageElement = document.getElementById('output-image');
  if (appData.image) {
    imageElement.src = appData.image;
    imageElement.style.display = 'block';
  } else {
    imageElement.style.display = 'none';
  }
};

export { handleSubmit };
