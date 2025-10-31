import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api.data.gov.in/resource/4b9e360f-458f-4d8a-ad60-f120b3223b75";
const API_KEY = process.env.API_KEY;

//  Fetch and cache data
let cachedData = [];

async function fetchData() {
  try {
    const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=1000`;
    const res = await axios.get(url);
    cachedData = res.data.records;
    console.log("Data fetched and cached successfully.");
  } catch (err) {
    console.error("Error fetching data:", err.message);
  }
}

// Fetch data on startup
fetchData();

// Route: Get all states
app.get("/api/states", (req, res) => {
  const states = [...new Set(cachedData.map((r) => r.state).filter(Boolean))];
  res.json(states);
});


// Route: Get state by state
app.get("/api/state/:state", (req, res) => {
  const state = req.params.state;
  const filtered = cachedData.filter(
    (r) => r.state && r.state.toLowerCase() === state.toLowerCase()
  );
  res.json(filtered);
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Backend running on port ${process.env.PORT || 5000}`);
});
