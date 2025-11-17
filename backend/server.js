require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const searchHistoryRoutes = require("./routes/searchHistory");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB setup ---
const mongoUri =
  "mongodb+srv://scrape:travelgo132@cluster0.hexmrb0.mongodb.net/travelgo?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to Database successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/search-history", searchHistoryRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// TODO: aso effect on search results page
// TODO: fixed the ui and home page.
// TODO: add authentication and authorization
// TODO: add database
// TODO: let the user save their search results
// TODO: let the user save their favorite hotels
// TODO: let the user save their favorite transportation
// TODO: let the user save their favorite things to do
// TODO: let the user save their favorite tips and stories
// TODO: let the user save their favorite places
// TODO: let the user make and save their own trip plan.
// TODO: baseed on saved plans, help them to estimate the cost of the trip
// TODO: user search history
