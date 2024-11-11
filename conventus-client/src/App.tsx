import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
const App: React.FC = () => {
  return (
    <UserProvider>
        <div>
            <Outlet /> {/* Render the child route components here */}
            <footer>© 2024 Conventus. All rights reserved.</footer>
        </div>
    </UserProvider>
);
};

export default App;
