import React from 'react';
import { Outlet } from 'react-router-dom';
const App: React.FC = () => {
  return (
    <div>
      {}
      <Outlet />
      <footer>
                <p>© 2024 Conventus. All rights reserved. FUCK ME DADDY @MALASHCHUK VLADYSLAV</p>
            </footer>
    </div>
  );
};

export default App;
