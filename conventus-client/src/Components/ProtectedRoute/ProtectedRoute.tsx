// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useUserContext();
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
