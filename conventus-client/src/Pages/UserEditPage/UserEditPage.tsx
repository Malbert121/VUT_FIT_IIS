import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnotherUser, postEntity, putEntity, registerUser } from '../../api'; // Import your API methods
import { Role, User } from '../../data'; // Import the data structure
import './UserEditPage.css'; // Add custom styles if needed

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
    const [user, setUser] = useState<User | null>(emptyUser);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);




    useEffect(() => {
        const fetchConference = async () => {
            try {
                const data = await getAnotherUser(Number(id));
                setUser(data);
            } catch (error) {
                setError('Failed to fetch conference details.');
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchConference();
        }
        else {
            setLoading(false);
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement| HTMLInputElement | HTMLTextAreaElement>) => {
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
    function getHashCode(input: string): string {
        let hash = 0;

        if (input.length === 0) return hash.toString();
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32-bit integer
        }

        return hash.toString();
    }

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Usage
    const myString = "Hello, World!";
    const hashString = getHashCode(myString);

    console.log(`Hash code as string: ${hashString}`);


    const handleSave = async () => {
        try {
            if (user && id) {
                await putEntity(Number(id), "Users", user);
                alert('Conference updated successfully.');
            }
            else if (user && user.PasswordHash && user.PasswordHash?.length >= 8 && user.Email && isValidEmail(user.Email)) {
                user.PasswordHash = getHashCode(user.PasswordHash);
                await postEntity("Users", user);
                alert('User created successfully.');
                navigate(`..`);
            }
            else
            {
                alert('Something wrong try again');
            }

        } catch (error) {
            alert('Failed to update the conference.');
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
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
                            type="password"
                            name="PasswordHash"
                            value={user.PasswordHash || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                        />
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID:
                        </label>
                        <input
                            name="Id"
                            value={user.Id}
                            disabled
                            placeholder="ID"
                            className="w-full px-3 py-2 border rounded-md bg-gray-200 text-gray-600"
                        />
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
