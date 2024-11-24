import React, { useEffect, useState } from 'react';
import { getAllUsers, getAllRooms, deleteUser } from '../../api';
import { Presentation, Conference, User, Room, Reservation } from '../../data'; // Adjust based on your structure
import { Link, useParams, useNavigate } from "react-router-dom";
import Toast from '../../Components/Toast/Toast';
import "../AdminPanelPage/AdminPanelPage.css";
import { useUser } from '../../context/UserContext';

const AdminPanelPage: React.FC = () => {
    const { showShow } = useParams<{ showShow: string }>();
    const user = useUser(); // Get the user data
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [lectures, setLectures] = useState<Presentation[]>([]);
    const [users, setUsers] = useState<User[] | undefined>([]);
    const [rooms, setRooms] = useState<Room[] | undefined>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [filteredConferences, setFilteredConferences] = useState<Conference[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const navigate = useNavigate();


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
        if (user) {
            if (user.id === id.toString()) {
                setToastType('error');
                setToastMessage('You can\'t delete yourself!!!');
                return;
            }
            else {
                try {
                    await deleteUser(id, model);
                    window.location.reload();
                }
                catch (error) {
                    setToastType('error');
                    setToastMessage('Error occured while deleting user (error 500).');
                }
            }
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
            if (!user || user.role !== "Admin") {
                return;
            }
            else {
                if (showShow === "Users") {
                    const fetchUsers = async () => {
                        const data = await getAllUsers();
                        setUsers(data);
                    };
                    setIsAuthorized(true);
                    fetchUsers();
                }
            }
        }
        catch (error) {
            setError('Failed to fetch.');
            console.error("Error fetching:", error);
        }
        finally {
            setLoading(false);
        }
    }, [showShow, user]);


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!isAuthorized) {
        return <div className="error">User should be authorized for interaction with presentation.</div>;
    }

    else {
        return (
            <div>
                <h1 style={{
                    fontSize: '4rem',
                    textAlign: 'center',
                    margin: '0 auto',
                    fontWeight: 'bold',
                    color: '#333'
                }}>Users List</h1>
                <div style={{
                    fontSize: '2rem',
                    textAlign: 'center',
                    margin: '0 auto',
                    fontWeight: 'bold',
                    color: '#333'
                }}>
                    <button className="ticket-button bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 my-8"
                        onClick={() => handleCreate()}
                    >
                        Add new User
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {toastMessage && (
                        <Toast message={toastMessage} onClose={closeToast} type={toastType} />
                    )}
                    {users!.map((user) => (

                        <div key={user.Id} className="conference-card">
                            <h2 className="conference-title">Username: {user.UserName || 'Untitled'}</h2>
                            <p className="conference-description">Email: {user.Email || 'No description available.'}</p>
                            <p className="conference-description">User ID: {user.Id || 'No description available.'}</p>
                            <p className="conference-description">Role: {user.Role === 1 ? 'Basic' : 'Admin'}</p>
                            <button
                                className={`px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600 mx-4 my-2`}
                                onClick={() => handleDelete(user.Id, "Users")}
                            >
                                Delete
                            </button>
                            <button
                                className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 mx-4`}
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
