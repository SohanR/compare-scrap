import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";

const JoinPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be 6+ chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    // TODO: connect to auth API
    console.log("Login:", { email, password });
    // temporary success behavior
    navigate("/"); // redirect to home after login
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, rgba(255,245,235,0.6) 0%, rgba(235,245,255,0.6) 100%)",
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 960,
          width: "100%",
          display: "flex",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* left: visual */}
        <Box
          sx={{
            flex: 1,
            background:
              "linear-gradient(180deg, rgba(59,130,246,0.12), rgba(99,102,241,0.06))",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 84, height: 84 }}>
            <FlightTakeoffIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Welcome Back, Traveler
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ maxWidth: 220 }}
          >
            Sign in to compare the best travel deals, save favorites, and plan
            your next escape.
          </Typography>
        </Box>

        {/* right: form */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 6 } }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Sign in to TravelGo
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={onSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: <EmailOutlinedIcon sx={{ mr: 1 }} />,
              }}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: <LockOutlinedIcon sx={{ mr: 1 }} />,
              }}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 1, borderRadius: 2 }}
            >
              Login
            </Button>

            <Divider sx={{ my: 1 }} />

            <Typography variant="body2" align="center">
              Don't have an account?{" "}
              <MuiLink component={Link} to="/signup" underline="hover">
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default JoinPage;
