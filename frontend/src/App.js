import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchForm from "./components/SearchForm";
import ResultsSection from "./components/ResultsSection";
import LandingPage from "./components/LandingPage";
import { motion } from "framer-motion";
import {
  searchTransportation,
  searchHotels,
  searchThingsToDo,
  searchTipsAndStories,
  createSearchHistory,
} from "./utils/api";
import { Routes, Route } from "react-router-dom";
import FlightSearch from "./components/FlightSearch";
import NavBar from "./components/NavBar";
import JoinPage from "./components/JoinPage";
import SignupPage from "./components/SignupPage";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import useAuthStore from "./store/authStore";

function App() {
  const [results, setResults] = useState({
    transportation: [],
    hotels: [],
    todo: [],
    tipsAndStories: [],
  });
  const [loading, setLoading] = useState({
    transportation: false,
    hotels: false,
    todo: false,
    tipsAndStories: false,
  });
  const [error, setError] = useState({
    transportation: null,
    hotels: null,
    todo: null,
    tipsAndStories: null,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useAuthStore((state) => state.user);

  const handleSearch = async (searchData) => {
    // Set searching state
    setIsSearching(true);

    // Reset state
    setResults({
      transportation: [],
      hotels: [],
      todo: [],
      tipsAndStories: [],
    });
    setLoading({
      transportation: true,
      hotels: true,
      todo: true,
      tipsAndStories: true,
    });
    setError({
      transportation: null,
      hotels: null,
      todo: null,
      tipsAndStories: null,
    });
    setShowResults(true);

    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById("results-section");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);

    // Transportation API
    searchTransportation({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      returnDate: searchData.returnDate,
      tripType: searchData.tripType,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          transportation: data.transportation || [],
        }));
        setLoading((prev) => ({ ...prev, transportation: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, transportation: err.message }));
        setLoading((prev) => ({ ...prev, transportation: false }));
      });

    // Hotels API
    searchHotels({
      to: searchData.to,
      date: searchData.date,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          hotels: data.hotels || [],
        }));
        setLoading((prev) => ({ ...prev, hotels: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, hotels: err.message }));
        setLoading((prev) => ({ ...prev, hotels: false }));
      });

    // Things to Do API
    searchThingsToDo({
      to: searchData.to,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          todo: data.todo || [],
        }));
        setLoading((prev) => ({ ...prev, todo: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, todo: err.message }));
        setLoading((prev) => ({ ...prev, todo: false }));
      });

    // Tips and Stories API
    searchTipsAndStories({
      to: searchData.to,
    })
      .then((data) => {
        setResults((prev) => ({
          ...prev,
          tipsAndStories: data.tipsAndStories || [],
        }));
        setLoading((prev) => ({ ...prev, tipsAndStories: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, tipsAndStories: err.message }));
        setLoading((prev) => ({ ...prev, tipsAndStories: false }));
      })
      .finally(() => {
        // All APIs completed, re-enable search button
        setIsSearching(false);
      });

    // Save search history if user is logged in
    if (user && user.id) {
      createSearchHistory(user.id, searchData).catch((err) => {
        console.error("Error saving search history:", err);
      });
    }
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/search"
          element={
            <Box
              sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              }}
            >
              <Container maxWidth="lg">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ pt: 4, pb: 8 }}>
                    <Typography
                      variant={isMobile ? "h5" : "h4"}
                      component="h1"
                      align="center"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Find Your Perfect Travel Deals
                    </Typography>

                    <SearchForm
                      onSearch={handleSearch}
                      isSearching={isSearching}
                    />

                    {showResults && (
                      <Box id="results-section" sx={{ mt: 4 }}>
                        <ResultsSection
                          results={results}
                          loading={loading}
                          error={error}
                          activeTab={activeTab}
                          onTabChange={setActiveTab}
                        />
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Container>
            </Box>
          }
        />
        <Route path="/flights" element={<FlightSearch />} />

        {/* auth-only pages: redirect to home if already logged in */}
        <Route
          path="/signin"
          element={
            <AuthRoute>
              <JoinPage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          }
        />

        {/* protected pages: redirect to /join if not logged in */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
