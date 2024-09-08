import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/authentication/protecteRoutes/toLogin";
import { Toaster } from "./components/ui/toaster";
import ProtectedRouteToHome from "./components/authentication/protecteRoutes/toHome";
import { lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";

const SignUpPage = lazy(() =>
  import("./components/authentication/signup-page/index")
);
const HomePage = lazy(() => import("./components/Home/index"));
const LoginPage = lazy(() =>
  import("./components/authentication/login-page/index")
);
const Error404Page = lazy(() => import("./components/error404/index"));

function RoutesComponent() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <CircularProgress />
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRouteToHome>
              <SignUpPage />
            </ProtectedRouteToHome>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRouteToHome>
              <LoginPage />
            </ProtectedRouteToHome>
          }
        />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </Suspense>
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
