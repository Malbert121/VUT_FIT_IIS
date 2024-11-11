import React, { useEffect, useState } from 'react';
import { getAllConferences, getAllPresentations, getAllUsers, getAllRooms, getAllReservations, deleteEntity } from '../../api';
import { Presentation, Conference, User, Room} from '../../data'; // Adjust based on your structure
import { Link, useParams, useNavigate } from "react-router-dom";
import { Ticket, sampleTickets } from '../TicketsPage/TicketsPage'

const AdminPanelPage: React.FC = () => {
    const { showShow } = useParams<{ showShow: string }>();
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [lectures, setLectures] = useState<Presentation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredConferences, setFilteredConferences] = useState<Conference[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    // Filtering and sorting states
    const [genreFilter, setGenreFilter] = useState<string | null>(null);
    const [locationFilter, setLocationFilter] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<string>('Name');
    const [ticketQuantity, setTicketQuantity] = useState<{ [key: number]: number }>({});
    const uniqueGenres = Array.from(new Set(conferences.map(conference => conference.Genre).filter(Boolean)));
    const uniqueLocations = Array.from(new Set(conferences.map(conference => conference.Location).filter(Boolean)));
    // Filtering and sorting states
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
    const [showAdditionalFilters, setShowAdditionalFilters] = useState<boolean>(false); // State for showing additional filters
    const handlePurchase = (ticket: Ticket) => {
        if (ticket.available) {
            // Implement your purchase logic here (e.g., API call)
            console.log(`Purchased ticket: ${ticket.name}`);
        } else {
            alert('This ticket is not available.');
        }
    };
    const handleQuantityChange = (id: number, quantity: number) => {
        setTicketQuantity({ ...ticketQuantity, [id]: quantity });
    };
    const handleDelete = (id: number, model: string) => {
        deleteEntity(id, model);
        window.location.reload();
    }
    useEffect(() => {
        if (showShow === "Conferences") {
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
        }
        if (showShow === "Presentations") {
            const fetchLectures = async () => {
                try {
                    const data = await getAllPresentations();
                    setLectures(data);
                } catch (error) {
                    setError('Failed to fetch lectures.');
                    console.error("Error fetching lectures:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchLectures();
        }
        if (showShow === "Users") {
            const fetchUsers = async () => {
                try {
                    const data = await getAllUsers();
                    setUsers(data);
                } catch (error) {
                    setError('Failed to fetch lectures.');
                    console.error("Error fetching lectures:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchUsers();
        }
        if (showShow === "Rooms") {
            const fetchRooms = async () => {
                try {
                    const data = await getAllRooms();
                    setRooms(data);
                } catch (error) {
                    setError('Failed to fetch lectures.');
                    console.error("Error fetching lectures:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchRooms();
        }
    }, [showShow]);

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

    useEffect(() => {

    });
    if (showShow === "Conferences") {

        return (
            <div className="ConferencesPage">
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

                            <div className="ticket-section">
                                <p className="conference-price"><strong>Price:</strong> ${conference.Price}</p>
                                <button className="ticket-button bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                    onClick={() => handleDelete(conference.Id, showShow)}
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
    if (showShow === "Presentations") {
        return (<div className="lecture-list">
            {lectures.map((lecture) => (
                <div key={lecture.Id} className="lecture-card">
                    <h2 className="lecture-title">{lecture.Title || 'Untitled'}</h2>
                    <p className="lecture-description">{lecture.Description || 'No description available.'}</p>
                    <p className="lecture-dates">
                        <strong>Start Time:</strong> {lecture.StartTime} <br />
                        <strong>End Time:</strong> {lecture.EndTime}
                    </p>

                        <button
                        className={`px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600`}
                        onClick={() => handleDelete(lecture.Id, showShow)}
                        >
                            Delete
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600`}
                    >
                        Edit
                    </button>
                    
                </div>
            ))}
        </div>)
    }
    if (showShow === "Tickets") {
        return (<div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Available Tickets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleTickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        className={`p-4 border rounded shadow-md  bg-white'`}
                    >
                        <h2 className="text-xl font-semibold">{ticket.name}</h2>
                        <p className="text-lg mb-2">${ticket.price}</p>
                        <button
                            onClick={() => handlePurchase(ticket)}
                            className={`px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600`}
                            disabled={!ticket.available}
                        >
                            Delete
                        </button>
                        <button
                            className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600`}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>)
    }
    if (showShow === "Users") {
        return (<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {users.map((user) => (
                <div key={user.Id} className="lecture-card">
                    <h2 className="lecture-title">Username: {user.UserName || 'Untitled'}</h2>
                    <p className="lecture-description">Email: {user.Email || 'No description available.'}</p>
                    <p className="lecture-description">User ID: {user.Id || 'No description available.'}</p>
                    <p className="lecture-description">Role: {user.Role === 1 ? 'Basic' : 'Admin'}</p>
                    <button
                        className={`px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600`}
                        onClick={() => handleDelete(user.Id, showShow)}
                    >
                        Delete
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600`}
                    >
                        Edit
                    </button>

                </div>
            ))}
        </div>)
    }
    if (showShow === "Rooms") {
        return (<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {rooms.map((room) => (
                <div key={room.Id} className="lecture-card">
                    <h2 className="lecture-title">{room.Name  || 'Untitled'}</h2>
                    <p className="lecture-description">Capacity: {room.Capacity || 'No description available.'}</p>
                    <p className="lecture-description">Room ID: {room.Id || 'No description available.'}</p>
                    <p className="lecture-description">Conference ID: {room.ConferenceId || 'No description available.'}</p>
                    <button
                        className={`px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600`}
                        onClick={() => handleDelete(room.Id, showShow)}
                    >
                        Delete
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600`}
                    >
                        Edit
                    </button>

                </div>
            ))}
        </div>)
    }

    else {
        return (
            <div>
                <h1>Admin Panel</h1>
                <p>Welcome to the Admin Panel. Here you can manage conferences, lectures, and users.</p>

                <section>
                    <h2>Manage Conferences</h2>
                    <button>Add New Conference</button>
                    <br></br>
                    <button>Edit Existing Conferences</button>
                    <br></br>
                    <button>Delete Conferences</button>
                    <br></br>
                </section>

                <section>
                    <h2>Manage Lectures</h2>
                    <button>Add New Lecture</button>
                    <br></br>
                    <button>Edit Existing Lectures</button>
                    <br></br>
                    <button>Delete Lectures</button>
                    <br></br>
                </section>

                <section>
                    <h2>Manage Users</h2>
                    <button>View Users</button>
                    <button>Edit User Roles</button>
                    <button>Delete Users</button>
                </section>
            </div>
        );
    };
}
  

export default AdminPanelPage;
