import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import useAuthStore from "../store/authStore";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Box sx={{ minHeight: "80vh", py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            My Profile
          </Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{user?.name}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1">{user?.id}</Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;
