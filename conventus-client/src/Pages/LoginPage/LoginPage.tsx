import React, { useState } from 'react';
import axios from 'axios';
import { AuthResponse } from '../../data';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>(''); // Renamed from email to username
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post<AuthResponse>('https://localhost:7156/api/Auth/login', {
                username,  // Changed from email to username
                password,
            });
            localStorage.setItem('token', response.data.token);
            alert("Logged in successfully!");
        } catch (err) {
            setError("Login failed");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                value={username}  // Updated value to use username
                onChange={(e) => setUsername(e.target.value)}  // Updated to setUsername
                placeholder="Username"  // Changed placeholder text
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default LoginPage;
