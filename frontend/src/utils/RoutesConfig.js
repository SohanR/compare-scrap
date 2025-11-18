import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import SearchPage from "../pages/SearchPage";
import ProfilePage from "../pages/ProfilePage";
import FlightSearch from "../components/FlightSearch";
import JoinPage from "../components/JoinPage";
import SignupPage from "../components/SignupPage";
import SettingsPage from "../components/SettingsPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthRoute from "../components/AuthRoute";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/flights" element={<FlightSearch />} />

      {/* Auth-only pages: redirect to home if already logged in */}
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

      {/* Protected pages: redirect to /join if not logged in */}
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
  );
};

export default RoutesConfig;
