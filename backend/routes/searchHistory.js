const express = require("express");
const router = express.Router();
const searchHistoryController = require("../controllers/searchHistoryController");

// Create search history
router.post("/", searchHistoryController.createSearchHistory);

// Get all search history for a user
router.get("/:userId", searchHistoryController.getUserSearchHistory);

// Delete a specific search history entry
router.delete("/:historyId", searchHistoryController.deleteSearchHistory);

// Clear all search history for a user
router.delete("/user/:userId", searchHistoryController.clearUserSearchHistory);

module.exports = router;
