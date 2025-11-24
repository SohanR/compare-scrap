const axios = require("axios");
const SearchHistory = require("../models/SearchHistory");

const ALLOWED_LIMIT = 100;

const aggregateDestinations = async ({ days = null, limit = null } = {}) => {
  const match = {
    "to.city": { $exists: true, $ne: null },
  };

  if (days) {
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    match.createdAt = { $gte: fromDate };
  }

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: { $toLower: "$to.city" },
        city: { $first: "$to.city" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ];

  if (limit) {
    pipeline.push({ $limit: Math.min(limit, ALLOWED_LIMIT) });
  }

  const results = await SearchHistory.aggregate(pipeline);
  return results.map((r) => ({
    city: r.city,
    count: r.count,
  }));
};

const fetchCityImage = async (city) => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    city
  )}`;
  try {
    const { data } = await axios.get(url);
    if (data?.originalimage?.source) return data.originalimage.source;
    if (data?.thumbnail?.source) return data.thumbnail.source;

    // Retry with title-cased city if first attempt had no image
    const titleCased = city
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    if (titleCased !== city) {
      const retryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        titleCased
      )}`;
      const retry = await axios.get(retryUrl);
      if (retry.data?.originalimage?.source) return retry.data.originalimage.source;
      if (retry.data?.thumbnail?.source) return retry.data.thumbnail.source;
    }

    // Fallback: search API to grab a page with a thumbnail
    const searchUrl = `https://en.wikipedia.org/w/api.php`;
    const searchRes = await axios.get(searchUrl, {
      params: {
        action: "query",
        format: "json",
        origin: "*",
        prop: "pageimages",
        piprop: "original|thumbnail",
        pithumbsize: 1200,
        generator: "search",
        gsrlimit: 1,
        gsrsearch: city,
      },
    });
    const pages = searchRes.data?.query?.pages || {};
    const firstPage = Object.values(pages)[0];
    if (firstPage?.original?.source) return firstPage.original.source;
    if (firstPage?.thumbnail?.source) return firstPage.thumbnail.source;

    return null;
  } catch (err) {
    console.error(`Failed to fetch image for ${city}:`, err.message);
    return null;
  }
};

exports.getAllDestinations = async (_req, res) => {
  try {
    const destinations = await aggregateDestinations();
    return res.json({ data: destinations });
  } catch (error) {
    console.error("Error fetching destinations:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch destinations", details: error.message });
  }
};

exports.getDestinationsLast30Days = async (_req, res) => {
  try {
    const destinations = await aggregateDestinations({ days: 30 });
    return res.json({ data: destinations });
  } catch (error) {
    console.error("Error fetching 30d destinations:", error.message);
    return res.status(500).json({
      error: "Failed to fetch destinations",
      details: error.message,
    });
  }
};

exports.getDestinationsLast7Days = async (_req, res) => {
  try {
    const destinations = await aggregateDestinations({ days: 7 });
    return res.json({ data: destinations });
  } catch (error) {
    console.error("Error fetching 7d destinations:", error.message);
    return res.status(500).json({
      error: "Failed to fetch destinations",
      details: error.message,
    });
  }
};

exports.getTopDestinationsWithImages = async (_req, res) => {
  try {
    const destinations = await aggregateDestinations({ limit: 6 });
    const withImages = await Promise.all(
      destinations.map(async (dest) => {
        const image = await fetchCityImage(dest.city);
        return { ...dest, image };
      })
    );
    return res.json({ data: withImages });
  } catch (error) {
    console.error("Error fetching top destinations with images:", error.message);
    return res.status(500).json({
      error: "Failed to fetch top destinations",
      details: error.message,
    });
  }
};
