import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardMedia, Skeleton } from "@mui/material";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

const DestinationCard = ({ name, image }) => (
  <Card
    sx={{
      position: "relative",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      height: "100%",
    }}
  >
    <CardMedia
      component="img"
      height="280"
      image={image || FALLBACK_IMG}
      alt={name}
      sx={{ objectFit: "cover" }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 100%)",
        color: "white",
        p: 2.5,
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        {name}
      </Typography>
    </Box>
  </Card>
);

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDestinations = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/trending/destinations/top6`
        );
        setDestinations(res.data?.data || []);
      } catch (err) {
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDestinations();
  }, []);

  const itemsToRender =
    destinations.length > 0
      ? destinations.slice(0, 6)
      : loading
      ? Array.from({ length: 6 })
      : [];

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
        Trending Destinations
      </Typography>
      <Grid container spacing={3}>
        {itemsToRender.map((dest, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={dest?.city || index}
            data-aos="fade-up"
            data-aos-delay={100 * (index + 1)}
          >
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={280}
                sx={{ borderRadius: "16px" }}
              />
            ) : (
              <DestinationCard
                name={dest.city || "Unknown"}
                image={dest.image}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedDestinations;
