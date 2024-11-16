import React, { useEffect, useState, useCallback } from 'react';
import { getMyConferences, postReservations } from '../../api';
import { Conference } from '../../data';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Reservation } from '../../data';
import Toast from '../../Components/Toast/Toast';
//import './ConferencesPage.css';

function MyConferencesPage() {
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
      const data = await getMyConferences(Number(user?.id));
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
 // Handler for adding a new conference
 const handleAddNew = () => {
  console.log('Navigating to Add New Conference page...');
  // Example: Navigate to another page or show a form/modal
  // navigate('/add-new-conference');
};

// Handler for deleting a conference
const handleDelete = async (conferenceId: number) => {
  if (window.confirm('Are you sure you want to delete this conference?')) {
    try {
      // Call your API to delete the conference
      console.log(`Deleting conference with ID: ${conferenceId}`);
      // await deleteConference(conferenceId);
      fetchConferences(); // Refresh the list after deletion
      setToastType('success');
      setToastMessage('Conference deleted successfully.');
    } catch (error) {
      console.error('Error deleting conference:', error);
      setToastType('error');
      setToastMessage('Failed to delete conference.');
    }
  }
};
  const handleCreateReservation = async (conferenceId:number, quantity:number) => {
    try
    {
      if(!user)
      {
        console.log('Unauthorized user is bad boy!'); //TODO: solve unauthorized user behavioral  
        setToastType('error');
        setToastMessage('Unauthorized user is bad boy!');
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
        {/* Buttons */}
     <div className="action-buttons mb-4">
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          Add New
        </button>
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
              
              
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default MyConferencesPage;
