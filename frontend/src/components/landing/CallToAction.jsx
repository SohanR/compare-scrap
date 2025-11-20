import React from "react";
import { Box, Button, Typography } from "@mui/material";

const CallToAction = ({ onClick }) => (
  <Box
    data-aos="fade-up"
    data-aos-delay="100"
    sx={{
      textAlign: "center",
      p: { xs: 4, md: 5 },
      borderRadius: "18px",
      background: "linear-gradient(120deg, #0d6e7a, #12a3ba)",
      color: "white",
      boxShadow: "0 25px 60px rgba(13,110,122,0.3)",
    }}
  >
    <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
      Ready to Plan Your Next Trip?
    </Typography>
    <Typography
      variant="body1"
      color="rgba(255,255,255,0.86)"
      paragraph
      sx={{ maxWidth: 640, mx: "auto" }}
    >
      Compare with confidence, pick with clarity, and keep every piece of your journey in one place.
    </Typography>
    <Button
      variant="contained"
      color="secondary"
      size="large"
      onClick={onClick}
      sx={{
        py: 2,
        px: 4,
        borderRadius: "14px",
        bgcolor: "white",
        color: "primary.main",
        fontWeight: 700,
        boxShadow: "0 14px 35px rgba(255,255,255,0.2)",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.9)",
        },
      }}
    >
      Start Comparing
    </Button>
  </Box>
);

export default CallToAction;
