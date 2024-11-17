import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reservation } from '../../data';
import { pathConferences, pathMyReservations } from '../../Routes/Routes';
import { putResirvationsToConfirm, putResirvationsToPay, deleteReservations } from '../../api';
import { useUser } from '../../context/UserContext';
import Toast from '../../Components/Toast/Toast';


interface Props{
    reservation: Reservation
}

const ReservationDetailCard: React.FC<Props> = ({reservation}) => 
{
    const [statusText, statusColor] = !reservation.IsPaid 
    ? ['Unpaid', 'red'] 
    : reservation.IsConfirmed 
        ? ['Confirmed', 'green'] 
        : ['Unconfirmed', 'yellow'];
    const navigate = useNavigate();
    const user = useUser();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
    const closeToast = () => setToastMessage(null);

    const handleReservationsToPayment = async ()=>{
        try
        {
          await putResirvationsToPay([reservation.Id], Number(user?.id));
          navigate(0);
        }
        catch(error)
        {
          console.error(error);
          setToastType('error');
          setToastMessage((error as Error).message);
        }
    };
    const handleReservationsToConfirm = async (flag:boolean)=>{
        try
        {
          await putResirvationsToConfirm([reservation.Id], flag);
          navigate(0);
        }
        catch(error)
        {
          console.error(error);
          setToastType('error');
          setToastMessage((error as Error).message);
        }
    };
    
      const handleReservationsToDelete = async ()=>{
        try
        {
          if(user)
          {
            await deleteReservations([reservation.Id], Number(user.id));
            navigate(`../${pathMyReservations}`);
          }
          else
          {
            console.log('Unauthorized user is bad boy!'); //TODO: solve unauthorized user behavioral  
            setToastType('error');
            setToastMessage('Unauthorized user is bad boy!');
          }
        }
        catch(error)
        {
          console.error(error);
          setToastType('error');
          setToastMessage((error as Error).message);
        }
    };
    

    return (
        <>
        {toastMessage && (
        <Toast message={toastMessage} onClose={closeToast} type={toastType} />
        )}
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
                            onClick={() => { handleReservationsToConfirm(true); }}
                            className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                                Confirm
                            </button>
                            <button          
                            onClick={() => { handleReservationsToConfirm(false); }}
                            className="bg-yellow-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                                Unconfirm
                            </button>
                            <button           
                            onClick={() => { handleReservationsToDelete(); }}
                            className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                                Delete
                            </button>
                        </>
                    ):
                    (
                        <>
                        <button           
                        onClick={() => { handleReservationsToPayment(); }}
                        className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                            Paid
                        </button>
                        <button           
                        onClick={() => { handleReservationsToDelete(); }}
                        className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Delete
                        </button>
                        </>
                    )

                ): Number(user?.id) === reservation.Conference?.OrganizerId ? (
                    <>
                        <button          
                        onClick={() => { handleReservationsToConfirm(true); }}
                        className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                            Confirm
                        </button>
                        <button          
                        onClick={() => { handleReservationsToConfirm(false); }}
                        className="bg-yellow-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Unconfirm
                        </button>
                        <button           
                        onClick={() => { handleReservationsToDelete(); }}
                        className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Delete
                        </button>
                    </>
                ) : !reservation.IsPaid ? (
                    <>
                        <button           
                        onClick={() => { handleReservationsToPayment(); }}
                        className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
                            Paid
                        </button>
                        <button           
                        onClick={() => { handleReservationsToDelete(); }}
                        className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
                            Delete
                        </button>
                    </>
                ) : (
                    <button           
                    onClick={() => { handleReservationsToDelete(); }}
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