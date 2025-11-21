const Bookmark = require("../models/Bookmark");

const allowedCategories = ["transportation", "hotels", "todo", "tipsAndStories"];

// Add a new bookmark
exports.addBookmark = async (req, res) => {
  try {
    const { userId, category, index, item, search } = req.body;

    if (!userId || !category || !item) {
      return res
        .status(400)
        .json({ error: "Missing required fields: userId, category, item" });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category value" });
    }

    const bookmark = await Bookmark.create({
      userId,
      category,
      index,
      item,
      search,
    });

    return res
      .status(201)
      .json({ message: "Bookmark added successfully", data: bookmark });
  } catch (error) {
    console.error("Error adding bookmark:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to add bookmark", details: error.message });
  }
};

// Remove a bookmark by id
exports.removeBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    if (!bookmarkId) {
      return res.status(400).json({ error: "bookmarkId is required" });
    }

    const deleted = await Bookmark.findByIdAndDelete(bookmarkId);
    if (!deleted) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    return res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error removing bookmark:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to remove bookmark", details: error.message });
  }
};

// List all bookmarks
exports.getAllBookmarks = async (_req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    return res.json({ data: bookmarks });
  } catch (error) {
    console.error("Error fetching all bookmarks:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch bookmarks", details: error.message });
  }
};

// List bookmarks for a user
exports.getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
    return res.json({ data: bookmarks });
  } catch (error) {
    console.error("Error fetching user bookmarks:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch user bookmarks", details: error.message });
  }
};

// List bookmarks for a user by category
exports.getUserBookmarksByCategory = async (req, res) => {
  try {
    const { userId, category } = req.params;
    if (!userId || !category) {
      return res
        .status(400)
        .json({ error: "userId and category are required" });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category value" });
    }

    const bookmarks = await Bookmark.find({ userId, category }).sort({
      createdAt: -1,
    });
    return res.json({ data: bookmarks });
  } catch (error) {
    console.error("Error fetching user bookmarks by category:", error.message);
    return res.status(500).json({
      error: "Failed to fetch user bookmarks by category",
      details: error.message,
    });
  }
};

// List bookmarks by category (all users)
exports.getBookmarksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ error: "category is required" });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category value" });
    }

    const bookmarks = await Bookmark.find({ category }).sort({
      createdAt: -1,
    });
    return res.json({ data: bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks by category:", error.message);
    return res.status(500).json({
      error: "Failed to fetch bookmarks by category",
      details: error.message,
    });
  }
};
