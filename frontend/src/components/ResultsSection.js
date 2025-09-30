import React from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import ResultCard from "./ResultCard";
import PlaceCard from "./PlaceCard"; // Import PlaceCard
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FlightCard from "./FlightCard"; // Import FlightCard
import FlightSearch from "./FlightSearch";

const ResultsSection = ({
  results,
  loading,
  error,
  activeTab,
  onTabChange,
}) => {
  const renderContent = (Component, data) => {
    if (Component === FlightCard) {
      if (loading) {
        return (
          <Box sx={{ py: 4 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton height={200} />
              </Box>
            ))}
          </Box>
        );
      }
      if (error) {
        return (
          <Box sx={{ textAlign: "center", py: 4, color: "error.main" }}>
            <Typography variant="h6">{error}</Typography>
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
                <FlightCard key={index} item={item} />
              ))}
            </Box>
          </motion.div>
        </AnimatePresence>
      );
    }

    if (Component === FlightSearch) {
      // Always render FlightSearchTab directly for the Transportation tab
      return <FlightSearch />;
    }

    if (loading) {
      return (
        <Box sx={{ py: 4 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton height={200} />
            </Box>
          ))}
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ textAlign: "center", py: 4, color: "error.main" }}>
          <Typography variant="h6">{error}</Typography>
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
              <Component
                key={index}
                {...(Component === PlaceCard ? { place: item } : { item })}
              />
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
    },
    {
      label: "Hotels",
      Component: ResultCard,
      data: results?.hotels || [],
    },
    {
      label: "Things to Do",
      Component: PlaceCard,
      data: results?.todo || [],
    },
    {
      label: "Tips & Stories",
      Component: PlaceCard,
      data: results?.tipsAndStories || [],
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
                {tab.data && tab.data.length > 0 && (
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
                )}
              </Box>
            }
          />
        ))}
      </Tabs>

      {renderContent(tabData[activeTab].Component, tabData[activeTab].data)}
    </Box>
  );
};

export default ResultsSection;
