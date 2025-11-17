import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");
    setApiSuccess("");
    if (!name || !email || !password) {
      setApiError("All fields are required");
      toast.error("All fields are required");
      return;
    }
    try {
      await signupUser({ name, email, password });
      setApiSuccess("Signup successful! Please login.");
      toast.success("Signup successful! Please login.");
      setTimeout(() => navigate("/signin"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed";
      setApiError(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 560,
            width: "100%",
            p: { xs: 3, md: 5 },
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <PersonAddAlt1Icon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Create your traveler account
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Join the community to save searches, get alerts and discover curated
            deals.
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={onSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            {apiError && (
              <Typography color="error" sx={{ mb: 1 }}>
                {apiError}
              </Typography>
            )}
            {apiSuccess && (
              <Typography color="success.main" sx={{ mb: 1 }}>
                {apiSuccess}
              </Typography>
            )}
            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 1, borderRadius: 2 }}
            >
              Create account
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Already have an account?{" "}
              <MuiLink component={Link} to="/signin" underline="hover">
                Login
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default SignupPage;
