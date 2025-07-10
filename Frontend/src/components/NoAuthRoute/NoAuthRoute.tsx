import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux/redux';

interface NoAuthRouteProps {
   children: React.ReactNode;
}

function NoAuthRoute({ children }: NoAuthRouteProps) {
   const { isAuthenticated } = useAppSelector((state) => state.auth);
   
   if (isAuthenticated) {
      return <Navigate to="/app" replace />;
   }
   
   return <>{children}</>;
}

export default NoAuthRoute;