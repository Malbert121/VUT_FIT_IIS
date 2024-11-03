import axios from 'axios';
import { User, Conference, Presentation, Reservation, Room } from './data'; // Adjust the import path

// Fetch a single user by ID
export const getUser = async (userId: string) => {
    try {
        const response = await axios.get<User>(`https://localhost:7156/api/Users/${userId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

// Fetch all users
export const getAllUsers = async () => {
    try {
        const response = await axios.get<User[]>(`https://localhost:7156/api/Users`);
        return response.data; // Assuming the API returns an array of users
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getAllConferences = async (): Promise<Conference[]> => {
    try {
        const response = await axios.get<Conference[]>(`https://localhost:7156/api/Conferences`);
        return response.data; // Assuming this directly returns an array of Conferences
    } catch (error) {
        console.error("Error fetching conferences:", error);
        return []; // Return an empty array in case of an error
    }
};
// Function to fetch a specific conference by ID
export const getConference = async (id: number): Promise<Conference | null> => {
    try {
        const response = await axios.get<Conference>(`https://localhost:7156/api/Conferences/${id}`);
        return response.data; // Return the conference object
    } catch (error) {
        console.error("Error fetching conference:", error);
        return null; // Return null in case of an error
    }
};

export const getAllPresentations = async (): Promise<Presentation[]> => {
    try {
        const response = await axios.get<Presentation[]>(`https://localhost:7156/api/Presentations`);
        return response.data; // Assuming this directly returns an array of Presentations
    } catch (error) {
        console.error("Error fetching presentations:", error);
        return []; // Return an empty array in case of an error
    }
};
// Function to fetch a specific presentation (lecture) by ID - TODO: change to lecture?
export const getPresentation = async (id: number): Promise<Presentation | null> => {
    try {
        const response = await axios.get<Presentation>(`https://localhost:7156/api/Presentations/${id}`);
        return response.data; // Return the presentation object
    } catch (error) {
        console.error("Error fetching presentation:", error);
        return null; // Return null in case of an error
    }
}

// Fetch all reservations
export const getAllReservations = async () => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
    }
};

// Fetch all rooms
export const getAllRooms = async () => {
    try {
        const response = await axios.get<Room[]>(`https://localhost:7156/api/Rooms`);
        return response.data; // Assuming the API returns an array of rooms
    } catch (error) {
        handleAxiosError(error);
    }
};

// Centralized error handling
const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.log("Error message:", error.message);
        throw new Error(error.message); // Rethrow error for handling in component
    } else {
        console.log("Unexpected error:", error);
        throw new Error("Unexpected Error");
    }
};
