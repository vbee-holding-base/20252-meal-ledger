import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
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
import PaymentPage from "./pages/debt/Payment";
//import HelpSupport from "./pages/more/HelpSupport";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">{t("app.loading")}</p>
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
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-background flex justify-center">
            <div className="w-full max-w-md bg-background min-h-screen relative shadow-2xl overflow-x-hidden">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route
                  path="/"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/participants"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <ParticipantManagement />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/participants/:id/edit"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <EditParticipant />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/restaurants"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <RestaurantManagement />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/restaurants/:id/edit"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <EditRestaurant />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/add-meal"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <AddMeal />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/add-meal-detail"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <AddMealDetail />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/debts"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <DebtManagement />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route path="/debts/:id" element={<DebtDetailsPage />} />
                <Route
                  path="/more"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <More />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/more/bank-account"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <BankAccountSettings />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route
                  path="/more/general-settings"
                  element={
                    <AuthProvider>
                      <ProtectedRoute>
                        <GeneralSettings />
                      </ProtectedRoute>
                    </AuthProvider>
                  }
                />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <BottomNav />
            </div>
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
