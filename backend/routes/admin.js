const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const visitCounterController = require("../controllers/visitCounterController");
const searchCounterController = require("../controllers/searchCounterController");

// Admin login
router.post("/login", adminController.adminLogin);

// Promote/demote user role
router.put("/users/:userId/role", adminAuth, adminController.toggleUserRole);

// Admin-protected user management
router.get("/users", adminAuth, adminController.getAllUsers);
router.delete("/users/:userId", adminAuth, adminController.deleteUser);

// Bookmark aggregates
router.get(
  "/bookmarks/items",
  adminAuth,
  adminController.getBookmarkItems
);
router.delete(
  "/bookmarks",
  adminAuth,
  adminController.adminDeleteBookmarks
);

// Search history aggregates
router.get(
  "/search-history/items",
  adminAuth,
  adminController.getSearchHistoryItems
);

// Counters
router.get("/visit-counter", adminAuth, visitCounterController.getCount);
router.get("/search-counter", adminAuth, searchCounterController.getCount);

module.exports = router;
