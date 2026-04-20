import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to login if not authenticated
// Redirects to correct dashboard if wrong role tries to access a page
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to the correct dashboard based on role
    return <Navigate to={user.role === 'farmer' ? '/farmer' : '/officer'} replace />;
  }

  return children;
};

export default ProtectedRoute;
