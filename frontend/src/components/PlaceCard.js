import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const PlaceCard = ({ place }) => {
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
          cursor: "pointer",
          position: "relative", // For positioning the hover message
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
          },
          "&:hover .hover-message": {
            opacity: 1,
            visibility: "visible",
          },
        }}
        onClick={() => window.open(place.link, "_blank")}
      >
        <CardMedia
          component="img"
          sx={{ width: 200, objectFit: "cover" }}
          image={place.imageUrl || `https://picsum.photos/200`}
          alt={place.name}
        />

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <CardContent sx={{ flex: "1 0 auto", p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {place.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {place.description}
            </Typography>
          </CardContent>
        </Box>

        {/* Hover message */}
        <Box
          className="hover-message"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            textAlign: "center",
            py: 1,
            opacity: 0,
            visibility: "hidden",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
          }}
        >
          Click here to read more
        </Box>
      </Card>
    </motion.div>
  );
};

export default PlaceCard;
