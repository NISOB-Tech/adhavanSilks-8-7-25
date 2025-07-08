import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    // If not logged in, send to admin login
    return <Navigate to="/admin/login" replace />;
  }

  if (userRole !== "admin") {
    // If logged in but not admin, send to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
