import React from 'react';
import './MainPage.css';
import logo from './conventus-favicon-color1.png';
import { Link } from 'react-router-dom';
const MainPage: React.FC = () => {
    return (
        <div className="main-page flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <img 
                src={logo}
                alt="Conventus Logo" 
                className="logo mb-6 transition-transform duration-300 hover:scale-105" 
            />
            <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800">
                Welcome to Conventus!
            </h1>
            <p className="text-lg text-center max-w-xl mb-6 text-gray-600">
                Conventus is your one-stop platform for managing conferences, lectures, and networking opportunities. 
                Dive into our features, create engaging events, and connect with like-minded individuals!
            </p>
            <Link to="/conferences" className="cta-button px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                Get Started
            </Link>
        </div>
    );
};

export default MainPage;
