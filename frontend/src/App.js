import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import SubmitRequest from './pages/farmer/SubmitRequest';
import MyRequests from './pages/farmer/MyRequests';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AllRequests from './pages/officer/AllRequests';

// Root redirect based on auth state
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div> Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'farmer' ? '/farmer' : '/officer'} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer Routes */}
          <Route
            path="/farmer"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/submit"
            element={
              <ProtectedRoute allowedRole="farmer">
                <SubmitRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/requests"
            element={
              <ProtectedRoute allowedRole="farmer">
                <MyRequests />
              </ProtectedRoute>
            }
          />

          {/* Officer Routes */}
          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRole="officer">
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/requests"
            element={
              <ProtectedRoute allowedRole="officer">
                <AllRequests />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
