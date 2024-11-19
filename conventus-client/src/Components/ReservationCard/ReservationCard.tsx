import React from "react";
import { Link } from "react-router-dom";
import { Reservation } from "../../data";
import { pathMyReservations } from "../../Routes/Routes";
interface Props {
    reservation: Reservation,
    onSelect: ()=>void,
    isSelected: boolean
};

const ReservationCard: React.FC<Props> = ({reservation, onSelect, isSelected}) =>{
    const [statusText, statusColor] = !reservation.IsPaid 
    ? ['Unpaid', 'red'] 
    : reservation.IsConfirmed 
        ? ['Confirmed', 'green'] 
        : ['Unconfirmed', 'yellow'];
    const [action, color] = isSelected ? ['-', 'gray-100'] : ['+', 'white'];
    
    return (
        
    <div className={`border rounded-lg shadow-lg p-4 w-full max-w-md bg-${color}`}>
        <div className="flex flex-row items-center justify-between">
            <Link to={`../${pathMyReservations}/${reservation.Id}`} className="text-black hover:text-blue-600">
                <h2 className="flex text-2xl font-semibold">{`${reservation.Conference?.Name}`}</h2>
            </Link>
            <button
                onClick={onSelect}
                className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded hover:bg-blue-600 transition-colors duration-150">
                {action}
            </button>
        </div>
        <strong className={`flex text-lg mt-3 mb-3`} style={{ color: statusColor }}>{statusText}</strong>
        <p className='mt-2'><strong>Location: </strong> {reservation.Conference?.Location}</p>
        <p className='mt-2'><strong>Start Date :</strong> {reservation.Conference?.StartDate}</p>
        <p className='mt-2'><strong>End Date: </strong> {reservation.Conference?.EndDate}</p>
        <p className='mb-5 mt-5'><strong>Ammount: </strong>{reservation.Ammount} $</p>
        <p className='mb-5 mt-5'><strong>Tickets: </strong>{reservation.NumberOfTickets}</p>
    </div>
    );
};

export default ReservationCard;

