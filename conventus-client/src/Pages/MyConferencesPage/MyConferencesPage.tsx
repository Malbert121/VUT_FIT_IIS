import React, { useEffect, useState, useCallback } from 'react';
import { getMyConferences, postReservations } from '../../api';
import { Conference } from '../../data';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Reservation } from '../../data';
import Toast from '../../Components/Toast/Toast';
import { deleteConference } from '../../api'; // Ensure you have this function in your API file

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const uniqueGenres = Array.from(new Set(conferences.map(conference => conference.Genre).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(conferences.map(conference => conference.Location).filter(Boolean)));

  const closeToast = () => setToastMessage(null);

  const fetchConferences = useCallback(async () => {
    try {
      const data = await getMyConferences(Number(user?.id));
      setConferences(data);
      setFilteredConferences(data);
    } catch (error) {
      setError('Failed to fetch conferences.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConferences();
  }, [fetchConferences]);

  // Handle filtering
  useEffect(() => {
    let filtered = [...conferences];

    // Apply filters
    if (genreFilter) filtered = filtered.filter(conference => conference.Genre === genreFilter);
    if (locationFilter) filtered = filtered.filter(conference => conference.Location === locationFilter);
    if (searchTerm) {
      filtered = filtered.filter(conference =>
        conference.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOption === 'Name') return a.Name.localeCompare(b.Name);
      if (sortOption === 'StartDate') return new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime();
      if (sortOption === 'Price') return a.Price - b.Price;
      return 0;
    });

    setFilteredConferences(filtered);
  }, [genreFilter, locationFilter, searchTerm, sortOption, conferences]);


  const handleDelete = async (conferenceId: number) => {
    if (window.confirm('Are you sure you want to delete this conference?')) {
      try {
        await deleteConference(conferenceId); // Call the API to delete the conference
        setToastType('success');
        setToastMessage('Conference deleted successfully.');
        await fetchConferences(); // Refresh the list after deletion
      } catch (error) {
        setToastType('error');
        setToastMessage('Failed to delete conference.');
      }
    }
  };
  

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto py-8">
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} type={toastType} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Conferences</h1>
        <Link
          to="/myconferences/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create New Conference
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
          <select
            onChange={(e) => setGenreFilter(e.target.value || null)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Genres</option>
            {uniqueGenres.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
          <select
            onChange={(e) => setLocationFilter(e.target.value || null)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="Name">Sort by Name</option>
            <option value="StartDate">Sort by Start Date</option>
            <option value="Price">Sort by Price</option>
          </select>
        </div>
      </div>

      {/* Conferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConferences.map((conference) => (
          <div
            key={conference.Id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{conference.Name}</h2>
            <p className="text-gray-600">{conference.Description}</p>
            <p>
              <strong>Location:</strong> {conference.Location}
            </p>
            <p>
              <strong>Price:</strong> ${conference.Price}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDelete(conference.Id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyConferencesPage;
