import React from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(["access_token"]);
  if (!cookies.access_token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
