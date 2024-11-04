import React from "react";
import { Link } from "react-router-dom";
import { Reservation } from "../../data";

interface Props {
    reservation: Reservation,
    onSelect: ()=>void,
    isSelected: boolean,
    pathToDetails: string
};

const ReservationCard: React.FC<Props> = ({reservation, onSelect, isSelected, pathToDetails}) =>{
    const [statusText, statusColor] = !reservation.IsPaid 
    ? ['Unpaid', 'red'] 
    : reservation.IsConfirmed 
        ? ['Confirmed', 'green'] 
        : ['Unconfirmed', 'yellow'];
    const [action, color] = isSelected ? ['-', 'gray-100'] : ['+', 'white'];
    
    return (
        
    <div className={`border rounded-lg shadow-lg p-4 w-full max-w-md bg-${color}`}>
        <div className="flex flex-row items-center justify-between">
            <Link to={`../${pathToDetails}/${reservation.Id}`} className="text-black hover:text-blue-600">
                <h2 className="flex text-2xl font-semibold">{`${reservation.Conference.Name}`}</h2>
            </Link>
            <button
                onClick={onSelect}
                className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-blue-600 transition-colors duration-150">
                {action}
            </button>
        </div>
        <strong className={`flex text-lg mt-3 mb-3`} style={{ color: statusColor }}>{statusText}</strong>
        <p className="text-md mt-2">Amount: {reservation.Ammount} $</p>
        <p className="text-md mt-2 mb-3">Tickets: {reservation.NumberOfTickets}</p>
    </div>
    );
};

export default ReservationCard;

