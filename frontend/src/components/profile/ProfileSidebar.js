import React, { useState } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Flight,
  LocalOffer,
  Bookmark,
  History,
  EmojiFlags,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";

const ProfileSidebar = ({ bookmarks, history, onTabChange }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [bio] = useState(user?.bio || "");
  const [visitedCountries] = useState([
    { code: "🇧🇩", name: "Bangladesh", year: 2023 },
    { code: "🇹🇭", name: "Thailand", year: 2023 },
    { code: "🇻🇳", name: "Vietnam", year: 2022 },
  ]);

  const handleLogout = () => {
    logout();
    toast.info("Logged out");
    navigate("/");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 84,
            height: 84,
            bgcolor: "primary.main",
            fontSize: 28,
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {user?.name || "Traveler"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || "No email"}
          </Typography>
        </Box>
      </Box>

      {/* Bio Section */}
      <Paper
        sx={{
          p: 2,
          mt: 3,
          bgcolor: "primary.light",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          YOUR BIO
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, minHeight: 40 }}>
          {bio || "No bio added yet. Add one in settings!"}
        </Typography>
      </Paper>

      {/* Visited Countries */}
      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
          }}
        >
          <EmojiFlags sx={{ color: "primary.main" }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Visited Countries ({visitedCountries.length})
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {visitedCountries.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              Start adding countries you've visited!
            </Typography>
          ) : (
            visitedCountries.map((country, idx) => (
              <Chip
                key={idx}
                label={`${country.code} ${country.name}`}
                size="small"
                variant="outlined"
                icon={undefined}
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderColor: "primary.main",
                  color: "primary.main",
                }}
              />
            ))
          )}
        </Box>
      </Box>

      {/* Quick Stats */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          gap: 1,
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Quick stats
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Paper sx={{ p: 1.5, flex: 1, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {bookmarks.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Bookmarks
            </Typography>
          </Paper>
          <Paper sx={{ p: 1.5, flex: 1, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {history.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Searches
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            fullWidth
            onClick={() => navigate("/settings")}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Traveler tools
        </Typography>
        <Box sx={{ display: "grid", gap: 1 }}>
          <Button
            startIcon={<Flight />}
            variant="text"
            component="a"
            href="/search"
          >
            Find Flights & Hotels
          </Button>
          <Button
            startIcon={<LocalOffer />}
            variant="text"
            component="a"
            href="/search"
          >
            Deals & Alerts
          </Button>
          <Button
            startIcon={<Bookmark />}
            variant="text"
            onClick={() => onTabChange(1)}
          >
            My Bookmarks
          </Button>
          <Button
            startIcon={<History />}
            variant="text"
            onClick={() => onTabChange(2)}
          >
            Search History
          </Button>
        </Box>

        <Box sx={{ mt: "auto", pt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<Delete />}
            fullWidth
            sx={{
              "&:hover": {
                backgroundColor: "error.main",
                color: "white",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileSidebar;
