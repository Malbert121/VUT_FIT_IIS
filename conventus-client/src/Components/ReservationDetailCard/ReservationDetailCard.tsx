import React from 'react';
import { Link} from 'react-router-dom';
import { Reservation } from '../../data';
import { pathConferences } from '../../Routes/Routes';
import { useUser } from '../../context/UserContext';

interface Props{
    reservation: Reservation,
    toPaid: ()=>void,
    toConfirm: (flag: boolean)=>void,
    toDelete: ()=>void,
};

const ReservationDetailCard: React.FC<Props> = ({reservation, toPaid, toConfirm, toDelete}) => 
{
    const [statusText, statusColor] = !reservation.IsPaid 
    ? ['Unpaid', 'red'] 
    : reservation.IsConfirmed 
        ? ['Confirmed', 'green'] 
        : ['Unconfirmed', 'yellow'];
    const user = useUser();

    return (
        <>
        {(user?.role === 'Admin' || Number(user?.id) === reservation.Conference?.OrganizerId  || Number(user?.id) === reservation.UserId) &&(
        <div className='flex flex-col max-w-[800px] mx-auto p-5 border border-gray-300 rounded-lg shadow-md bg-white-100'>
            <h1 className='text-center text-2xl font-semibold'>Reservation #{reservation.Id}</h1>
            <Link to={`../${pathConferences}/${reservation.Conference?.Id}`} className="text-black hover:text-blue-600">
                <h2 className="flex text-2xl mb-2.5 mt-5">{`${reservation.Conference?.Name}`}</h2>
            </Link>
            <div className='text-left'>
                <p className='mb-5 mt-5'><strong>Status: </strong><strong style={{ color: statusColor }}>{statusText}</strong></p>
                <p className='mt-2'><strong>Location: </strong> {reservation.Conference?.Location}</p>
                <p className='mt-2'><strong>Start Date :</strong> {reservation.Conference?.StartDate}</p>
                <p className='mt-2'><strong>End Date: </strong> {reservation.Conference?.EndDate}</p>
                <p className='mb-5 mt-5'><strong>Ammount: </strong>{reservation.Ammount} $</p>
                <p className='mb-5 mt-5'><strong>Tickets: </strong>{reservation.NumberOfTickets}</p>
            </div> 
            <div className="flex flex-row space-x-2">
                { user?.role === 'Admin' ? (
                    reservation.IsPaid ?(
                        <>
                            <button          
                            onClick={()=>{toConfirm(true)}}
                            className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                                Confirm
                            </button>
                            <button          
                            onClick={()=>{toConfirm(false)}}
                            className="bg-yellow-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                                Unconfirm
                            </button>
                            <button           
                            onClick={toDelete}
                            className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                                Delete
                            </button>
                        </>
                    ):
                    (
                        <>
                        <button           
                        onClick={toPaid}
                        className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                            Paid
                        </button>
                        <button           
                        onClick={toDelete}
                        className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Delete
                        </button>
                        </>
                    )

                ): Number(user?.id) === reservation.Conference?.OrganizerId ? (
                    <>
                        <button          
                        onClick={()=>{toConfirm(true)}}
                        className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                            Confirm
                        </button>
                        <button          
                        onClick={() => { toConfirm(false); }}
                        className="bg-yellow-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Unconfirm
                        </button>
                        <button           
                        onClick={toDelete}
                        className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Delete
                        </button>
                    </>
                ) : !reservation.IsPaid ? (
                    <>
                        <button           
                        onClick={toPaid}
                        className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                            Paid
                        </button>
                        <button           
                        onClick={toDelete}
                        className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Delete
                        </button>
                    </>
                ) : (
                    <button           
                    onClick={toDelete}
                    className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                        Delete
                    </button>
                )}

            </div>
        </div>
        )}
        </>
    );
}
export default ReservationDetailCard;