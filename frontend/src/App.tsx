import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ParticipantManagement from './pages/ParticipantManagement'
import RestaurantManagement from './pages/RestaurantManagement'

function App() {
  return (
    <Router>
      <Routes>
        {/* Set login as default route for now, or could be Home if user is authenticated */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/participants" element={<ParticipantManagement />} />
        <Route path="/restaurants" element={<RestaurantManagement />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
