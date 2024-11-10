// context/UserContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";

interface User {
    username: string;
    email: string;
    userId: string;
}

interface UserContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUserContext must be used within a UserProvider");
    return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode<User>(token);
            console.log(decodedUser)
            setUser(decodedUser);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
