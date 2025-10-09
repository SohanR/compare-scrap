require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { scrapeHotels } = require("./scrapers/hotelScrapper");
const {
  scrapeLonelyPlanetThingsToDo,
  scrapeLonelyPlanetTipsAndStories,
} = require("./scrapers/lonelyPlanet");
const {
  scrapeKayakFlights,
  scrapeKayakFlightsTwoWay,
} = require("./scrapers/transportation");

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
  console.log("request body", req.body);
  const from = req.body.from.city;
  const to = req.body.to.city;
  const date = req.body.date;
  const fromIata = req.body.from.iata;
  const toIata = req.body.to.iata;
  const returnDate = req.body.returnDate;
  const tripType = req.body.tripType;

  if (!from || !to || !date) {
    return res.status(400).json({
      error: "Missing required parameters",
    });
  }

  try {
    // Check cache first
    const cacheKey = `search:${from}-${to}-${date}-${returnDate || ""}-${
      tripType || ""
    }`;
    const cachedResults = getFromCache("search", {
      from,
      to,
      date,
      returnDate,
      tripType,
    });

    if (cachedResults) {
      return res.json(cachedResults);
    }

    console.log(
      `Searching for: From=${from}, To=${to}, Date=${date}, ReturnDate=${returnDate}, TripType=${tripType}`
    );

    let transportation;
    if (tripType === "twoway" && returnDate) {
      transportation = await scrapeKayakFlightsTwoWay(
        fromIata,
        toIata,
        date,
        returnDate
      ).catch((err) => {
        console.error("Transportation error:", err);
        return [];
      });
    } else {
      transportation = await scrapeKayakFlights(fromIata, toIata, date).catch(
        (err) => {
          console.error("Transportation error:", err);
          return [];
        }
      );
    }

    const [hotels, touristPlaces, tipsAndStories] = await Promise.all([
      scrapeHotels(to, date, date).catch((err) => {
        console.error("Hotels error:", err);
        return [];
      }),
      scrapeLonelyPlanetThingsToDo(to).catch((err) => {
        console.error("Things to Do error:", err);
        return [];
      }),
      scrapeLonelyPlanetTipsAndStories(to).catch((err) => {
        console.error("Tips & Stories error:", err);
        return [];
      }),
    ]);

    console.log(
      `\x1b[32mFound ${transportation?.length || 0} Transportation\x1b[0m`
    );
    console.log(`\x1b[32mFound ${hotels?.length || 0} hotels\x1b[0m`);
    console.log(
      `\x1b[32mFound ${touristPlaces?.length || 0} things to do\x1b[0m`
    );
    console.log(
      `\x1b[32mFound ${tipsAndStories?.length || 0} tips and stories\x1b[0m`
    );

    const results = {
      transportation: transportation || [],
      hotels: hotels || [],
      todo: touristPlaces || [],
      tipsAndStories: tipsAndStories || [],
    };

    setCache("search", { from, to, date, returnDate, tripType }, results);

    return res.json(results);
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

// Done: implement flight search and transportation search
// TODO: aso effect on search results page
// TODO: fixed the ui and home page.
// TODO: add authentication and authorization
// TODO: add database
// TODO let the user save their search results
// TODO: let the user save their favorite hotels
// TODO: let the user save their favorite transportation
// TODO: let the user save their favorite things to do
// TODO: let the user save their favorite tips and stories
// TODO: let the user save their favorite places
// TODO: let the user make and save their own trip plan.
// TODO: baseed on saved plans, help them to estimate the cost of the trip
// user search history
