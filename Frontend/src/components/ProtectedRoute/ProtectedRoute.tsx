import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux/redux';

interface ProtectedRouteProps {
   children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
   const { isAuthenticated } = useAppSelector((state) => state.auth);
   
   if (!isAuthenticated) {
      console.log('❌ Not authenticated - redirecting to login');
      return <Navigate to="/" replace />;
   }
   
   return <>{children}</>;
}

export default ProtectedRoute;