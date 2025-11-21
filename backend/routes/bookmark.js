const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");

// Create
router.post("/", bookmarkController.addBookmark);
// Delete
router.delete("/:bookmarkId", bookmarkController.removeBookmark);
// List
router.get("/", bookmarkController.getAllBookmarks);
router.get("/user/:userId", bookmarkController.getUserBookmarks);
router.get(
  "/user/:userId/category/:category",
  bookmarkController.getUserBookmarksByCategory
);
router.get("/category/:category", bookmarkController.getBookmarksByCategory);

module.exports = router;
