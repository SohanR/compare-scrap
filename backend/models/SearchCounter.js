const mongoose = require("mongoose");

const searchCounterSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchCounter", searchCounterSchema);
