import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";

const SettingsPage = () => {
  return (
    <Box sx={{ minHeight: "80vh", py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Settings page coming soon...
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SettingsPage;
