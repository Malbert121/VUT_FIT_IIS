import React, { useEffect, useState, useCallback } from 'react';
import { getAllConferences, postReservations } from '../../api';
import { Conference } from '../../data';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Reservation } from '../../data';
import Toast from '../../Components/Toast/Toast';
import AuthorizationWindow from '../../Components/AuthorizationWindow/AuthorizationWindow';
import './ConferencesPage.css';

function ConferencesPage() {
  const user = useUser();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [filteredConferences, setFilteredConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  
  // Filtering and sorting states
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('Name');
  const [ticketQuantity, setTicketQuantity] = useState<{ [key: number]: number }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [showAdditionalFilters, setShowAdditionalFilters] = useState<boolean>(false);

  const uniqueGenres = Array.from(new Set(conferences.map(conference => conference.Genre).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(conferences.map(conference => conference.Location).filter(Boolean)));
  
  const closeToast = () => setToastMessage(null);
  
  const fetchConferences = useCallback(async () => {
    try {
      const data = await getAllConferences();
      console.log("Conferences data:", data);
      setConferences(data);
      setFilteredConferences(data);
    } catch (error) {
      setError('Failed to fetch conferences.');
      console.error("Error fetching conferences:", error);
    } finally {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    fetchConferences();
  }, [fetchConferences]);

  // Handle filtering
  useEffect(() => {
    let filtered = [...conferences];

    // Genre and location filters
    if (genreFilter) filtered = filtered.filter(conference => conference.Genre === genreFilter);
    if (locationFilter) filtered = filtered.filter(conference => conference.Location === locationFilter);

    // Title or description search
    if (searchTerm) {
      filtered = filtered.filter(conference =>
        conference.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conference.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange.from) filtered = filtered.filter(conference => new Date(conference.StartDate) >= new Date(dateRange.from));
    if (dateRange.to) filtered = filtered.filter(conference => new Date(conference.EndDate) <= new Date(dateRange.to));

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOption === 'Name') return a.Name.localeCompare(b.Name);
      if (sortOption === 'StartDate') return new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime();
      if (sortOption === 'Price') return a.Price - b.Price;
      return 0;
    });

    setFilteredConferences(filtered);
  }, [genreFilter, locationFilter, sortOption, searchTerm, dateRange, conferences]);

  // Handle ticket quantity input
  const handleQuantityChange = (id: number, quantity: number) => {
    setTicketQuantity({ ...ticketQuantity, [id]: quantity });
  };

  const handleCreateReservation = async (conferenceId:number, quantity:number) => {
    try
    {
      if(!user)
      {
        /*console.log('Unauthorized user is bad boy!'); //TODO: solve unauthorized user behavioral  
        setToastType('error');
        setToastMessage('Unauthorized user is bad boy!');
        */return;
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
      fetchConferences();
    }
    catch(error)
    {
      console.error(error);
      setToastType('error');
      setToastMessage((error as Error).message);
    }
  };

  if (loading) {
    return <div className="loading">Loading conferences...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ConferencesPage">
      {toastMessage && (
        <Toast message={toastMessage} onClose={closeToast} type={toastType} />
      )}
      <h1 className="title">Upcoming Conferences</h1>
      <div className="filters">
        {/* Search bar for title and description */}
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Genre filter */}
        <select onChange={(e) => setGenreFilter(e.target.value || null)}>
          <option value="">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>

        {/* Location filter */}
        <select onChange={(e) => setLocationFilter(e.target.value || null)}>
          <option value="">All Locations</option>
          {uniqueLocations.map((location) => (
            <option key={location}>{location}</option>
          ))}
        </select>

        {/* Toggle for additional filters */}
        <button
          onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
          className="toggle-filters bg-blue-600 text-white py-1 px-3 rounded"
        >
          {showAdditionalFilters ? 'Hide Additional Filters' : 'Show Additional Filters'}
        </button>

        {/* Additional Filters Section */}
        {showAdditionalFilters && (
          <div className="additional-filters">
            {/* Date range filter */}
            <div className="flex space-x-4">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                placeholder="From date"
              />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                placeholder="To date"
              />
            </div>

            {/* Sorting options */}
            <select onChange={(e) => setSortOption(e.target.value)}>
              <option value="Name">Sort by Name</option>
              <option value="StartDate">Sort by Start Date</option>
              <option value="EndDate">Sort by End Date</option>
              <option value="Price">Sort by Price (Low to High)</option>
              <option value="PriceDesc">Sort by Price (High to Low)</option>
              <option value="TicketsAvailable">Sort by Tickets Available</option>
              <option value="Popularity">Sort by Popularity</option>
            </select>
          </div>
        )}
      </div>

      <div className="conference-list">
        {filteredConferences.map((conference) => (
          <div key={conference.Id} className="conference-card">
            <Link to={`./${conference.Id}`}>
              <h2 className="conference-name">{conference.Name || 'Unnamed Conference'}</h2>
            </Link>
            <p className="conference-description">{conference.Description || 'No description available.'}</p>
            <p className="conference-location"><strong>Location:</strong> {conference.Location || 'Not specified'}</p>
            <p className="conference-dates">
              <strong>Start Date:</strong> {conference.StartDate} <br />
              <strong>End Date:</strong> {conference.EndDate}
            </p>
            <p className='conference-dates'><strong>Occupancy:</strong> {conference.Occupancy}/{conference.Capacity}</p>
            <div className="ticket-section">
              <p className="conference-price"><strong>Price:</strong> ${conference.Price}</p>
              <div className="flex items-center space-x-2">
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
                onClick={()=>{const newQuantity = ticketQuantity[conference.Id] || 1;
                  handleQuantityChange(conference.Id, newQuantity);
                  handleCreateReservation(conference.Id, newQuantity)}}
                className="ticket-button bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                Add to Cart
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default ConferencesPage;
