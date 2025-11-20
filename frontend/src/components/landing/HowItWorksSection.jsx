import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const StepCard = ({ icon: Icon, title, description, delay }) => (
  <Box
    data-aos="fade-up"
    data-aos-delay={delay}
    sx={{
      textAlign: "left",
      p: 3,
      borderRadius: "18px",
      background: "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(245,250,255,0.94))",
      border: "1px solid rgba(255,255,255,0.6)",
      boxShadow: "0 24px 60px rgba(17, 40, 70, 0.1)",
      height: "100%",
    }}
  >
    <Box sx={{ color: "primary.main", fontSize: 40, mb: 1.5, display: "inline-block" }}>
      <Icon />
    </Box>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

const HowItWorksSection = ({ steps }) => (
  <Box sx={{ mb: { xs: 8, md: 12 } }}>
    <Typography
      variant="h4"
      component="h2"
      align="center"
      fontWeight="bold"
      gutterBottom
      sx={{ mb: 4 }}
      data-aos="fade-up"
    >
      Plan in minutes, not days
    </Typography>
    <Grid container spacing={3}>
      {steps.map((step, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <StepCard {...step} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default HowItWorksSection;
