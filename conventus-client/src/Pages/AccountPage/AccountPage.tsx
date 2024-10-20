import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../../api'; // Adjust the import based on your structure
import { User } from '../../data';

const AccountPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>(); // Get userId from the route
    const [user, setUser] = useState<User>(); // Use User interface from api
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError('No userId provided');
                setLoading(false);
                return;
            }

            console.log("Fetching user data for userId:", userId);

            try {
              const data = await getUser(userId);
              console.log("API response:", data);
          
              if (data) {
                  if (data) {
                      setUser(data); // Set user data
                      console.log("User data set:", data);
                  } else {
                      console.warn("No user data found in response.");
                  }
              } else {
                  console.warn("No data returned from API.");
              }
          } catch (error) {
              console.error("Error fetching user data:", error);
          
          
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleLogout = () => {
        // Implement your logout logic here (e.g., clearing tokens, redirecting, etc.)
        console.log('User logged out');
        // Example: clear token and redirect
        // localStorage.removeItem('token');
        // window.location.href = '/login';
    };

    if (loading) {
        return <div>Loading user data...</div>; // Optional loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Display error message
    }

    if (!user) {
        return <div>User not found.</div>; // Handle user not found
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
            <div className="bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">User Information</h2>
                <p>
                    <strong>Name:</strong> {user.UserName || 'N/A'}
                </p>
                <p>
                    <strong>Email:</strong> {user.Email || 'N/A'}
                </p>
                {/* Avoid showing PasswordHash for security reasons */}
                {/* {user.PasswordHash && (
                    <p>
                        <strong>Password Hash:</strong> {user.PasswordHash}
                    </p>
                )} */}
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Account Actions</h2>
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
