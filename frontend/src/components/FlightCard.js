import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CardMedia,
  Divider,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaPlane } from "react-icons/fa";

const FlightCard = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          display: "flex",
          mb: 2.5,
          overflow: "hidden",
          borderRadius: "16px",
          boxShadow: "0 6px 24px rgba(33,150,243,0.08)",
          position: "relative",
          background: "linear-gradient(90deg, #f5fafd 60%, #e3f2fd 100%)",
          border: "1px solid #e3f2fd",
          minHeight: 170,
        }}
      >
        <CardMedia
          component="div"
          sx={{
            width: 120,
            minWidth: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#e3f2fd",
            borderRight: "1px solid #bbdefb",
            py: 2,
          }}
        >
          {item.airlineLogos && item.airlineLogos.length > 0 ? (
            <img
              src={item.airlineLogos[0]}
              alt="Airline Logo"
              style={{
                width: 64,
                height: 48,
                objectFit: "contain",
                marginBottom: 8,
              }}
            />
          ) : (
            <FaPlane size={44} color="#2196F3" />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item.airlinePath || "-"}
          </Typography>
        </CardMedia>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ flex: "1 0 auto", p: 3, pb: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#1976d2" }}
              >
                {item.flightName || "Unknown Airline"}
              </Typography>
              {item.stops && (
                <Chip
                  label={item.stops}
                  size="small"
                  sx={{
                    ml: 2,
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                gap: 4,
              }}
            >
              {/* Left: Flight Details */}
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Time
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {item.time || "-"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {item.duration || "-"}
                    </Typography>
                  </Box>
                </Box>
                {/* Provider: only show if not null */}
                {item.provider ? (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Provider
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {item.provider}
                    </Typography>
                  </Box>
                ) : null}
              </Box>
              {/* Right: Price and Booking */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  minWidth: 140,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                  >
                    {item.price ? item.price : "N/A"}
                  </Typography>
                </Box>
                {item.bookingLink ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      href={item.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
                        },
                      }}
                    >
                      Book Now
                    </Button>
                    <MuiLink
                      href={item.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        color: "#1976d2",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                      }}
                    >
                      Visit Booking Site
                    </MuiLink>
                  </Box>
                ) : null}
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </motion.div>
  );
};

export default FlightCard;
