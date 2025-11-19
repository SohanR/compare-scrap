import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchForm from "../components/SearchForm";
import ResultsSection from "../components/ResultsSection";
import { motion } from "framer-motion";
import {
  searchTransportation,
  searchHotels,
  searchThingsToDo,
  searchTipsAndStories,
  getWikiSummary,
  createSearchHistory,
} from "../utils/api";
import useAuthStore from "../store/authStore";

const SearchPage = () => {
  const [results, setResults] = useState({
    transportation: [],
    hotels: [],
    todo: [],
    tipsAndStories: [],
    wiki: null,
  });
  const [loading, setLoading] = useState({
    transportation: false,
    hotels: false,
    todo: false,
    tipsAndStories: false,
    wiki: false,
  });
  const [error, setError] = useState({
    transportation: null,
    hotels: null,
    todo: null,
    tipsAndStories: null,
    wiki: null,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useAuthStore((state) => state.user);

  const handleSearch = async (searchData) => {
    setIsSearching(true);
    setResults({
      transportation: [],
      hotels: [],
      todo: [],
      tipsAndStories: [],
      wiki: null,
    });
    setLoading({
      transportation: true,
      hotels: true,
      todo: true,
      tipsAndStories: true,
      wiki: true,
    });
    setError({
      transportation: null,
      hotels: null,
      todo: null,
      tipsAndStories: null,
      wiki: null,
    });
    setShowResults(true);
    setTimeout(() => {
      const resultsElement = document.getElementById("results-section");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
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
    searchHotels({
      to: searchData.to,
      date: searchData.date,
    })
      .then((data) => {
        setResults((prev) => ({ ...prev, hotels: data.hotels || [] }));
        setLoading((prev) => ({ ...prev, hotels: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, hotels: err.message }));
        setLoading((prev) => ({ ...prev, hotels: false }));
      });
    searchThingsToDo({
      to: searchData.to,
    })
      .then((data) => {
        setResults((prev) => ({ ...prev, todo: data.todo || [] }));
        setLoading((prev) => ({ ...prev, todo: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, todo: err.message }));
        setLoading((prev) => ({ ...prev, todo: false }));
      });
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
      });
    // Wiki API call
    getWikiSummary(searchData.to?.city)
      .then((data) => {
        setResults((prev) => ({ ...prev, wiki: data }));
        setLoading((prev) => ({ ...prev, wiki: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, wiki: err.message }));
        setLoading((prev) => ({ ...prev, wiki: false }));
      })
      .finally(() => {
        setIsSearching(false);
      });
    if (user && user.id) {
      createSearchHistory(user.id, searchData).catch((err) => {
        console.error("Error saving search history:", err);
      });
    }
  };

  return (
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
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Find Your Perfect Travel Deals
            </Typography>
            <SearchForm onSearch={handleSearch} isSearching={isSearching} />
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
  );
};

export default SearchPage;
