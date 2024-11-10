import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { User } from '../../data'; // Assuming you have this User type

const AccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);  // User state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login'); // If no token, redirect to login
            return;
        }

        try {
            // Decode the JWT token
            const decodedToken: any = jwtDecode(token); // You can cast it to any because the token structure can vary
            
            // Extract the necessary claims
            const userName = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            const email = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const role = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"]; // Example for role
            // Set the decoded user data into the state
            setUser({
                Id: userId || '',
                UserName: userName || '',
                Email: email || '',
                Role : role || 0,
            });

        } catch (error) {
            setError('Invalid or expired token.');
            setLoading(false);
            return;
        }

        setLoading(false);
    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>{error}</div>;

    if (!user) return <div>User not found</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">User Information</h2>
                <p><strong>Name:</strong> {user.UserName}</p>
                <p><strong>Email:</strong> {user.Email}</p>
            </div>
            <div className="mt-6">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AccountPage;
