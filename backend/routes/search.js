const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// Individual search endpoints
router.post("/transportation", searchController.searchTransportation);
router.post("/hotels", searchController.searchHotels);
router.post("/things-to-do", searchController.searchThingsToDo);
router.post("/tips-and-stories", searchController.searchTipsAndStories);

module.exports = router;
