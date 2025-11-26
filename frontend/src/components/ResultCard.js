import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaCoffee,
  FaDumbbell,
  FaBus,
  FaPlane,
} from "react-icons/fa";
import BookmarkButton from "./BookmarkButton";

const amenityIcons = {
  WiFi: FaWifi,
  Pool: FaSwimmingPool,
  Parking: FaParking,
  Restaurant: FaCoffee,
  Gym: FaDumbbell,
  bus: FaBus,
  flight: FaPlane,
};

const ResultCard = ({
  item,
  type,
  onBookmark,
  showBookmark = true,
  bookmarked = false,
}) => {
  const currencySymbols = {
    USD: "$",
    EUR: "EUR ",
    GBP: "GBP ",
  };

  const formatPrice = (price, currency = "USD") => {
    const symbol = currencySymbols[currency?.toUpperCase()] || "$";
    if (typeof price === "number") return `${symbol}${price.toFixed(2)}`;
    return price ? `${symbol}${price}` : "N/A";
  };

  const getAmenityIcon = (amenity) => {
    const IconComponent = amenityIcons[amenity] || FaCoffee;
    return <IconComponent />;
  };

  const getTransportIcon = () => {
    return item.type === "bus" ? <FaBus /> : <FaPlane />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          display: "flex",
          mb: 2,
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          position: "relative",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
          },
        }}
      >
        {showBookmark && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.85)",
              borderRadius: "50%",
              boxShadow: 1,
            }}
          >
            <BookmarkButton onBookmark={onBookmark} bookmarked={bookmarked} />
          </Box>
        )}

        <CardMedia
          component="img"
          sx={{ width: 200, objectFit: "cover" }}
          image={item.imageUrl}
          alt={item.name}
        />

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ flex: "1 0 auto", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {type === "transportation" && (
                <Box sx={{ mr: 1, color: "primary.main" }}>
                  {getTransportIcon()}
                </Box>
              )}
              <Typography variant="h6" fontWeight="bold">
                {item.name || item.provider}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Rating
                value={parseFloat(item.rating) / 2 || 0}
                readOnly
                precision={0.1}
                size="small"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({item.rating || "Not rated"})
              </Typography>
            </Box>

            {type === "hotel" && (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.location}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
                  {item.amenities?.slice(0, 5).map((amenity, index) => (
                    <Chip
                      key={index}
                      icon={getAmenityIcon(amenity)}
                      label={amenity}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="h6" color="primary" fontWeight="bold">
                {formatPrice(item.price, item.currency)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                href={item.bookingLink}
                target="_blank"
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  background:
                    "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
                  },
                }}
              >
                Book Now
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
