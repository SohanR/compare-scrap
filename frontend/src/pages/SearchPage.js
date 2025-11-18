import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchForm from "../components/SearchForm";
import ResultsSection from "../components/ResultsSection";
import useSearchHandler from "../hooks/useSearchHandler";

const SearchPage = () => {
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

  const handleSearch = useSearchHandler({
    setResults,
    setLoading,
    setError,
    setShowResults,
    setIsSearching,
  });

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
