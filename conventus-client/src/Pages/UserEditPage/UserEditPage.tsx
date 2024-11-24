import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from '../../Components/Toast/Toast';
import { getAnotherUser, postUser, putUser, registerUser } from '../../api'; // Import your API methods
import { Role, User } from '../../data'; // Import the data structure
import './UserEditPage.css'; // Add custom styles if needed
import { useUser } from '../../context/UserContext';

const UserEditPage = () => {
    const emptyUser: User = {
        Id: 0, // Default for numeric fields
        UserName: '', // Default for string fields
        Email: '', // Default for string fields
        Role: Role.User,
        PasswordHash: ''
    };
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userActual = useUser(); // Get the user data
    const [user, setUser] = useState<User | null>(emptyUser);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const closeToast = () => setToastMessage(null);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getAnotherUser(Number(id));
                setUser(data);
            } catch (error) {
                setError('Failed to fetch conference details.');
            } finally {
                setLoading(false);
            }
        };
        if (id && userActual && userActual.role === "Admin") {
            setIsAuthorized(true);
            fetchUser();
        }
        else {
            setLoading(false);
        }
    }, [id, userActual]);

    useEffect(() => {
        if (userActual && userActual.role === "Admin") {
            setIsAuthorized(true);
        }
    }, [userActual]); 

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setUser((user) => {
            if (!user) return null;
            return {
                ...user,
                Id: user.Id, // Ensure Id remains unchanged
                [name]: name === "Role" ? Number(value) : value,
            };
        });

    };


    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    const handleSave = async () => {
        try {
            if (user && user.UserName && user.UserName !== '' && id) {
                if (user.PasswordHash && user.PasswordHash !== "" && user.PasswordHash?.length < 8) {
                    setToastType('error');
                    setToastMessage('Password is too short.');
                    return;
                }
                if (user.Email && user.Email !== "" && !isValidEmail(user.Email)) {
                    setToastType('error');
                    setToastMessage('Email is not valid');
                    return;
                }
                await putUser(Number(id), "Users", user);
                setToastType("success");
                setToastMessage("User have successfully paid reservations.");
                navigate(-1);
            }
            else if (user && user.UserName && user.UserName !== '') {
                if (user.PasswordHash && user.PasswordHash !== "" && user.PasswordHash?.length < 8) {
                    setToastType('error');
                    setToastMessage('Password is too short.');
                    return;
                }
                if (user.Email && user.Email !== "" && !isValidEmail(user.Email)) {
                    setToastType('error');
                    setToastMessage('Email is not valid');
                    return;
                }
                await postUser("Users", user);
                setToastType("success");
                setToastMessage('User created successfully.');
                navigate(-1);
            }
            else {
                setToastType('error');
                setToastMessage('Username not found or user in invalid');
            }

        } catch (error) {
            console.log(error);
            setToastType('error');
            setToastMessage('Failed to update the conference.');
        }
    };

    if (loading) {
        return <div className="loading">Loading conference details...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!user) {

        return <div className="error">User not found.</div>;

    }

    if (!isAuthorized) {
        return <div className="error">User should be authorized for interaction with presentation.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100 p-6">
            {toastMessage && (
                <Toast message={toastMessage} onClose={closeToast} type={toastType} />
            )}
            <div className="bg-white shadow-md rounded-lg w-full max-w-md p-6">
                <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                    {id ? 'Edit User' : 'Create User'}
                </h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username:
                        </label>
                        <input
                            type="text"
                            name="UserName"
                            value={user.UserName || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email:
                        </label>
                        <textarea
                            name="Email"
                            value={user.Email || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password:
                        </label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="PasswordHash"
                            value={user.PasswordHash || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                        />
                        <label style={{ display: "flex", alignItems: "center" }}>
                            <input
                                type="checkbox"
                                checked={passwordVisible}
                                onChange={togglePasswordVisibility}
                                style={{ marginRight: "8px" }}
                            />
                            Show Password
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role:
                        </label>
                        <select
                            name="Role"
                            onChange={handleInputChange}
                            value={user.Role}
                            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={`${Role.User}`}>Basic</option>
                            <option value={`${Role.Admin}`}>Admin</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>


    );
};

export default UserEditPage;
