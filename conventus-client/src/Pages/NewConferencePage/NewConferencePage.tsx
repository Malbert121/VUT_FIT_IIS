import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext"; // Import useUser hook
import { useNavigate } from "react-router-dom"; // Import useNavigate
const NewConferencePage: React.FC = () => {
    const user = useUser(); // Get the user data
    const navigate = useNavigate(); // Initialize useNavigate for navigation
    const [conferenceData, setConferenceData] = useState({
        name: "",
        description: "",
        genre: "",
        location: "",
        startDate: "",
        endDate: "",
        price: 0,
        capacity: 0,
        photoUrl: "",
        organizerId: user?.id || 0, // Automatically set organizerId from user context
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // State to control submit button
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConferenceData({
            ...conferenceData,
            [name]: name === "price" || name === "capacity" ? parseFloat(value) : value,
        });
    };

    const createConference = async () => {
        try {
            if (new Date(conferenceData.startDate) >= new Date(conferenceData.endDate)) {
                setErrorMessage("Start date must be earlier than the end date.");
                setSuccessMessage(null);
                return;
            }
            const response = await axios.post("https://localhost:7156/api/conferences", conferenceData);
            setSuccessMessage("Conference created successfully!");
            setErrorMessage(null);
            console.log("Conference Created:", response.data);
            // Redirect to the previous page after success
             // Disable the submit button and change its text
             setIsSubmitDisabled(true);
            setTimeout(() => {
                navigate(-1); // Go back to the previous page
            }, 2000); // Optional delay for user to see success message
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Failed to create the conference.");
            setSuccessMessage(null);
            console.error("Error creating conference:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createConference();
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
                    <p className="mt-4 text-gray-600">
                        You are not authorized to create a conference. Please log in.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto">
            <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create a New Conference</h1>

                {/* Organizer Info */}
                <div className="bg-blue-100 p-4 rounded-md mb-8">
                    <p className="text-gray-700">
                        <strong>Organizer Name:</strong> {user.username}
                    </p>
                    <p className="text-gray-700">
                        <strong>Organizer Email:</strong> {user.email}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={conferenceData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Conference Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Genre</label>
                            <input
                                type="text"
                                name="genre"
                                value={conferenceData.genre}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="e.g., Tech, Business"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={conferenceData.location}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Venue or City"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={conferenceData.price}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={conferenceData.capacity}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            name="description"
                            value={conferenceData.description}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Brief description of the conference"
                            rows={3}
                            required
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium">Start Date</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={conferenceData.startDate}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">End Date</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={conferenceData.endDate}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Photo URL</label>
                        <input
                            type="text"
                            name="photoUrl"
                            value={conferenceData.photoUrl}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Link to conference image"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg font-semibold transition ${
                            isSubmitDisabled
                                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        disabled={isSubmitDisabled}
                    >
                        {isSubmitDisabled ? "Thanks For Using Our Service" : "Create Conference"}
                    </button>
                </form>

                {/* Success and Error Messages */}
                {successMessage && (
                    <div className="mt-6 text-center text-green-600 font-medium">{successMessage}</div>
                )}
                {errorMessage && (
                    <div className="mt-6 text-center text-red-600 font-medium">{errorMessage}</div>
                )}
            </div>
        </div>
    );
};

export default NewConferencePage;
