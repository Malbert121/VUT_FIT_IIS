import React from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
    const user = useUser(); // Get the user data
    const navigate = useNavigate(); // Hook to navigate between pages
    console.log(user)
    const handleLogout = () => {
        // Logic to log out the user (e.g., clearing the token)
        localStorage.removeItem('token');
        navigate('/login'); // Redirect to login page
        window.location.reload();
    };

    if (!user) {
        return <div>User not found or not authorized.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">User Information</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role === 'Admin' ? 'Admin' : 'User'}</p>
            </div>

            {/* Conditional rendering based on user role */}
            {user.role === 'Admin' && (
                <div className="mt-6 bg-white p-4 rounded shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Admin Options</h3>
                    <p>As an admin, you can manage users, view reports, and more.</p>
                    {}
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AccountPage;
