require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { getAllTransportation } = require("./scrapers/transportation");
const { scrapeHotels } = require("./scrapers/hotelScrapper");
const { scrapeTouristPlaces } = require("./scrapers/tourist-places");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cache for storing scraped data (basic implementation)
const cache = {
  data: new Map(),
  timeout: 3600000, // 1 hour
};

function getCacheKey(type, params) {
  return `${type}:${JSON.stringify(params)}`;
}

function getFromCache(type, params) {
  const key = getCacheKey(type, params);
  const cached = cache.data.get(key);
  if (cached && Date.now() - cached.timestamp < cache.timeout) {
    return cached.data;
  }
  return null;
}

function setCache(type, params, data) {
  const key = getCacheKey(type, params);
  cache.data.set(key, {
    timestamp: Date.now(),
    data,
  });
}

// API Routes
app.post("/api/search", async (req, res) => {
  const { from, to, date } = req.body;

  if (!from || !to || !date) {
    return res.status(400).json({
      error: "Missing required parameters",
    });
  }

  try {
    // Check cache first
    const cacheKey = `search:${from}-${to}-${date}`;
    const cachedResults = getFromCache("search", { from, to, date });

    if (cachedResults) {
      console.log("\x1b[32mReturning cached results\x1b[0m");
      return res.json(cachedResults);
    }

    console.log(`Searching for: From=${from}, To=${to}, Date=${date}`);

    // Fetch all data concurrently
    const [transportation, hotels, touristPlaces] = await Promise.all([
      Promise.resolve([]), // Return empty array for transportation
      scrapeHotels(to, date, date).catch((err) => {
        console.error("Hotels error:", err);
        return [];
      }),
      Promise.resolve([]), // Return empty array for tourist places
    ]);

    console.log(`\x1b[32mFound ${hotels?.length || 0} hotels\x1b[0m`);
    console.log(
      "\x1b[36mHotel results:\x1b[0m",
      JSON.stringify(hotels, null, 2)
    );

    // Construct the results object
    const results = {
      transportation: transportation || [], // Ensure transportation is an array
      hotels: hotels || [], // Ensure hotels is an array
      touristPlaces: touristPlaces || [], // Ensure touristPlaces is an array
    };

    // Cache the results
    setCache("search", { from, to, date }, results);

    // Send the response
    return res.json(results); // Ensure the response is sent
  } catch (error) {
    console.error("\x1b[31mSearch error:\x1b[0m", error);
    res.status(500).json({
      error: "Failed to fetch travel data",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
