import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux/redux';

interface NoAuthorizedRouteProps {
   children: React.ReactNode;
}

function NoAuthorizedRoute({ children }: NoAuthorizedRouteProps) {
   const { isAuthenticated } = useAppSelector((state) => state.auth);
   
   if (isAuthenticated) {
      return <Navigate to="/app" replace />;
   }
   
   return <>{children}</>;
}

export default NoAuthorizedRoute;