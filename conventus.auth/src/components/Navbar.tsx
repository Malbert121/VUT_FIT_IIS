// src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">Conventus</div>
            <div className="navbar-links">
                {token ? (
                    <button onClick={handleLogout}>Log out</button>
                ) : (
                    <>
                        <Link to="/login">Log in</Link>
                        <Link to="/register">Sign in</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
