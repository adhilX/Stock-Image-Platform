import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store/store';


const ProtectedRoute: React.FC<{  children: React.ReactNode }> = ({ children }) => {
    const token = useSelector((state: RootState) =>state.user.token);
  
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  
    return <>{children}</>;
  };

export default ProtectedRoute;