import React from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { FaPlane, FaHotel, FaMapMarkedAlt, FaFilm, FaShoppingCart, FaChartLine } from 'react-icons/fa';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
        <Box sx={{ color: 'primary.main', mb: 2 }}>
          <Icon size={40} />
        </Box>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    <Box
      sx={{
        textAlign: 'center',
        p: 2,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </motion.div>
);

const LandingPage = ({ onGetStarted }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: FaPlane,
      title: 'Transportation',
      description: 'Compare flights and buses to find the best deals for your journey.'
    },
    {
      icon: FaHotel,
      title: 'Hotels',
      description: 'Discover perfect accommodations with our comprehensive hotel comparison.'
    },
    {
      icon: FaMapMarkedAlt,
      title: 'Tourist Places',
      description: 'Explore and compare popular tourist destinations and attractions.'
    },
    {
      icon: FaFilm,
      title: 'Coming Soon: Entertainment',
      description: 'Movie theaters, events, and more entertainment options.'
    },
    {
      icon: FaShoppingCart,
      title: 'Coming Soon: Shopping',
      description: 'Compare prices across multiple shopping platforms.'
    },
    {
      icon: FaChartLine,
      title: 'Coming Soon: Price Analytics',
      description: 'Advanced price tracking and prediction features.'
    }
  ];

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant={isMobile ? "h3" : "h2"}
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                The Future of Smart Comparison
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Experience the power of AI-driven comparison shopping. We help you make informed decisions with 90% accuracy across travel, accommodation, and more.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={onGetStarted}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: '30px',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)',
                  }
                }}
              >
                Get Started
              </Button>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                component="img"
                src="https://source.unsplash.com/featured/?travel,technology"
                alt="Travel Comparison"
                sx={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Stats Section */}
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard value="90%" label="Success Rate" delay={0.2} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard value="1M+" label="Happy Users" delay={0.3} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard value="24/7" label="Customer Support" delay={0.4} />
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Our Services
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} delay={0.2 + index * 0.1} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(33,203,243,0.1) 100%)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
            Ready to Start Comparing?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join millions of smart shoppers who trust us for their comparison needs.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onGetStarted}
            sx={{
              py: 2,
              px: 4,
              borderRadius: '30px',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)',
              }
            }}
          >
            Start Comparing Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
