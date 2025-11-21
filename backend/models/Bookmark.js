const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["transportation", "hotels", "todo", "tipsAndStories"],
      required: true,
    },
    index: {
      type: Number,
    },
    item: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    search: {
      from: {
        city: String,
        iata: String,
        name: String,
      },
      to: {
        city: String,
        iata: String,
        name: String,
      },
      date: String,
      returnDate: String,
      tripType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
