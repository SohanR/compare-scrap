import React from "react";
import { Box, Typography, Tabs, Tab, CircularProgress } from "@mui/material";
import ResultCard from "./ResultCard";
import PlaceCard from "./PlaceCard";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FlightCard from "./FlightCard";

const ResultsSection = ({
  results,
  loading,
  error,
  activeTab,
  onTabChange,
}) => {
  const renderContent = (Component, data, isLoading, isError) => {
    if (isLoading) {
      return (
        <Box sx={{ py: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={24} />
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      );
    }

    if (isError) {
      return (
        <Box sx={{ textAlign: "center", py: 4, color: "error.main" }}>
          <Typography variant="h6">{isError}</Typography>
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography variant="h6">No results found</Typography>
          <Typography variant="body2">
            Try adjusting your search criteria
          </Typography>
        </Box>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ py: 4 }}>
            {data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Component
                  key={index}
                  {...(Component === PlaceCard ? { place: item } : { item })}
                />
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </AnimatePresence>
    );
  };

  const tabData = [
    {
      label: "Transportation",
      Component: FlightCard,
      data: results?.transportation || [],
      isLoading: loading?.transportation || false,
      isError: error?.transportation || null,
    },
    {
      label: "Hotels",
      Component: ResultCard,
      data: results?.hotels || [],
      isLoading: loading?.hotels || false,
      isError: error?.hotels || null,
    },
    {
      label: "Things to Do",
      Component: PlaceCard,
      data: results?.todo || [],
      isLoading: loading?.todo || false,
      isError: error?.todo || null,
    },
    {
      label: "Blogs & Articles",
      Component: PlaceCard,
      data: results?.tipsAndStories || [],
      isLoading: loading?.tipsAndStories || false,
      isError: error?.tipsAndStories || null,
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        variant="fullWidth"
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
          },
        }}
      >
        {tabData.map((tab, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>{tab.label}</span>
                {tab.isLoading ? (
                  <CircularProgress size={16} />
                ) : tab.data && tab.data.length > 0 ? (
                  <Box
                    component="span"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      px: 1,
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {tab.data.length}
                  </Box>
                ) : null}
              </Box>
            }
          />
        ))}
      </Tabs>

      {renderContent(
        tabData[activeTab].Component,
        tabData[activeTab].data,
        tabData[activeTab].isLoading,
        tabData[activeTab].isError
      )}
    </Box>
  );
};

export default ResultsSection;
