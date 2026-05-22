import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ParticipantManagement from "./pages/ParticipantManagement";
import RestaurantManagement from "./pages/RestaurantManagement";
import AddMeal from "./pages/AddMeal";
import DebtDetails from "./pages/DebtDetails";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-md bg-background min-h-screen relative shadow-2xl overflow-x-hidden">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={<Home />} />
            <Route path="/participants" element={<ParticipantManagement />} />
            <Route path="/restaurants" element={<RestaurantManagement />} />
            <Route path="/add-meal" element={<AddMeal />} />
            <Route path="/debts/:name" element={<DebtDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </div>
    </Router>
  );
}

export default App;
