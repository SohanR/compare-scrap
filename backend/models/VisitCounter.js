const mongoose = require("mongoose");

const visitCounterSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VisitCounter", visitCounterSchema);
