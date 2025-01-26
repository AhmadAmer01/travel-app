const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("dist"));

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

app.get("/", (req, res) => {
  res.sendFile("dist/index.html");
});

app.post("/geonames", async (req, res) => {
  const { city } = req.body;
  const geonamesURL = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${GEONAMES_USERNAME}`;
  const response = await fetch(geonamesURL);
  const data = await response.json();
  res.send(data.geonames[0]);
});

app.post("/weatherbit", async (req, res) => {
  const { lat, lon } = req.body;
  const weatherbitURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHERBIT_API_KEY}`;
  const response = await fetch(weatherbitURL);
  const data = await response.json();
  res.send(data);
});

app.post("/pixabay", async (req, res) => {
  const { city } = req.body;
  const pixabayURL = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${city}&image_type=photo`;
  const response = await fetch(pixabayURL);
  const data = await response.json();
  res.send(data.hits[0] || { image: "default.jpg" });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
