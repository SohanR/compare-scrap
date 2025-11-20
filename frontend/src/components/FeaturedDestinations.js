import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const destinations = [
  {
    name: "Paris, France",
    image: "https://api.lorem.space/image/game?w=150&h=220",
    description: "The city of love, lights, and art.",
  },
  {
    name: "Kyoto, Japan",
    image: "https://api.lorem.space/image/game?w=150&h=220",
    description: "Ancient temples and serene gardens.",
  },
  {
    name: "Rome, Italy",
    image: "https://api.lorem.space/image/game?w=150&h=220",
    description: "A journey through history and cuisine.",
  },
  {
    name: "New York, USA",
    image: "https://api.lorem.space/image/game?w=150&h=220",
    description: "The city that never sleeps.",
  },
];

const DestinationCard = ({ name, image, description }) => (
  <Card
    sx={{
      position: "relative",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      "&:hover .destination-content": {
        transform: "translateY(0)",
        opacity: 1,
      },
    }}
  >
    <CardMedia component="img" height="350" image={image} alt={name} />
    <Box
      className="destination-content"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
        color: "white",
        p: 3,
        transform: "translateY(50%)",
        opacity: 0,
        transition: "all 0.4s ease-in-out",
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        {name}
      </Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  </Card>
);

const FeaturedDestinations = () => {
  return (
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
        Featured Destinations
      </Typography>
      <Grid container spacing={4}>
        {destinations.map((dest, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={index}
            data-aos="fade-up"
            data-aos-delay={100 * (index + 1)}
          >
            <DestinationCard {...dest} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedDestinations;
