import React from "react";
import {
  Container,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LandingPage from "./pages/LandingPage";
import { motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import JoinPage from "./pages/JoinPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import AuthRoute from "./utils/AuthRoute";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        {/* auth-only pages: redirect to home if already logged in */}
        <Route
          path="/signin"
          element={
            <AuthRoute>
              <JoinPage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          }
        />
        {/* protected pages: redirect to /join if not logged in */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
