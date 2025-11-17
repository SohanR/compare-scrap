const SearchHistory = require("../models/SearchHistory");

// Create search history
exports.createSearchHistory = async (req, res) => {
  console.log("\n📍 [API] Create Search History Started");

  try {
    const { userId, from, to, date } = req.body;

    if (!userId || !from || !to || !date) {
      return res.status(400).json({
        error: "Missing required parameters: userId, from, to, date",
      });
    }

    console.log(
      `📝 [SEARCH] Saving history - From: ${from.city}, To: ${to.city}, Date: ${date}`
    );

    const searchHistory = new SearchHistory({
      userId,
      from,
      to,
      date,
    });

    const savedHistory = await searchHistory.save();

    console.log(`✅ [FINAL] Search history saved successfully`);

    return res.status(201).json({
      message: "Search history saved successfully",
      data: savedHistory,
    });
  } catch (error) {
    console.error("❌ [ERROR] Create Search History Failed:", error.message);
    res.status(500).json({
      error: "Failed to save search history",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all search history for a user
exports.getUserSearchHistory = async (req, res) => {
  console.log("\n📍 [API] Get User Search History Started");

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required parameter: userId",
      });
    }

    console.log(`🔍 [SEARCH] Fetching history for user: ${userId}`);

    const searchHistory = await SearchHistory.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    console.log(
      `✅ [FINAL] Found ${searchHistory.length} search history records`
    );

    return res.json({
      message: "Search history retrieved successfully",
      data: searchHistory,
    });
  } catch (error) {
    console.error("❌ [ERROR] Get User Search History Failed:", error.message);
    res.status(500).json({
      error: "Failed to retrieve search history",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a specific search history entry
exports.deleteSearchHistory = async (req, res) => {
  console.log("\n📍 [API] Delete Search History Started");

  try {
    const { historyId } = req.params;

    if (!historyId) {
      return res.status(400).json({
        error: "Missing required parameter: historyId",
      });
    }

    console.log(`🗑️  [DELETE] Removing history: ${historyId}`);

    const result = await SearchHistory.findByIdAndDelete(historyId);

    if (!result) {
      return res.status(404).json({
        error: "Search history not found",
      });
    }

    console.log(`✅ [FINAL] Search history deleted successfully`);

    return res.json({
      message: "Search history deleted successfully",
    });
  } catch (error) {
    console.error("❌ [ERROR] Delete Search History Failed:", error.message);
    res.status(500).json({
      error: "Failed to delete search history",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Clear all search history for a user
exports.clearUserSearchHistory = async (req, res) => {
  console.log("\n📍 [API] Clear User Search History Started");

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required parameter: userId",
      });
    }

    console.log(`🗑️  [DELETE] Clearing all history for user: ${userId}`);

    const result = await SearchHistory.deleteMany({ userId });

    console.log(
      `✅ [FINAL] Cleared ${result.deletedCount} search history records`
    );

    return res.json({
      message: "All search history cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "❌ [ERROR] Clear User Search History Failed:",
      error.message
    );
    res.status(500).json({
      error: "Failed to clear search history",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
