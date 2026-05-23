import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ParticipantManagement from "./pages/ParticipantManagement";
import RestaurantManagement from "./pages/RestaurantManagement";
import AddMeal from "./pages/AddMeal";
import DebtDetails from "./pages/DebtDetails";
import BottomNav from "./components/BottomNav";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">Đang tải...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex justify-center">
          <div className="w-full max-w-md bg-background min-h-screen relative shadow-2xl overflow-x-hidden">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/participants"
                element={
                  <ProtectedRoute>
                    <ParticipantManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurants"
                element={
                  <ProtectedRoute>
                    <RestaurantManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-meal"
                element={
                  <ProtectedRoute>
                    <AddMeal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/debts/:name"
                element={
                  <ProtectedRoute>
                    <DebtDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
