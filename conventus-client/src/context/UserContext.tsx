import React, { createContext, useState, useEffect, useContext,ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    emailts: number;
}

const UserContext = createContext<User | null>(null);


export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

                if (decodedToken.exp < currentTime) {
                    // Token expired
                    handleLogout();
                } else {
                    const userFromToken = {
                        id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                        username: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                        email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                        role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                        emailts: decodedToken.exp, 
                    };

                    setUser(userFromToken);

                    // Set a timeout to logout when the token expires
                    const timeout = (decodedToken.exp - currentTime) * 1000;
                    setTimeout(() => {
                        handleLogout();
                    }, timeout);
                }
            } catch (error) {
                console.error("Decoding Error", error);
                handleLogout();
            }
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = () => {
    return useContext(UserContext);
};
