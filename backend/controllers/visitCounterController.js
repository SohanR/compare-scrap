const VisitCounter = require("../models/VisitCounter");

exports.increment = async (_req, res) => {
  try {
    const counter = await VisitCounter.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return res.json({ count: counter.count });
  } catch (error) {
    console.error("[ERROR] Increment visit counter failed:", error.message);
    return res.status(500).json({ error: "Failed to increment visit counter" });
  }
};

exports.getCount = async (_req, res) => {
  try {
    const counter = await VisitCounter.findOne({});
    return res.json({ count: counter?.count || 0 });
  } catch (error) {
    console.error("[ERROR] Get visit counter failed:", error.message);
    return res.status(500).json({ error: "Failed to fetch visit counter" });
  }
};
