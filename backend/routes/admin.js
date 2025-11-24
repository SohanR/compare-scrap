const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

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

module.exports = router;
