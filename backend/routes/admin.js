const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// Admin login
router.post("/login", adminController.adminLogin);

// Promote a user to admin
router.put("/users/:userId/role", adminAuth, adminController.promoteToAdmin);

// Admin-protected user management
router.get("/users", adminAuth, adminController.getAllUsers);
router.delete("/users/:userId", adminAuth, adminController.deleteUser);

module.exports = router;
