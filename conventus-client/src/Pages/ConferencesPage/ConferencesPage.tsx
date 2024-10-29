import React, { useEffect, useState } from 'react';
import { getAllConferences } from '../../api'; // Adjust the import based on your structure
import { Conference } from '../../data'; // Adjust based on your structure
import { Link } from 'react-router-dom'; // Import Link for navigation
import './ConferencesPage.css';

function ConferencesPage() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [filteredConferences, setFilteredConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering and sorting states
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('Name');
  const [ticketQuantity, setTicketQuantity] = useState<{ [key: number]: number }>({});

  const uniqueGenres = Array.from(new Set(conferences.map(conference => conference.Genre).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(conferences.map(conference => conference.Location).filter(Boolean)));

  useEffect(() => {
    const fetchConferences = async () => {
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
    };

    fetchConferences();
  }, []);

  // Handle filtering
  useEffect(() => {
    let filtered = [...conferences];
    if (genreFilter) {
      filtered = filtered.filter(conference => conference.Genre === genreFilter);
    }
    if (locationFilter) {
      filtered = filtered.filter(conference => conference.Location === locationFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOption === 'Name') return a.Name.localeCompare(b.Name);
      if (sortOption === 'StartDate') return new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime();
      if (sortOption === 'Price') return a.Price - b.Price;
      return 0;
    });

    setFilteredConferences(filtered);
  }, [genreFilter, locationFilter, sortOption, conferences]);

  // Handle ticket quantity input
  const handleQuantityChange = (id: number, quantity: number) => {
    setTicketQuantity({ ...ticketQuantity, [id]: quantity });
  };

  if (loading) {
    return <div className="loading">Loading conferences...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="ConferencesPage">
      <h1 className="title">Upcoming Conferences</h1>
      <div className="filters">
        <select onChange={(e) => setGenreFilter(e.target.value || null)}>
          <option value="">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
        <select onChange={(e) => setLocationFilter(e.target.value || null)}>
          <option value="">All Locations</option>
          {uniqueLocations.map((location) => (
            <option key={location}>{location}</option>
          ))}
        </select>
        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="Name">Sort by Name</option>
          <option value="StartDate">Sort by Start Date</option>
          <option value="Price">Sort by Price</option>
        </select>
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
            <p className="conference-price"><strong>Price:</strong> ${conference.Price}</p>

            <div className="ticket-section">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={ticketQuantity[conference.Id] || 1}
                  onChange={(e) => handleQuantityChange(conference.Id, parseInt(e.target.value))}
                  className="w-12 text-center border border-gray-300 rounded-l p-1 focus:outline-none"
                />
                <div className="flex">
                  <button
                    className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-br hover:bg-red-600 transition-colors duration-150"
                    onClick={() => handleQuantityChange(conference.Id, (ticketQuantity[conference.Id] || 1) - 1)}
                  >
                    -
                  </button>
                  <button
                    className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-tr hover:bg-green-600 transition-colors duration-150"
                    onClick={() => handleQuantityChange(conference.Id, (ticketQuantity[conference.Id] || 1) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
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
