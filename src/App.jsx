import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpPage from "./components/authentication/signup-page";
import LoginPage from "./components/authentication/login-page";
import UserDetailsSingupPage from "./components/authentication/user-details";
import HomePage from "./components/Home";
import ProtectedRoute from "./components/authentication/protecteRoutes/toLogin";
import { Toaster } from "./components/ui/toaster";
import ProtectedRouteToHome from "./components/authentication/protecteRoutes/toHome";

function RoutesComponent() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRouteToHome>
              <LoginPage />
            </ProtectedRouteToHome>
          }
        />
        <Route
          path="/auth-userDetails"
          element={
            <ProtectedRouteToHome>
              <UserDetailsSingupPage />
            </ProtectedRouteToHome>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RoutesComponent />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
