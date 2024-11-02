import React from 'react';
import { useEffect, useState } from 'react';
import ReservationCard from '../../Components/ReservationCard/ReservationCard';
import { Reservation } from '../../data';
import { getAllReservations } from '../../api';

const OwnerReservationsPage: React.FC = () => {
  const [reservations, setReservation] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReservations, setSelectedReservations] = useState<number[]>([]);

  useEffect(()=>{
    const fetchAllReservations = async () =>{
      try{
        const data = await getAllReservations();
        console.log("Resrevations data: ", data);
        setReservation(data);
      }
      catch(error){
        setError('Failed to catch reservations.');
        console.error(error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchAllReservations();
  }, []);

  const handleSelectReservation = (reservationId: number, amount: number) => {
    setSelectedReservations((prevSelected) => {
        const isSelected = prevSelected.includes(reservationId);
        if (isSelected) {
            return prevSelected.filter(id => id !== reservationId);
        } else {
            return [...prevSelected, reservationId];
        }
    });
};

  if(loading)
  {
    return <div className="loading">Loading reservations...</div>;  
  }

  if(error)
  {
    return <div className="error"></div>
  }

  return (
    <div className="container mx-auto p-6">
    <h1 className="flex text-2xl justify-center font-bold mb-10">Available Reservations</h1>
    
    <div className="flex flex-row items-center justify-between mb-4">
      <div className="flex flex-row space-x-2">
        <button className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
            Confirm
        </button>
        <button className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
            Unconfirm
        </button>
      </div>
  </div>
    
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {reservations.map((reservation) => (
      <ReservationCard 
        reservation={reservation}
        onSelect={() => handleSelectReservation(reservation.Id, reservation.Ammount)}
        isSelected={selectedReservations.includes(reservation.Id)}/>
    ))}
  </div>
</div>
  );
};
export default OwnerReservationsPage;
