import React, { useState, useEffect } from "react";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  searchTransportation,
  searchHotels,
  searchThingsToDo,
  searchTipsAndStories,
  getWikiSummary,
  createSearchHistory,
  addBookmark,
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
  const [destination, setDestination] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [lastSearchData, setLastSearchData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useAuthStore((state) => state.user);

  // Update background image when wiki data is loaded
  useEffect(() => {
    if (results?.wiki?.originalimage?.source && !loading.wiki) {
      setBackgroundImage(results.wiki.originalimage.source);
    }
  }, [results?.wiki?.originalimage?.source, loading.wiki]);

  console.log("bg img", backgroundImage);

  const handleSearch = async (searchData) => {
    setIsSearching(true);
    setLastSearchData(searchData);
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
    setDestination(searchData.to.city);
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

  const handleBookmark = async ({ category, index, item }) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error("Please log in to save bookmarks.");
      return false;
    }

    if (!lastSearchData) {
      toast.error("No search context available. Please run a search first.");
      return false;
    }

    const bookmarkPayload = {
      userId,
      category,
      index,
      item,
      search: {
        from: lastSearchData.from,
        to: lastSearchData.to,
        date: lastSearchData.date,
        returnDate: lastSearchData.returnDate,
        tripType: lastSearchData.tripType,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      await addBookmark(bookmarkPayload);
      setBookmarkedItems((prev) => {
        const updated = [...prev, bookmarkPayload];
        console.log("Bookmark saved to backend:", bookmarkPayload);
        console.log("All bookmarks queued for backend:", updated);
        return updated;
      });
      // Debug: show current bookmarks array after click
      console.log("Bookmarked items array after click:", [
        ...bookmarkedItems,
        bookmarkPayload,
      ]);
      toast.success("Saved to bookmarks");
      return true;
    } catch (err) {
      console.error("Failed to save bookmark:", err);
      toast.error(err.message || "Failed to save bookmark");
      return false;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
        transition: "all 0.5s ease-in-out",
        // Background image with overlay - only applied when image is loaded
        ...(backgroundImage && {
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "blur(5px)",
            opacity: 12,
            zIndex: 0,
            transition: "opacity 0.5s ease-in-out",
          },
        }),
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
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
                  destination={destination}
                  onBookmark={handleBookmark}
                />
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>
      <ToastContainer position="top-center" />
    </Box>
  );
};

export default SearchPage;
