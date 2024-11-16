import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для роутинга

const Header: React.FC = () => {
  return (
    <header>
      <h1>Welcome to My Website</h1>
      <nav>
        <ul>
          <li><Link to="/conferences">Conferences</Link></li> {/* Используем Link вместо <a> */}
          <li><Link to="/lectures">Lectures</Link></li> {/* Вы можете добавить компонент Lectures позже */}
          <li><Link to="/adminpanel">AdminPanel</Link></li> {/* Добавьте AdminPanel позже */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
