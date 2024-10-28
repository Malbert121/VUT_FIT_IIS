import React, { useState } from 'react';
import {Link} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { pathConferences, pathLectures, pathTickets } from '../../Routes/Routes';

type Props = {};

const SideBar: React.FC<Props> = () =>
{
    const location = useLocation();
    return (
        <nav className="block py-4 px-6 top-0 bottom-0 w-64 bg-gray-100 shadow-xl left-0 absolute flex-row flex-nowrap md:z-10 z-9999 transition-all duration-300 ease-in-out transform md:translate-x-0 -translate-x-full">
        <div className="flex-col min-h-full px-0 flex flex-wrap items-center justify-between w-full mx-auto overflow-y-auto overflow-x-hidden">
          <div className="flex bg-gray-100 flex-col items-stretch opacity-100 relative mt-4 overflow-y-auto overflow-x-hidden h-auto z-40 items-center flex-1 rounded w-full">
            <div className="md:flex-col md:min-w-full flex flex-col list-none">
            {location.pathname.startsWith(pathConferences) && (
                        <>
                            <Link to='/Conventus/conferences' className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                                <h6 className="ml-3">All Conferences</h6>
                            </Link>
                            <Link to='/Conventus/conferences' className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                                <h6 className="ml-3">My Conferences</h6>
                            </Link>
                        </>
                    )}
            {location.pathname.startsWith(pathLectures) && (
                <>
                    <Link to='/Conventus/conferences' className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                        <h6 className="ml-3">All Lectures</h6>
                    </Link>
                    <Link to='/Conventus/conferences' className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                        <h6 className="ml-3">My Lectures</h6>
                    </Link>
                </>
            )}
            {location.pathname.startsWith(pathTickets) && (
                <>
                    <Link to='/Conventus/conferences' className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                        <h6 className="ml-3">Unpaid Tickets</h6>
                    </Link>
                    <Link to='/Conventus/conferences' className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                        <h6 className="ml-3">Actual Tickets</h6>
                    </Link>
                    <Link to='/Conventus/conferences' className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                        <h6 className="ml-3">Guest Tickets</h6>
                    </Link>
                </>
            )}
            </div>
          </div>
        </div>
      </nav>
    );
};

export default SideBar;
