const express = require("express");
const router = express.Router();
const trendingController = require("../controllers/trendingController");

// All-time destinations sorted by most searched
router.get("/destinations", trendingController.getAllDestinations);

// Last 30 days
router.get("/destinations/30d", trendingController.getDestinationsLast30Days);

// Last 7 days
router.get("/destinations/7d", trendingController.getDestinationsLast7Days);

// Top 6 destinations with images (all-time) for homepage
router.get(
  "/destinations/top6",
  trendingController.getTopDestinationsWithImages
);

module.exports = router;
