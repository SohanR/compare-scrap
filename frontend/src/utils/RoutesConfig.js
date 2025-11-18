import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SearchPage from "../pages/SearchPage";
import ProfilePage from "../pages/ProfilePage";

import JoinPage from "../pages/JoinPage";
import SignupPage from "../pages/SignupPage";
import SettingsPage from "../pages/SettingsPage";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";

const RoutesConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />

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
