const { scrapeHotels } = require("../scrapers/hotelScrapper");
const {
  scrapeLonelyPlanetThingsToDo,
  scrapeLonelyPlanetTipsAndStories,
} = require("../scrapers/lonelyPlanet");
const {
  scrapeKayakFlights,
  scrapeKayakFlightsTwoWay,
} = require("../scrapers/transportation");

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

// Transportation API
exports.searchTransportation = async (req, res) => {
  console.log("\n📍 [API] Transportation Search Started");
  const { from, to, date, returnDate, tripType } = req.body;
  const fromIata = from?.iata;
  const toIata = to?.iata;

  if (!fromIata || !toIata || !date) {
    return res.status(400).json({
      error: "Missing required parameters: fromIata, toIata, date",
    });
  }

  try {
    // Check cache first
    const cachedResults = getFromCache("transportation", {
      fromIata,
      toIata,
      date,
      returnDate,
      tripType,
    });

    if (cachedResults) {
      console.log("\x1b[36mReturning cached transportation results\x1b[0m");
      return res.json(cachedResults);
    }

    console.log(
      `✈️  [SEARCH] ${fromIata} → ${toIata} | Date: ${date} | Type: ${tripType}`
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

    console.log(`✅ [RESULT] Found ${transportation?.length || 0} flights\n`);

    const results = { transportation: transportation || [] };
    setCache(
      "transportation",
      { fromIata, toIata, date, returnDate, tripType },
      results
    );

    return res.json(results);
  } catch (error) {
    console.error("❌ [ERROR] Transportation Search Failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch transportation data",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Hotels API
exports.searchHotels = async (req, res) => {
  console.log("\n📍 [API] Hotels Search Started");
  const { to, date } = req.body;
  const destination = to?.city;

  if (!destination || !date) {
    return res.status(400).json({
      error: "Missing required parameters: to, date",
    });
  }

  try {
    // Check cache first
    const cachedResults = getFromCache("hotels", { destination, date });

    if (cachedResults) {
      console.log("\x1b[36mReturning cached hotels results\x1b[0m");
      return res.json(cachedResults);
    }

    console.log(`🏨 [SEARCH] Destination: ${destination} | Check-in: ${date}`);

    const hotels = await scrapeHotels(destination, date, date).catch((err) => {
      console.error("Hotels error:", err);
      return [];
    });

    console.log(`✅ [RESULT] Found ${hotels?.length || 0} hotels\n`);

    const results = { hotels: hotels || [] };
    setCache("hotels", { to, date }, results);

    return res.json(results);
  } catch (error) {
    console.error("❌ [ERROR] Hotels Search Failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch hotels data",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Things to Do API
exports.searchThingsToDo = async (req, res) => {
  console.log("\n📍 [API] Things to Do Search Started");
  const { to } = req.body;
  const destination = to?.city;

  if (!destination) {
    return res.status(400).json({
      error: "Missing required parameter: to",
    });
  }

  try {
    // Check cache first
    const cachedResults = getFromCache("thingsToDo", { destination });

    if (cachedResults) {
      console.log("\x1b[36mReturning cached things to do results\x1b[0m");
      return res.json(cachedResults);
    }

    console.log(`🎯 [SEARCH] Destination: ${destination}`);

    const todo = await scrapeLonelyPlanetThingsToDo(destination).catch(
      (err) => {
        console.error("Things to Do error:", err);
        return [];
      }
    );

    console.log(`✅ [RESULT] Found ${todo?.length || 0} things to do\n`);

    const results = { todo: todo || [] };
    setCache("thingsToDo", { to }, results);

    return res.json(results);
  } catch (error) {
    console.error("❌ [ERROR] Things to Do Search Failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch things to do data",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Tips and Stories API
exports.searchTipsAndStories = async (req, res) => {
  console.log("\n📍 [API] Tips & Stories Search Started");
  const { to } = req.body;
  const destination = to?.city;

  if (!destination) {
    return res.status(400).json({
      error: "Missing required parameter: to",
    });
  }

  try {
    // Check cache first
    const cachedResults = getFromCache("tipsAndStories", { destination });

    if (cachedResults) {
      console.log("\x1b[36mReturning cached tips and stories results\x1b[0m");
      return res.json(cachedResults);
    }

    console.log(`📖 [SEARCH] Destination: ${destination}`);

    const tipsAndStories = await scrapeLonelyPlanetTipsAndStories(
      destination
    ).catch((err) => {
      console.error("Tips & Stories error:", err);
      return [];
    });

    console.log(
      `✅ [RESULT] Found ${tipsAndStories?.length || 0} tips & stories\n`
    );

    const results = { tipsAndStories: tipsAndStories || [] };
    setCache("tipsAndStories", { to }, results);

    return res.json(results);
  } catch (error) {
    console.error("❌ [ERROR] Tips & Stories Search Failed:", error.message);
    res.status(500).json({
      error: "Failed to fetch tips and stories data",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
