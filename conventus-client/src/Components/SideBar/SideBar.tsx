import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import './SideBar.css'
import MenuButton from '../MenuButton/MenuButton';
type Props = {};
const SideBar2:React.FC<Props> = () =>
{
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggleSideBar = () => {
        setIsOpen(!isOpen);
    };
    const location = useLocation();
    return (
        <nav
      className={`block py-4 px-6 top-0 bottom-0 left-0 relative flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform ${
        isOpen ? 'w-64' : 'w-40'
      } md:translate-x-0 -translate-x-full`}
      style={{ backgroundColor: isOpen ? '#2d2d2d' : '#fff' }} // Инлайн стиль для плавного изменения цвета
    >
      <div className="flex-col min-h-full px-0 flex flex-wrap items-center justify-between w-full mx-auto overflow-hidden"> {/* Убрано overflow-y-auto */}
        <div className=" top-10 flex flex-col items-stretch opacity-100 relative mt-4 h-auto z-40 items-center flex-1 rounded w-full">
          <MenuButton action={toggleSideBar} />
          <div className="relative top-10 md:flex-col md:min-w-full flex flex-col list-none">
            {isOpen && (
              <>
                {location.pathname.startsWith('/conferences') && (
                  <>
                    <Link
                      to="/Conventus/conferences"
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">All Conferences</h6>
                    </Link>
                    <Link
                      to="/Conventus/conferences"
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">My Conferences</h6>
                    </Link>
                  </>
                )}
                {location.pathname.startsWith('/lectures') && (
                  <>
                    <Link
                      to="/Conventus/lectures"
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">All Lectures</h6>
                    </Link>
                    <Link
                      to="/Conventus/lectures"
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">My Lectures</h6>
                    </Link>
                  </>
                )}
                {location.pathname.startsWith('/tickets') && (
                  <>
                    <Link
                      to="/Conventus/tickets"
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Unpaid Tickets</h6>
                    </Link>
                    <Link
                      to="/Conventus/tickets"
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Actual Tickets</h6>
                    </Link>
                    <Link
                      to="/Conventus/tickets"
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Guest Tickets</h6>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SideBar2;
