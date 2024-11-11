import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useUser();

    if (user) {
        console.log(user)
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
