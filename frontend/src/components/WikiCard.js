import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import { OpenInNew, LocationOn, Info, BookOpen } from "@mui/icons-material";
import { motion } from "framer-motion";

const WikiCard = ({ wikiData }) => {
  if (!wikiData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          "&:hover": {
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
          },
        }}
      >
        {/* Image Section */}
        {wikiData.thumbnail && (
          <CardMedia
            component="img"
            height="300"
            image={wikiData.thumbnail.source}
            alt={wikiData.title}
            sx={{
              objectFit: "cover",
            }}
          />
        )}

        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* Title */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              {wikiData.title}
            </Typography>

            {/* Description */}
            {wikiData.description && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  bgcolor: "rgba(33, 150, 243, 0.08)",
                  borderRadius: 2,
                  borderLeft: "4px solid #2196F3",
                }}
              >
                <Info sx={{ color: "primary.main", flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {wikiData.description}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Coordinates */}
          {wikiData.coordinates && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <LocationOn sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Location
                </Typography>
              </Box>
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: "background.default",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  📍 Latitude: {wikiData.coordinates.lat.toFixed(4)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 Longitude: {wikiData.coordinates.lon.toFixed(4)}
                </Typography>
              </Paper>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Extract */}
          {wikiData.extract && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <BookOpen sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  About This Place
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.8,
                  color: "text.secondary",
                  p: 2,
                  bgcolor: "rgba(0,0,0,0.02)",
                  borderRadius: 2,
                  borderLeft: "4px solid #2196F3",
                }}
              >
                {wikiData.extract}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* CTA Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<OpenInNew />}
              href={wikiData.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
                },
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Read Full Article on Wikipedia
            </Button>
          </motion.div>

          {/* Info Footer */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Information powered by Wikipedia
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WikiCard;
