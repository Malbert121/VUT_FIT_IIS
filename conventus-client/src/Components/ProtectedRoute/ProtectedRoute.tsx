// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Используем хук для получения данных пользователя

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = useUser(); // Получаем данные пользователя из контекста

    // Если пользователь существует, отображаем дочерний компонент, если нет — перенаправляем на страницу входа
    if (!user) {
        console.log(user)
        return <Navigate to="/login" />;
    }

    return children; // If user is authenticated, show the children (protected route content)
};

export default ProtectedRoute;
