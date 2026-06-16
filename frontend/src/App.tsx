import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ParticipantManagement from "./pages/participants/ParticipantManagement";
import EditParticipant from "./pages/participants/EditParticipant";
import RestaurantManagement from "./pages/restaurants/RestaurantManagement";
import EditRestaurant from "./pages/restaurants/EditRestaurant";
import AddMeal from "./pages/AddMeal";
import DebtDetailsPage from "./pages/debt/DebtDetails";
import BottomNav from "./components/layout/BottomNav";
import AddMealDetail from "./pages/AddMealDetail";
import DebtManagement from "./pages/debt/DebtManagement";
import More from "./pages/more/More";
import BankAccountSettings from "./pages/more/BankAccountSetting";
import GeneralSettings from "./pages/more/GeneralSettings";
//import HelpSupport from "./pages/more/HelpSupport";

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
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background flex justify-center">
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
                  path="/participants/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditParticipant />
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
                  path="/restaurants/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditRestaurant />
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
                  path="/add-meal-detail"
                  element={
                    <ProtectedRoute>
                      <AddMealDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/debts"
                  element={
                    <ProtectedRoute>
                      <DebtManagement />
                    </ProtectedRoute>
                  }
                />
                <Route path="/debts/:id" element={<DebtDetailsPage />} />
                <Route
                  path="/more"
                  element={
                    <ProtectedRoute>
                      <More />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/more/bank-account"
                  element={
                    <ProtectedRoute>
                      <BankAccountSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/more/general-settings"
                  element={
                    <ProtectedRoute>
                      <GeneralSettings />
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
    </ThemeProvider>
  );
}

export default App;
