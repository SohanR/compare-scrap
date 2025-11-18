const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

// Get user settings
router.get("/:userId", settingsController.getUserSettings);

// Update user name
router.put("/:userId/name", settingsController.updateUserName);

// Update user bio
router.put("/:userId/bio", settingsController.updateUserBio);

// Update visited places
router.put("/:userId/visited-places", settingsController.updateVisitedPlaces);

// Reset password
router.post("/:userId/reset-password", settingsController.resetPassword);

// Delete account
router.delete("/:userId/delete-account", settingsController.deleteAccount);

module.exports = router;
