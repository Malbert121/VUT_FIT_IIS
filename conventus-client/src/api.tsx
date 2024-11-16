import axios from 'axios';
import { User, Conference, Presentation, Reservation, Room} from './data'; 


// Function to fetch user data with token in headers
export const getUser = async (userId: number): Promise<User> => {
    const token = localStorage.getItem('token');
    
    if (!token) throw new Error('No token found');

    try {
        const response = await axios.get<User>(`https://localhost:7156/api/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user data');
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
export const getAllReservations = async ():Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations}`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};

export const getAvailabelReservations = async (user_id:number):Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations/available?user_id=${user_id}`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};


export const getUnpaidReservations = async (user_id:number):Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations/unpaid?user_id=${user_id}`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};


export const getGuestReservations = async (user_id:number, paid:boolean):Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations/guest?user_id=${user_id}&paid=${paid}`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};

export const getReservation = async (id:Number, user_id:number): Promise<Reservation | null> => {
    try
    {
        console.log(`req to get reservation by id = ${id}`)
        const response = await axios.get<Reservation>(`https://localhost:7156/api/Reservations/${id}?user_id=${user_id}`);
        return response.data;
    }
    catch (error)
    {
        console.error("Error fetching presentation:", error);
        return null;
    }
}


export const putResirvationsToPay = async(reservationsIds:number[], user_id:number)=>{
    try
    {
        console.log(`reservations ids to pay ${reservationsIds}`);
        await axios.put<{message:string}>(`https://localhost:7156/api/Reservations/to_pay?user_id=${user_id}`, reservationsIds);
    }
    catch(error)
    {
        handleAxiosError(error);
    }
}

export const putResirvationsToConfirm = async(reservationsIds:number[], flag:boolean)=>{
    try
    {
        console.log(`reservations ids to confirm ${reservationsIds}`);
        await axios.put<{message:string}>(`https://localhost:7156/api/Reservations/to_confirm?flag=${flag}`, reservationsIds);
    }
    catch(error)
    {
        handleAxiosError(error);
    }
}

export const postReservations = async (reservation:Reservation, user_id:number) => {
    try
    {
        console.log(`user id ${user_id}`);
        console.log(`reservations ids to create reservation ${reservation}`);
        await axios.post<{message:string}>(`https://localhost:7156/api/Reservations/create?user_id=${user_id}`, reservation);
    }
    catch(error)
    {
        handleAxiosError(error);
    }
}

export const deleteReservations = async (reservationsIds:number[], user_id:number) => {
    try
    {
        console.log(`reservations ids to delete ${reservationsIds}`);
        await axios.delete<{ message: string }>(`https://localhost:7156/api/Reservations/delete?user_id=${user_id}`, {
            data: reservationsIds
        });
    }
    catch(error)
    {
        handleAxiosError(error);
    }   
}

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
