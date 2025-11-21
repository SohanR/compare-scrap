const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "You are not an admin" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login failed:", error.message);
    return res
      .status(500)
      .json({ message: "Admin login failed", error: error.message });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.json({ message: "User is already an admin" });
    }

    user.role = "admin";
    await user.save();

    return res.json({ message: "User promoted to admin", user });
  } catch (error) {
    console.error("Promote to admin failed:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update role", error: error.message });
  }
};

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find({}, "name email role createdAt").sort({
      createdAt: -1,
    });
    return res.json({ data: users });
  } catch (error) {
    console.error("Get users failed:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user failed:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};
