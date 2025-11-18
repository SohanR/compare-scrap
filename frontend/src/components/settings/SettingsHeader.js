import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

const SettingsHeader = () => {
  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "white", mb: 1 }}
          >
            Settings
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Manage your account, security, and preferences
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default SettingsHeader;
