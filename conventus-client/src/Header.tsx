import React from 'react';
import './Header.css'; // Import CSS for styles

const Header: React.FC<{ isAuthenticated: boolean; onLogout: () => void }> = ({ isAuthenticated, onLogout }) => {
    return (
        <header className="header">
            <div className="logo">
                <img src="/path/to/logo.png" alt="Logo" className="logo-img" /> {/* Replace with the path to the logo */}
            </div>
            <nav className="nav">
                <a href="/" className="nav-link">Home</a>
                {isAuthenticated ? (
                    <button className="nav-button" onClick={onLogout}>Logout</button>
                ) : (
                    <a href="/login" className="nav-link">Login</a>
                )}
            </nav>
        </header>
    );
};

export default Header;
