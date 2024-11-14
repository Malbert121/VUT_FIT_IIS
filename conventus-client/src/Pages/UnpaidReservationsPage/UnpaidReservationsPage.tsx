import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import ReservationCard from '../../Components/ReservationCard/ReservationCard';
import { Reservation} from '../../data';
import { getUnpaidReservations, putResirvationsToPay, deleteReservations } from '../../api';
import { pathUnpaidReservations } from '../../Routes/Routes';
import { useUser } from '../../context/UserContext';
import Toast from '../../Components/Toast/Toast';
import "./UnpaidReservationsPage.css"

const UnpaidReservationsPage: React.FC = () => {
  const user = useUser();
  const [reservations, setReservation] = useState<Reservation[]>([]);
  const [reservationsFiltered, setReservationsFiltered] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedReservations, setSelectedReservations] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  
  // filtering
  const [conferenceNameFilter, setConferenceNameFiler] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [groupFilter, setGroupFilter] = useState<string>('');

  const groupList: string[] = ['Single', 'Group']

  const closeToast = () => setToastMessage(null);

  const fetchAllReservations = useCallback(async () =>{
    if(!user)
    {
      return;
    }
    try{
      const data = await getUnpaidReservations(Number(user.id));
      setReservation(data);
    }
    catch(error){
      setError('Failed to catch reservations.');
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  }, [user]);

  useEffect(()=>{
    fetchAllReservations();
  }, [fetchAllReservations]);


  useEffect(()=>{
    let filtered = [...reservations];
    if(conferenceNameFilter)
    {
      filtered = filtered.filter(reservation=>
        reservation.Conference?.Name.toLowerCase().includes(conferenceNameFilter.toLowerCase())
      );
    }

    if(dateFilter.from)
    {
      filtered = filtered.filter(reservation => new Date(reservation.Conference?.StartDate ?? "") >= new Date(dateFilter.from));
    }
    if(dateFilter.to)
    {
      filtered = filtered.filter(reservation => new Date(reservation.Conference?.EndDate ?? "") <= new Date(dateFilter.to));
    }
    
    if(groupFilter === 'Single')
    {
      filtered = filtered.filter(reservation => reservation.NumberOfTickets === 1);
    }
    else if(groupFilter === 'Group')
    {
      filtered = filtered.filter(reservation => reservation.NumberOfTickets > 1);
    }

    setReservationsFiltered(filtered);
  },[conferenceNameFilter, dateFilter, groupFilter, reservations]);

  const handleSelectReservation = (reservationId: number, amount: number) => {
    setSelectedReservations((prevSelected) => {
        const isSelected = prevSelected.includes(reservationId);
        if (isSelected) {
            setTotalAmount((prevAmount) => prevAmount - amount);
            return prevSelected.filter(id => id !== reservationId);
        } else {
            setTotalAmount((prevAmount) => prevAmount + amount);
            return [...prevSelected, reservationId];
        }
    });
  };

  const handleReservationsToPayment = async ()=>{
    if(selectedReservations.length === 0)
    {
      return;
    }
    try
    {
      await putResirvationsToPay(selectedReservations, Number(user?.id));
      setSelectedReservations([]);
      setTotalAmount(0);
      fetchAllReservations();
    }
    catch(error)
    {
      console.error(error);
      setToastType('error');
      setToastMessage((error as Error).message);
    }
  }

  const handleReservationsToDelete = async ()=>{
    if(selectedReservations.length === 0)
    {
      return;
    }
    try
    {
      if(user)
      {
        await deleteReservations(selectedReservations, Number(user.id));
        setSelectedReservations([]);
        setTotalAmount(0);
        fetchAllReservations();
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
  }

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
    {toastMessage && (
      <Toast message={toastMessage} onClose={closeToast} type={toastType} />
    )}
    <h1 className="flex text-5xl justify-center font-bold mb-10">Unpaid Reservations</h1>
    <div className='filters'>
      <input
        type="text"
        placeholder="Conference Name"
        value={conferenceNameFilter}
        onChange={(e)=>setConferenceNameFiler(e.target.value)}
      />

      <select onChange={(e) => setGroupFilter(e.target.value)}>
        <option value="">All Groups</option>
          {groupList.map((status) => (
            <option key={status}>{status}</option>
          ))}
      </select>

      <div className="flex space-x-4">
        <input
          type="date"
          value={dateFilter.from}
          onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
          placeholder="From date"
        />
        <input
          type="date"
          value={dateFilter.to}
          onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
          placeholder="To date"
        />
      </div>

    </div>
    <div className="flex flex-row items-center justify-between mb-4">
    <strong className="text-xl font-semibold mr-4">Total amount: {totalAmount} $</strong>
    <div className="flex flex-row space-x-2">
        <button 
        onClick={handleReservationsToPayment}
        className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
            Pay
        </button>
        <button 
          onClick={handleReservationsToDelete}
          className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
            Delete
        </button>
    </div>
</div>
    
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {reservationsFiltered.map((reservation) => (
      <ReservationCard 
        reservation={reservation}
        onSelect={() => handleSelectReservation(reservation.Id, reservation.Ammount)}
        isSelected={selectedReservations.includes(reservation.Id)}
        pathToDetails={`${pathUnpaidReservations}`}/>
    ))}
  </div>
</div>
  );
};
export default UnpaidReservationsPage;
