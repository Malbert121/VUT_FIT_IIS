// src/components/Home.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="home-container">
            <h1>Welcome to Conventus</h1>
            <p>You logged in</p>
            <button className="logout-button" onClick={handleLogout}>
                Log out
            </button>
        </div>
    );
};

export default Home;
