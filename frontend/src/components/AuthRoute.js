import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AuthRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AuthRoute;
