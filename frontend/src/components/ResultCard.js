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

const amenityIcons = {
  WiFi: FaWifi,
  Pool: FaSwimmingPool,
  Parking: FaParking,
  Restaurant: FaCoffee,
  Gym: FaDumbbell,
  bus: FaBus,
  flight: FaPlane,
};

const ResultCard = ({ item, type }) => {
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
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 200, objectFit: "cover" }}
          image={
            item.imageUrl || `https://source.unsplash.com/featured/?${type}`
          }
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
                value={parseFloat(item.rating) || 0}
                readOnly
                precision={0.5}
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

            {type === "transportation" && (
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      From - To
                    </Typography>
                    <Typography variant="body1">
                      {item.from} → {item.to}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">{item.duration}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Time
                    </Typography>
                    <Typography variant="body1">
                      {item.departureTime} - {item.arrivalTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {type === "tourist-place" && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {item.description}
              </Typography>
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
                ৳
                {typeof item.price === "number"
                  ? item.price.toFixed(2)
                  : item.price}
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
