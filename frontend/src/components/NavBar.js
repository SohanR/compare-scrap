import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const NavBar = () => {
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
            startIcon={
              <Avatar
                sx={{
                  bgcolor: "linear-gradient(45deg,#6EE7B7,#3B82F6)",
                  width: 36,
                  height: 36,
                  fontSize: 14,
                }}
              >
                🌍
              </Avatar>
            }
            sx={{
              color: "text.primary",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              TravelGo
            </Typography>
          </Button>
        </Box>

        {/* center: prominent search */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Button
            component={NavLink}
            to="/search"
            startIcon={<RocketLaunchIcon sx={{ transform: "translateY(-1px)" }} />}
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

        {/* right: join/login */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
