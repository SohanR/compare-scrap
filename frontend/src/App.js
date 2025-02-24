import React, { useState } from 'react';
import { Container, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import SearchForm from './components/SearchForm';
import ResultsSection from './components/ResultsSection';
import LandingPage from './components/LandingPage';
import { motion } from 'framer-motion';
import { searchTravel } from './utils/api';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchTravel(searchData);
      setResults(data);
      setShowSearch(true);
      
      // Smooth scroll to results
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="lg">
        {!showSearch ? (
          <LandingPage onGetStarted={() => setShowSearch(true)} />
        ) : (
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
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Find Your Perfect Travel Deals
              </Typography>
              
              <SearchForm onSearch={handleSearch} loading={loading} />
              
              {(results || loading || error) && (
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
        )}
      </Container>
    </Box>
  );
}

export default App;
