const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get user settings
exports.getUserSettings = async (req, res) => {
  console.log("\n📍 [API] Get User Settings Started");

  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required parameter: userId",
      });
    }

    console.log(`🔍 [SEARCH] Fetching settings for user: ${userId}`);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    console.log(`✅ [FINAL] User settings retrieved successfully`);

    return res.json({
      message: "User settings retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ [ERROR] Get User Settings Failed:", error.message);
    res.status(500).json({
      error: "Failed to retrieve user settings",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update user name
exports.updateUserName = async (req, res) => {
  console.log("\n📍 [API] Update User Name Started");

  try {
    const { userId } = req.params;
    const { name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({
        error: "Missing required parameters: userId, name",
      });
    }

    console.log(`📝 [UPDATE] Updating name for user: ${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    console.log(`✅ [FINAL] User name updated successfully`);

    return res.json({
      message: "User name updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ [ERROR] Update User Name Failed:", error.message);
    res.status(500).json({
      error: "Failed to update user name",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update user bio
exports.updateUserBio = async (req, res) => {
  console.log("\n📍 [API] Update User Bio Started");

  try {
    const { userId } = req.params;
    const { bio } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Missing required parameter: userId",
      });
    }

    console.log(`📝 [UPDATE] Updating bio for user: ${userId}`);

    const user = await User.findByIdAndUpdate(
      userId,
      { bio: bio?.trim() || "" },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    console.log(`✅ [FINAL] User bio updated successfully`);

    return res.json({
      message: "User bio updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ [ERROR] Update User Bio Failed:", error.message);
    res.status(500).json({
      error: "Failed to update user bio",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update visited places
exports.updateVisitedPlaces = async (req, res) => {
  console.log("\n📍 [API] Update Visited Places Started");

  try {
    const { userId } = req.params;
    const { visitedPlaces } = req.body;

    if (!userId || !Array.isArray(visitedPlaces)) {
      return res.status(400).json({
        error: "Missing required parameters: userId, visitedPlaces (array)",
      });
    }

    console.log(
      `📝 [UPDATE] Updating visited places for user: ${userId} (${visitedPlaces.length} places)`
    );

    const user = await User.findByIdAndUpdate(
      userId,
      { visitedPlaces },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    console.log(`✅ [FINAL] User visited places updated successfully`);

    return res.json({
      message: "User visited places updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("❌ [ERROR] Update Visited Places Failed:", error.message);
    res.status(500).json({
      error: "Failed to update visited places",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  console.log("\n📍 [API] Reset Password Started");

  try {
    const { userId } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: "Missing required parameters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters",
      });
    }

    console.log(`🔐 [VERIFY] Verifying current password for user: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Current password is incorrect",
      });
    }

    console.log(`🔄 [HASH] Hashing new password`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    console.log(`✅ [FINAL] Password reset successfully`);

    return res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("❌ [ERROR] Reset Password Failed:", error.message);
    res.status(500).json({
      error: "Failed to reset password",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  console.log("\n📍 [API] Delete Account Started");

  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        error: "Missing required parameters: userId, password",
      });
    }

    console.log(
      `🔐 [VERIFY] Verifying password for account deletion: ${userId}`
    );

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Password is incorrect",
      });
    }

    console.log(
      `🗑️  [DELETE] Permanently deleting account for user: ${userId}`
    );

    await User.findByIdAndDelete(userId);

    console.log(`✅ [FINAL] Account deleted successfully`);

    return res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("❌ [ERROR] Delete Account Failed:", error.message);
    res.status(500).json({
      error: "Failed to delete account",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
