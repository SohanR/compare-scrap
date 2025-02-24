import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import ResultCard from './ResultCard';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ResultsSection = ({ results, loading, error, activeTab, onTabChange }) => {
  const renderContent = () => {
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
        <Box sx={{ textAlign: 'center', py: 4, color: 'error.main' }}>
          <Typography variant="h6">{error}</Typography>
        </Box>
      );
    }

    if (!results) {
      return null;
    }

    const { transportation, hotels, touristPlaces } = results;
    const currentResults = {
      0: transportation || [],
      1: hotels || [],
      2: touristPlaces || []
    }[activeTab];

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
            {currentResults.length > 0 ? (
              currentResults.map((item, index) => (
                <ResultCard
                  key={index}
                  item={item}
                  type={['transportation', 'hotel', 'tourist-place'][activeTab]}
                />
              ))
            ) : (
              <Box 
                sx={{ 
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary'
                }}
              >
                <Typography variant="h6">
                  No results found
                </Typography>
                <Typography variant="body2">
                  Try adjusting your search criteria
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        variant="fullWidth"
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500
          }
        }}
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Transportation</span>
              {results?.transportation?.length > 0 && (
                <Box component="span" sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  {results.transportation.length}
                </Box>
              )}
            </Box>
          }
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Hotels</span>
              {results?.hotels?.length > 0 && (
                <Box component="span" sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  {results.hotels.length}
                </Box>
              )}
            </Box>
          }
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Tourist Places</span>
              {results?.touristPlaces?.length > 0 && (
                <Box component="span" sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  borderRadius: '12px',
                  fontSize: '0.75rem'
                }}>
                  {results.touristPlaces.length}
                </Box>
              )}
            </Box>
          }
        />
      </Tabs>

      {renderContent()}
    </Box>
  );
};

export default ResultsSection;
