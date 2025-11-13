import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useAuthStore from "../store/authStore";

const NavBar = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate(`/profile/${user?.id}`);
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate("/settings");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(16,24,40,0.06)",
      }}
    >
      <Toolbar sx={{ minHeight: 64, gap: 2 }}>
        {/* left: brand/home */}
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Button
            component={NavLink}
            to="/"
            sx={{
              color: "text.primary",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              🌍 TravelGo
            </Typography>
          </Button>
        </Box>

        {/* center: prominent search */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Button
            component={NavLink}
            to="/search"
            startIcon={
              <RocketLaunchIcon sx={{ transform: "translateY(-1px)" }} />
            }
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 8,
              px: 4,
              py: 1,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "0 6px 18px rgba(59,130,246,0.18)",
            }}
          >
            Get Set Go
          </Button>
        </Box>

        {/* right: join/login or user dropdown */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {isLoggedIn ? (
            <>
              <Button
                onClick={handleMenuOpen}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  textTransform: "none",
                  color: "text.primary",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                Hi, {user?.name}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={NavLink}
              to="/join"
              startIcon={<PersonAddAlt1Icon />}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderColor: "rgba(16,24,40,0.08)",
                color: "text.primary",
                fontWeight: 600,
              }}
            >
              Join
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
