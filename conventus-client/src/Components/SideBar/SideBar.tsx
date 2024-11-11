import React, { useState } from 'react';
import {Link, useLocation} from "react-router-dom";
import './SideBar.css'
import MenuButton from '../MenuButton/MenuButton';
import { pathConferences, pathLectures, pathGuestReservations, pathUnpaidReservations, pathAvailableReservations } from '../../Routes/Routes';


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
                {location.pathname.startsWith(pathConferences) && (
                  <>
                    <Link
                      to={pathConferences}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">All Conferences</h6>
                    </Link>
                    <Link
                      to={pathConferences}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">My Conferences</h6>
                    </Link>
                  </>
                )}
                {location.pathname.startsWith(pathLectures) && (
                  <>
                    <Link
                      to={pathLectures}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">All Lectures</h6>
                    </Link>
                    <Link
                      to={pathLectures}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">My Lectures</h6>
                    </Link>
                  </>
                )}
                {(location.pathname.startsWith(pathAvailableReservations) 
                  ||location.pathname.startsWith(pathUnpaidReservations) 
                  || location.pathname.startsWith(pathGuestReservations) ) 
                  && (
                  <>
                    <Link
                      to={pathAvailableReservations}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Available Reservations</h6>
                    </Link>
                    
                    <Link
                      to={pathUnpaidReservations}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Unpaid Reservations</h6>
                    </Link>

                    <Link
                      to={pathGuestReservations}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Guest Reservations</h6>
                    </Link>
                  </>
                )}
                {location.pathname.startsWith(pathAdmin) && (
                  <>
                    <Link
                      to={`${pathAdmin}/Conferences`}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Conferences</h6>
                    </Link>
                    <Link
                      to={`${pathAdmin}/Tickets`}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Tickets</h6>
                    </Link>
                    <Link
                      to={`${pathAdmin}/Presentations`}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Lectures</h6>
                    </Link>
                    <Link
                      to={`${pathAdmin}/Users`}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Users</h6>
                   </Link>
                     <Link
                      to={`${pathAdmin}/Rooms`}
                      className="text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline"
                    >
                      <h6 className="ml-3">Rooms</h6>
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
