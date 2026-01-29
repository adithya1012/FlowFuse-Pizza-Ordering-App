/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login page if user is not authenticated.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check if user is logged in by checking localStorage
  const userStr = localStorage.getItem('user');
  
  // If no user data found, redirect to login
  if (!userStr) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
