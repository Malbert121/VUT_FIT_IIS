import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useParams, useNavigate } from 'react-router-dom';
import { getConference, postReservations } from '../../api';
import { useUser } from '../../context/UserContext';
import { Conference, Reservation } from '../../data';
import { pathCreateLecture } from '../../Routes/Routes';
import Toast from '../../Components/Toast/Toast';
import AuthorizationWindow from '../../Components/AuthorizationWindow/AuthorizationWindow';
import './ConferenceDetailPage.css';

const ConferenceDetailPage = () => {
  const user = useUser();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState<{ [key: number]: number }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const closeToast = () => setToastMessage(null);
  const [visibleAuth, setVisibleAuth] = useState<boolean>(false);


  const fetchConference = useCallback(async () => {
    console.log("Fetching conference with ID:", id);
    try {
      const data = await getConference(Number(id));
      console.log("Fetched conference data:", data);
      setConference(data);
    } catch (error) {
      setError('Failed to fetch conference details.');
      console.error("Error fetching conference details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConference();
  }, [id]);

  const handleQuantityChange = (id: number, quantity: number) => {
    setTicketQuantity({ ...ticketQuantity, [id]: quantity });
  };

  const handleCreateReservation = async (conferenceId: number, quantity: number) => {
    try {
      if (!user) {
        if (!localStorage.getItem("reservation")) {  // save only first reservation
          const reservationToStorage = {
            timestamp: Date.now(),
            conferenceId: conferenceId,
            quantity: quantity
          }
          localStorage.setItem("reservation", JSON.stringify(reservationToStorage)); // save reservation data
        }
        setVisibleAuth(true);
        return;
      }
      const user_id = Number(user.id);
      const reservation: Reservation = {
        Id: 0,
        UserId: user_id,
        User: null,
        ConferenceId: conferenceId,
        Conference: null,
        IsConfirmed: false,
        IsPaid: false,
        NumberOfTickets: quantity,
        Ammount: 0,
        ReservationDate: new Date().toISOString()
      };
      await postReservations(reservation, user_id);
      setToastType("success");
      setToastMessage("User have successfully created new reservation.");
      fetchConference();
    }
    catch (error) {
      console.error(error);
      setToastType('error');
      setToastMessage((error as Error).message);
    }
  };

  useEffect(() => {
    const reservationFromStorage = localStorage.getItem('reservation');
    if (reservationFromStorage) {
      try {
        const reservationData = JSON.parse(reservationFromStorage);
        if (reservationData) {
          const actualTime = Date.now();
          if (actualTime - reservationData.timestamp >= 5 * 60 * 1000) {
            localStorage.removeItem('reservation');
            setVisibleAuth(false);
            return;
          }
          if (user) {
            setVisibleAuth(false);
            const confId = reservationData.conferenceId;
            const quant = reservationData.quantity;
            localStorage.removeItem('reservation');
            handleCreateReservation(confId, quant);
          }
        }
      } catch (error) {
        console.error('Error parsing reservation data from localStorage:', error);
        localStorage.removeItem('reservation');  // for safety
        setVisibleAuth(false);
      }
    }
  }, [user]);

  if (loading) {
    return <div className="loading">Loading conference details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!conference) {
    return <div className="error">Conference not found.</div>;
  }


  return (
    <div className="conference-detail">
      {visibleAuth && <AuthorizationWindow actionToClose={setVisibleAuth} />}
      {toastMessage && (
        <Toast message={toastMessage} onClose={closeToast} type={toastType} />
      )}
      {/* Отображение фото конференции */}
  {conference.PhotoUrl && (
    <div className="conference-photo-container">
      <img
        src={conference.PhotoUrl}
        alt="Conference dont have proho )="
        className="conference-photo"
      />
    </div>
  )}

      <h1 className="conference-title">{conference.Name}</h1>
      <div className="description-container">
        <p className="conference-description">{conference.Description}</p>
      </div>
      <div className="text-left p-5">
        <p><strong>Location:</strong> {conference.Location}</p>
        <p><strong>Start Date:</strong> {conference.StartDate}</p>
        <p><strong>End Date:</strong> {conference.EndDate}</p>
        <p><strong>Occupancy:</strong> {conference.Occupancy}/{conference.Capacity}</p>
        <p><strong>Price:</strong> ${conference.Price.toFixed(2)}</p>
        <div className="flex flex-row justify-between mt-10">
          <div className="flex flex-row items-center space-x-2">
            <span className="font-semibold text-lg">Number of tickets:</span>
            <input
              title="Number of Tickets"
              type="number"
              min="1"
              value={ticketQuantity[conference.Id] || 1}
              onChange={(e) => handleQuantityChange(conference.Id, parseInt(e.target.value))}
              className="w-12 text-center border border-gray-300 rounded-md p-1 focus:outline-none focus:border-blue-500 transition duration-150"
            />
            <div className="flex space-x-1">
              <button
                className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-l hover:bg-red-600 transition-colors duration-150"
                onClick={() => handleQuantityChange(conference.Id, (ticketQuantity[conference.Id] || 1) - 1)}
              >
                -
              </button>
              <button
                className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-r hover:bg-green-600 transition-colors duration-150"
                onClick={() => handleQuantityChange(conference.Id, (ticketQuantity[conference.Id] || 1) + 1)}
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              const newQuantity = ticketQuantity[conference.Id] || 1;
              handleQuantityChange(conference.Id, newQuantity);
              handleCreateReservation(conference.Id, newQuantity)
            }}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
            Add to Cart
          </button>
        </div>
      </div>
      <div className="organizer-info">
        <h3>Organizer Information</h3>
        <p><strong>Organizer:</strong> {conference.Organizer.UserName} (Email: {conference.Organizer.Email})</p>
      </div>

      <h2 className="presentations-title">Presentations</h2>
      <Link
        to={pathCreateLecture}
        state={conference}
        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
        Add Presentation
      </Link>
{conference.Presentations && conference.Presentations.length > 0 ? (
  <div className="timeline">
    {conference.Presentations
      .sort((a, b) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime()) // Sorting by StartTime
      .map((presentation, index) => (
        <div key={presentation.Id} className="timeline-item">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <Link to={`/lectures/${presentation.Id}`} className="timeline-title">
              <h3>{presentation.Title}</h3>
            </Link>
            <p><strong>Description:</strong> {presentation.Description}</p>
            <p><strong>Room:</strong> {presentation.Room?.Name || "Undefined"}</p> {/* Added Room field */}
            <p><strong>Tags:</strong> {presentation.Tags}</p>
            <p><strong>Speaker:</strong> {presentation.Speaker?.UserName} (Email: {presentation.Speaker?.Email})</p>
            <p><strong>Start Time:</strong> {new Date(presentation.StartTime).toLocaleString('en-US', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
            })}</p>
            <p><strong>End Time:</strong> {new Date(presentation.EndTime).toLocaleString('en-US', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
            })}</p>
          </div>
        </div>
      ))}
  </div>
) : (
  <p>No presentations available for this conference.</p>
)}

    </div>
  );
};

export default ConferenceDetailPage;
