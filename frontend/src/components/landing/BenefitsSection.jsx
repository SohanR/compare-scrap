import React from "react";
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";

const BenefitCard = ({ icon: Icon, title, description, delay }) => (
  <Grid item xs={12} sm={6} md={3} data-aos="fade-up" data-aos-delay={delay}>
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "18px",
        boxShadow: "0 20px 50px rgba(15, 76, 117, 0.12)",
        p: 3,
        textAlign: "left",
        background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,248,255,0.9))",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 24px 60px rgba(2, 132, 199, 0.2)",
          transition: "all 0.3s ease",
        },
      }}
    >
      <CardContent>
        <Box sx={{ color: "primary.main", fontSize: 36, mb: 2 }}>
          <Icon />
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const BenefitsSection = ({ benefits }) => (
  <Box sx={{ mb: { xs: 8, md: 12 } }}>
    <Typography
      variant="h4"
      component="h2"
      align="center"
      fontWeight="bold"
      gutterBottom
      sx={{ mb: 6 }}
      data-aos="fade-up"
    >
      Why travelers stay with us
    </Typography>
    <Grid container spacing={4}>
      {benefits.map((benefit, index) => (
        <BenefitCard key={index} {...benefit} />
      ))}
    </Grid>
  </Box>
);

export default BenefitsSection;
