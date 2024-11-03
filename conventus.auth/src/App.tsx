// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const App: React.FC = () => {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route
                    path="/login"
                    element={token ? <Navigate to="/home" replace /> : <Login />}
                />
                <Route
                    path="/register"
                    element={token ? <Navigate to="/home" replace /> : <Register />}
                />
                <Route
                    path="/home"
                    element={<ProtectedRoute element={<Home />} />}
                />
                <Route
                    path="/"
                    element={
                        token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="*"
                    element={
                        token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
