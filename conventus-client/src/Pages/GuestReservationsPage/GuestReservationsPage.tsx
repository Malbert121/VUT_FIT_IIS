import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import ReservationCard from '../../Components/ReservationCard/ReservationCard';
import { Reservation} from '../../data';
import { getGuestReservations, putResirvationsToConfirm, deleteReservations } from '../../api';
import SwitchButton from '../../Components/SwitchButton/SwitchButton';
import { useUser } from '../../context/UserContext';
import Toast from '../../Components/Toast/Toast';
import './GuestReservationsPage.css'

const GuestReservationsPage: React.FC = () => {
  const user = useUser();
  const [reservations, setReservation] = useState<Reservation[]>([]);
  const [reservationsFiltered, setReservationsFiltered] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [selectedPaidReservations, setSelectedPaidReservations] = useState<number[]>([]);
  const [selectedUnPaidReservations, setSelectedUnPaidReservations] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  
  // filtering
  const [conferenceNameFilter, setConferenceNameFiler] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [groupFilter, setGroupFilter] = useState<string>('');
  
  const reservationStatusList: string[] = ['Confirmed', 'Unconfirmed', 'Unpaid']
  const groupList: string[] = ['Single', 'Group']
  
  const closeToast = () => setToastMessage(null);

  // swicth
  const [isOn, setIsOn] = useState(false);  // isOne = paid
  const handleSwitch = () => {
    setIsOn((prev) => !prev);
  };
  
  
  const fetchAllReservations = useCallback(async () =>{
    try{
      if(!user)
      {
        return;
      }
      setIsAuthorized(true);
      const data = await getGuestReservations(Number(user.id), isOn);
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
  }, [user, isOn]);

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
    
    if(statusFilter==='Confirmed')
    {
      filtered=filtered.filter(reservation=>reservation.IsConfirmed);
    }
    else if(statusFilter==='Unconfirmed')
    {
      filtered=filtered.filter(reservation=>!reservation.IsConfirmed);
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

  },[conferenceNameFilter, statusFilter, dateFilter, groupFilter, reservations]);

  const handleSelectPaidReservation = (reservationId: number) => {
    setSelectedPaidReservations((prevSelected) => {
        const isSelected = prevSelected.includes(reservationId);    
        if (isSelected) {
            return prevSelected.filter(id => id !== reservationId);
        } else {
            return [...prevSelected, reservationId];
        }
    });
  };

  const handleSelectUnPaidReservation = (reservationId: number) => {
    setSelectedUnPaidReservations((prevSelected) => {
      const isSelected = prevSelected.includes(reservationId);    
      if (isSelected) {
          return prevSelected.filter(id => id !== reservationId);
      } else {
          return [...prevSelected, reservationId];
      }
    });
  };

  const handlePaidReservationsToConfirm = async (flag:boolean)=>{
    if(selectedPaidReservations.length === 0)
    {
      return;
    }
    try
    {
      if(user)
      {
      await putResirvationsToConfirm(selectedPaidReservations, Number(user.id), flag);
      setSelectedPaidReservations([]);
      setToastType("success");
      setToastMessage("User have successfully confirmed reservations.");
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

  const handlePaidReservationsToDelete = async ()=>{
    if(selectedPaidReservations.length === 0)
    {
      return;
    }
    try
    {
      if(user)
      {
        await deleteReservations(selectedPaidReservations, Number(user.id));
        setSelectedPaidReservations([]);
        setToastType("success");
        setToastMessage("User have successfully deleted reservations.");
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

  const handleUnPaidReservationsToDelete = async ()=>{
    if(selectedUnPaidReservations.length === 0)
    {
      return;
    }
    try
    {
      if(user)
      {
        await deleteReservations(selectedUnPaidReservations, Number(user.id));
        setSelectedUnPaidReservations([]);
        setToastType("success");
        setToastMessage("User have successfully deleted reservations.");
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

  if(!isAuthorized){
    return <div className="error">User should be authorized for interaction with reservations.</div>;
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
    
    <h1 className="flex text-5xl justify-center font-bold mb-10">Guest Reservations</h1>
    
    <div className='filters'>
      <input
        type="text"
        placeholder="Conference Name"
        value={conferenceNameFilter}
        onChange={(e)=>setConferenceNameFiler(e.target.value)}
      />

      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Statuses</option>
          {reservationStatusList.map((status) => (
            <option key={status}>{status}</option>
          ))}
      </select>

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

    <SwitchButton OnText='Paid' OffText='UnPaid' isOn={isOn} onSwitch={handleSwitch}/>
    
    { 
    isOn && (
    <div className="flex flex-row items-center justify-between mb-4">
      <div className="flex flex-row space-x-2">
        <button 
          onClick={() => { handlePaidReservationsToConfirm(true); }}
          className="bg-green-500 text-white w-32 py-2 px-4 rounded hover:bg-green-600 transition-colors duration-150">
          Confirm
        </button>
        <button
          onClick={() => { handlePaidReservationsToConfirm(false); }}
          className="bg-yellow-500 text-white w-32 py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-150">
          Unconfirm
        </button>
      </div>
      <button
        onClick={handlePaidReservationsToDelete}
        className="bg-red-500 text-white w-32 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
        Delete
      </button>
    </div>
    )
    }

    { 
    !isOn && (
      <div className="flex flex-row items-center justify-between mb-4">
      <div className="flex flex-row space-x-2">
          <button 
          onClick={handleUnPaidReservationsToDelete}
          className="bg-red-500 text-white w-32 flex-1 py-2 px-4 rounded hover:bg-red-600 transition-colors duration-150">
          Delete
          </button>
      </div>
      </div>
    )
    }
    
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {reservationsFiltered.map((reservation) => (
      <ReservationCard 
        reservation={reservation}
        onSelect={
          () => {
            isOn 
            ? handleSelectPaidReservation(reservation.Id) 
            : handleSelectUnPaidReservation(reservation.Id)
          }}
        isSelected={
          isOn 
          ? selectedPaidReservations.includes(reservation.Id)
          : selectedUnPaidReservations.includes(reservation.Id)
        }/>
    ))}
  </div>
</div>
  );
};
export default GuestReservationsPage;
