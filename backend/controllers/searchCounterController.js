const SearchCounter = require("../models/SearchCounter");

exports.increment = async (_req, res) => {
  try {
    const counter = await SearchCounter.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return res.json({ count: counter.count });
  } catch (error) {
    console.error("[ERROR] Increment search counter failed:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to increment search counter" });
  }
};

exports.getCount = async (_req, res) => {
  try {
    const counter = await SearchCounter.findOne({});
    return res.json({ count: counter?.count || 0 });
  } catch (error) {
    console.error("[ERROR] Get search counter failed:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch search counter" });
  }
};
