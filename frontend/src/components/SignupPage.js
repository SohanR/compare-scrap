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

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (ev) => {
    ev.preventDefault();
    // lightweight validation
    if (!name || !email || !password) return;
    console.log("Signup:", { name, email });
    // TODO: call signup API
    navigate("/join"); // go to login after signup
  };

  return (
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
            <MuiLink component={Link} to="/join" underline="hover">
              Login
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignupPage;
