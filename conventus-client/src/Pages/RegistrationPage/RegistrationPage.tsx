import React, { useState } from 'react';
import axios from 'axios';
import { RegisterData, AuthResponse } from '../../data';

const RegistrationPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error state

        const registerData: RegisterData = { username, email, password };

        try {
            const response = await axios.post<AuthResponse>('https://localhost:7156/api/Auth/register', registerData);
            localStorage.setItem('token', response.data.token);
            alert("Registration successful!");
        } catch (err) {
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default RegistrationPage;
