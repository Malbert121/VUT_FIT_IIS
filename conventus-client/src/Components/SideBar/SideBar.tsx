import React, { useState } from 'react';
import {Link, useLocation} from "react-router-dom";
import './SideBar.css'
import MenuButton from '../MenuButton/MenuButton';
import { pathConferences, pathMyConferences, pathMyReservations, pathLectures, pathMyLectures, pathGuestReservations} from '../../Routes/Routes';


type Props = {};

const SideBar:React.FC<Props> = () =>
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
      style={{ backgroundColor: isOpen ? '#2d2d2d' : '#fff' }}
    >
      <div className="flex-col min-h-full px-0 flex flex-wrap items-center justify-between w-full mx-auto overflow-hidden"> {}
        <div className=" top-10 flex flex-col items-stretch opacity-100 relative mt-4 h-auto z-40 items-center flex-1 rounded w-full">
          <MenuButton action={toggleSideBar} />
          <div className="relative top-10 md:flex-col md:min-w-full flex flex-col list-none">
            {isOpen && (
              <>
                {(location.pathname.startsWith(pathConferences)||
                location.pathname.startsWith(pathMyConferences)) && (
                  <>
                    <Link
                      to={pathConferences}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">All Conferences</h6>
                    </Link>
                    <Link
                      to={pathMyConferences}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">My Conferences</h6>
                    </Link>
                  </>
                )}
                {(location.pathname.startsWith(pathLectures)||
                location.pathname.startsWith(pathMyLectures)) && (
                  <>
                    <Link
                      to={pathLectures}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">All Lectures</h6>
                    </Link>
                    <Link
                      to={pathMyLectures}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">My Lectures</h6>
                    </Link>
                  </>
                )}
                {(location.pathname.startsWith(pathMyReservations) 
                  || location.pathname.startsWith(pathGuestReservations) ) 
                  && (
                  <>
                    <Link
                      to={pathMyReservations}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">My Reservations</h6>
                    </Link>

                    <Link
                      to={pathGuestReservations}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Guest Reservations</h6>
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

export default SideBar;
