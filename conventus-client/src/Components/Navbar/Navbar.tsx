import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './conventus-favicon-color1.png';
import { useUser } from '../../context/UserContext';
import {
  pathConferences,
  pathAccount,
  pathLectures,
  pathAdmin,
  pathAvailableReservations,
} from '../../Routes/Routes';

interface Props {
  updateSideBar: () => void;
}

const Navbar: React.FC<Props> = ({ updateSideBar }) => {
  const user = useUser(); // Get user data from context
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="relative container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-20">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
          {/* Desktop Menu */}
          <div className="hidden lg:flex font-bold space-x-6">
            <Link to={`../${pathConferences}`} className="text-black hover:text-darkBlue">
              Conferences
            </Link>
            <Link to={`../${pathAvailableReservations}`} className="text-black hover:text-darkBlue">
              Reservations
            </Link>
            <Link to={`../${pathLectures}`} className="text-black hover:text-darkBlue">
              Lectures
            </Link>
            {user && user.role === 'Admin' && (
              <Link to={`../${pathAdmin}`} className="text-black hover:text-darkBlue">
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Account/Authentication Section */}
        <div className="hidden lg:flex items-center space-x-6 text-back">
          {user ? (
            <Link to={`../${pathAccount}`} className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70">
              Account
            </Link>
          ) : (
            <>
              <Link to="../login" className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70">
                Login
              </Link>
              <Link to="../registration" className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="block lg:hidden text-black focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <div className="flex flex-col p-4 space-y-2">
            <Link to={`../${pathConferences}`} className="text-black hover:text-darkBlue">
              Conferences
            </Link>
            <Link to={`../${pathAvailableReservations}`} className="text-black hover:text-darkBlue">
              Reservations
            </Link>
            <Link to={`../${pathLectures}`} className="text-black hover:text-darkBlue">
              Lectures
            </Link>
            {user && user.role === 'Admin' && (
              <Link to={`../${pathAdmin}`} className="text-black hover:text-darkBlue">
                Admin
              </Link>
            )}
            {user ? (
              <Link to={`../${pathAccount}`} className="text-black hover:text-darkBlue">
                Account
              </Link>
            ) : (
              <>
                <Link to="../login" className="text-black hover:text-darkBlue">
                  Login
                </Link>
                <Link to="../registration" className="text-black hover:text-darkBlue">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
