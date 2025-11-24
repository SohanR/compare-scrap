const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Bookmark = require("../models/Bookmark");
const SearchHistory = require("../models/SearchHistory");

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
    const users = await User.find(
      {},
      "name email role createdAt bio visitedPlaces"
    )
      .sort({
        createdAt: -1,
      })
      .lean();

    const [bookmarkCounts, searchCounts] = await Promise.all([
      Bookmark.aggregate([{ $group: { _id: "$userId", count: { $sum: 1 } } }]),
      SearchHistory.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]),
    ]);

    const bookmarkMap = new Map(
      bookmarkCounts.map((item) => [String(item._id), item.count])
    );
    const searchMap = new Map(
      searchCounts.map((item) => [String(item._id), item.count])
    );

    const sanitized = users.map((user) => ({
      ...user,
      id: user._id,
      bio: user.bio || "",
      visitedPlaces: user.visitedPlaces || [],
      bookmarksCount: bookmarkMap.get(String(user._id)) || 0,
      searchCount: searchMap.get(String(user._id)) || 0,
    }));

    return res.json({ data: sanitized });
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

exports.toggleUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body || {};

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const nextRole =
      role && ["admin", "user"].includes(role)
        ? role
        : user.role === "admin"
        ? "user"
        : "admin";

    user.role = nextRole;
    await user.save();

    const responseUser = await User.findById(userId)
      .select("name email role createdAt bio visitedPlaces")
      .lean();

    return res.json({
      message: `User role updated to ${nextRole}`,
      user: responseUser,
    });
  } catch (error) {
    console.error("Toggle role failed:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update role", error: error.message });
  }
};

exports.getBookmarkItems = async (req, res) => {
  try {
    const { limit = 50, skip = 0, category, search } = req.query;

    const matchStage = {};
    if (category) {
      matchStage.category = category;
    }

    const keyFallback = {
      $ifNull: [
        "$item.id",
        {
          $ifNull: [
            "$item._id",
            {
              $ifNull: [
                "$item.slug",
                {
                  $ifNull: [
                    "$item.title",
                    {
                      $ifNull: [
                        "$item.name",
                        {
                          $ifNull: [
                            "$item.code",
                            { $toString: "$_id" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const pipeline = [
      Object.keys(matchStage).length ? { $match: matchStage } : null,
      {
        $addFields: {
          itemKey: { $concat: ["$category", "::", keyFallback] },
        },
      },
      {
        $group: {
          _id: { itemKey: "$itemKey", category: "$category" },
          item: { $first: "$item" },
          category: { $first: "$category" },
          userIds: { $addToSet: "$userId" },
          bookmarkIds: { $addToSet: "$_id" },
          count: { $sum: 1 },
          latestCreatedAt: { $max: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userIds",
          foreignField: "_id",
          as: "users",
          pipeline: [
            { $project: { name: 1, email: 1, role: 1 } },
            { $sort: { name: 1 } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          itemKey: "$_id.itemKey",
          category: 1,
          item: 1,
          count: 1,
          latestCreatedAt: 1,
          users: 1,
          bookmarkIds: 1,
        },
      },
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "item.title": { $regex: search, $options: "i" } },
                  { "item.name": { $regex: search, $options: "i" } },
                  { "item.slug": { $regex: search, $options: "i" } },
                  { "item.code": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),
      { $sort: { count: -1, latestCreatedAt: -1 } },
      { $skip: Number(skip) || 0 },
      { $limit: Math.min(Number(limit) || 50, 200) },
    ].filter(Boolean);

    const items = await Bookmark.aggregate(pipeline);
    return res.json({ data: items });
  } catch (error) {
    console.error("Get bookmark items failed:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to fetch bookmark items", error: error.message });
  }
};

exports.adminDeleteBookmarks = async (req, res) => {
  try {
    const { bookmarkIds } = req.body || {};
    if (!bookmarkIds || !Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
      return res
        .status(400)
        .json({ message: "bookmarkIds array is required" });
    }

    const ids = bookmarkIds.map((id) => String(id));
    const result = await Bookmark.deleteMany({ _id: { $in: ids } });
    return res.json({
      message: "Bookmarks deleted",
      deletedCount: result.deletedCount || 0,
    });
  } catch (error) {
    console.error("Admin delete bookmarks failed:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to delete bookmarks", error: error.message });
  }
};
