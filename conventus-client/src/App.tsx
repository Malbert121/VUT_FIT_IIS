import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Conferences from './Conferences';
import Header from './Header'; // Импортируйте компонент Header

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации

    const handleLogout = () => {
        setIsAuthenticated(false);
        // Логика выхода из аккаунта (например, удаление токена)
    };

    return (
        <div className="App">
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <h1>Conventus</h1>
            <Conferences /> {/* Вставляем компонент со списком конференций */}
        </div>
    );
}

export default App;
