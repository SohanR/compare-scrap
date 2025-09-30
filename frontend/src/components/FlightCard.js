import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CardMedia,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaPlane } from "react-icons/fa";

const FlightCard = ({ item }) => {
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
          cursor: item.bookingLink ? "pointer" : "default",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
          },
        }}
        onClick={() =>
          item.bookingLink && window.open(item.bookingLink, "_blank")
        }
      >
        {/* Optional: Airline image placeholder */}
        <CardMedia
          component="div"
          sx={{
            width: 120,
            minWidth: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f5f5f5",
          }}
        >
          <FaPlane size={40} color="#2196F3" />
        </CardMedia>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ flex: "1 0 auto", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {item.flightName || "Unknown Airline"}
              </Typography>
              {item.stops && (
                <Box
                  sx={{
                    ml: 2,
                    bgcolor: "primary.light",
                    color: "primary.main",
                    px: 1.5,
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                  }}
                >
                  {item.stops}
                </Box>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Time
                </Typography>
                <Typography variant="body1">{item.time || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1">{item.duration || "-"}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Provider
                </Typography>
                <Typography variant="body1">{item.provider || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {item.price ? item.price : "N/A"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                href={item.bookingLink}
                target="_blank"
                disabled={!item.bookingLink}
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

export default FlightCard;
