import React from 'react';
import { Link } from 'react-router-dom';
import logo from './conventus-favicon-color1.png';

import { pathConferences, pathAccount, pathLectures, pathAdmin, pathAvailableReservations } from '../../Routes/Routes';

interface Props {
  updateSideBar: ()=> void;
}

// TODO: add checking of Admin header display only for user with admins right
const Navbar: React.FC<Props> = ({updateSideBar}) => {
  return (
    <nav className="relative container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-20">
        <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
          <div className="hidden font-bold lg:flex space-x-6"> {/* Added space-x-6 for horizontal spacing */}
            <Link to={`../${pathConferences}`} className="text-black hover:text-darkBlue">
              Conferences
            </Link>
            <Link to={`../${pathAvailableReservations}`} className="text-black hover:text-darkBlue">
              Reservations
            </Link>
            <Link to={`../${pathLectures}`} className="text-black hover:text-darkBlue">
              Lectures
            </Link>
            <Link to={`../${[pathAdmin]}`} className="text-black hover:text-darkBlue">
              Admin
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-6 text-back">
          <Link to={`../${[pathAccount]}/1`}> {/* Wrapped the Account button in a Link */}
            <a
              className="px-8 py-3 font-bold rounded text-white bg-lightGreen hover:opacity-70"
            >
              Account
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
/*<Link to="/Conventus">
            <img src={logo} alt="Logo" />
          </Link>*/