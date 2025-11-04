import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const userType = localStorage.getItem('user_type');
  const accessToken = localStorage.getItem('access_token');
  
  // Check if user is logged in and is an admin
  if (!accessToken) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (userType !== 'admin') {
    // Logged in but not an admin, redirect to regular profile
    return <Navigate to="/profile" replace />;
  }
  
  // User is an admin, allow access
  return <>{children}</>;
};

export default AdminRoute;



