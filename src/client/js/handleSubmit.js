export const handleSubmit = async (event) => {
    event.preventDefault();
  
    const city = document.getElementById("city").value;
    const travelDate = new Date(document.getElementById("travelDate").value);
    const daysUntilTravel = Math.ceil(
      (travelDate - new Date()) / (1000 * 60 * 60 * 24)
    );
  
    const geoResponse = await fetch("http://localhost:8081/geonames", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });
    const geoData = await geoResponse.json();
  
    const weatherResponse = await fetch("http://localhost:8081/weatherbit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat: geoData.lat, lon: geoData.lng }),
    });
    const weatherData = await weatherResponse.json();
  
    const pixabayResponse = await fetch("http://localhost:8081/pixabay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });
    const pixabayData = await pixabayResponse.json();
  
    document.getElementById("result").innerHTML = `
      <h2>Trip to ${city}</h2>
      <p>Days until travel: ${daysUntilTravel}</p>
      <p>Weather forecast: ${weatherData.data[0].weather.description}</p>
      <img src="${pixabayData.image}" alt="${city}" />
    `;
  };
  