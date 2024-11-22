import React, { useEffect, useState } from 'react';
import { getAllConferences, getAllPresentations, getAllUsers, getAllRooms, getAllReservations, deleteEntity, deleteUser } from '../../api';
import ReservationCard from '../../Components/ReservationCard/ReservationCard';
import { pathAdmin, pathAvailableReservations } from '../../Routes/Routes';
import { Presentation, Conference, User, Room, Reservation} from '../../data'; // Adjust based on your structure
import { Link, useParams, useNavigate } from "react-router-dom";
import Toast from '../../Components/Toast/Toast';
import "../AdminPanelPage/AdminPanelPage.css";

const AdminPanelPage: React.FC = () => {
    const { showShow } = useParams<{ showShow: string }>();
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [lectures, setLectures] = useState<Presentation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
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

    const [reservationsFiltered, setReservationsFiltered] = useState<Reservation[]>([]);
    const [selectedReservations, setSelectedReservations] = useState<number[]>([]);

    // filtering
    const [conferenceNameFilter, setConferenceNameFiler] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<{ from: string; to: string }>({ from: '', to: '' });
    const [groupFilter, setGroupFilter] = useState<string>('');

    const reservationStatusList: string[] = ['Confirmed', 'Unconfirmed', 'Unpaid']
    const groupList: string[] = ['Single', 'Group']
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

    const closeToast = () => setToastMessage(null);


    const handleDelete = async (id: number, model: string) => {
        try { 
            await deleteUser(id, model);
            window.location.reload();
        }
        catch (error) {
            setToastType('error');
            setToastMessage('Error occured while deleting user (error 500).');
        }
    }

    const handleEdit = (id: number) => {
        navigate(`./edit/${id}`);
    }

    const handleCreate = () => {
        navigate(`./create`);
    }

    const handleNavigate = () => {
        navigate(`../admin/Users`);
    }

        useEffect(() => {
            try {
                if (showShow === "Users") {
                    const fetchUsers = async () => {
                        const data = await getAllUsers();
                        setUsers(data);
                    };
                    fetchUsers();
                }
                if (showShow === "Rooms") {
                    const fetchRooms = async () => {
                        const data = await getAllRooms();
                        setRooms(data);
                    };
                    fetchRooms();
                }
            }
            catch (error) {
                setError('Failed to fetch.');
                console.error("Error fetching:", error);
            }
            finally {
                setLoading(false);
            }
        }, [showShow]);


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    else {
        return (
            <div>
                <div>
                    <button className="ticket-button bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        onClick={() => handleCreate()}
                    >
                        Add new User
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {toastMessage && (
                        <Toast message={toastMessage} onClose={closeToast} type={toastType} />
                    )}
                    {users.map((user) => (

                        <div key={user.Id} className="lecture-card">
                            <h2 className="lecture-title">Username: {user.UserName || 'Untitled'}</h2>
                            <p className="lecture-description">Email: {user.Email || 'No description available.'}</p>
                            <p className="lecture-description">User ID: {user.Id || 'No description available.'}</p>
                            <p className="lecture-description">Role: {user.Role === 1 ? 'Basic' : 'Admin'}</p>
                            <button
                                className={`px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600`}
                                onClick={() => handleDelete(user.Id, "Users")}
                            >
                                Delete
                            </button>
                            <button
                                className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 mx-2`}
                                onClick={() => handleEdit(user.Id)}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>);
    }



    }
  

export default AdminPanelPage;
