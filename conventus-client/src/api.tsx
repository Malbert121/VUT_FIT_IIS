import axios from 'axios';
import { User, Conference, Presentation, Reservation, Room} from './data'; 
import { API_CONFIG } from './config';

// Function to fetch user data with token in headers
export const getUser = async (userId: number): Promise<User> => {
    const token = localStorage.getItem('token');
    
    if (!token) throw new Error('No token found');

    try {
        const response = await axios.get<User>(`${API_CONFIG.API_BASE}/User/${userId}`, {
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
        const response = await axios.get<User[]>(`${API_CONFIG.API_BASE}/Users`);
        return response.data; // Assuming the API returns an array of users
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getAllConferences = async (): Promise<Conference[]> => {
    try {
        const response = await axios.get<Conference[]>(`${API_CONFIG.API_BASE}/Conferences`);
        return response.data; // Assuming this directly returns an array of Conferences
    } catch (error) {
        console.error("Error fetching conferences:", error);
        return []; // Return an empty array in case of an error
    }
};

export const getMyConferences = async (userId: number): Promise<Conference[]> => {
    try {
        const response = await axios.get<Conference[]>(
            `${API_CONFIG.API_BASE}/Conferences/myConferences`,
            { params: { user_id: userId } } // Pass the user_id as query parameter
        );

        if (response.status === 204) {
            console.info("No conferences found for this user.");
            return [];
        }
        console.log(response.data)
        return response.data; // Return the array of conferences
    } catch (error) {
        console.error("Error fetching conferences by user:", error);
        return []; // Return an empty array in case of an error
    }
};
export const updateConference = async (id: number, conferenceData: Conference) => {
    const response = await fetch(`${API_CONFIG.API_BASE}/Conferences/${id}`, {
      method: 'PUT', // or 'PATCH'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(conferenceData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update conference');
    }
  
    return await response.json();
  };
  
// Function to fetch a specific conference by ID
export const getConference = async (id: number): Promise<Conference | null> => {
    try {
        const response = await axios.get<Conference>(`${API_CONFIG.API_BASE}/Conferences/${id}`);
        return response.data; // Return the conference object
    } catch (error) {
        console.error("Error fetching conference:", error);
        return null; // Return null in case of an error
    }
};

export const getAllPresentations = async (): Promise<Presentation[]> => {
    try {
        const response = await axios.get<Presentation[]>(`${API_CONFIG.API_BASE}/Presentations`);
        return response.data; // Assuming this directly returns an array of Presentations
    } catch (error) {
        console.error("Error fetching presentations:", error);
        return []; // Return an empty array in case of an error
    }
};

export const getMyPresentations = async (user_id: number): Promise<Presentation[]> => {
    try{
        const response = await axios.get<Presentation[]>(`${API_CONFIG.API_BASE}/Presentations/my_presentations?user_id=${user_id}`);
        return response.data;
    }
    catch(error){
        handleAxiosError(error);
        return [];
    }
}

// Function to fetch a specific presentation by ID
export const getPresentation = async (id: number): Promise<Presentation | null> => {
    try {
        const response = await axios.get<Presentation>(`${API_CONFIG.API_BASE}/Presentations/${id}`);
        return response.data; // Return the presentation object
    } catch (error) {
        handleAxiosError(error);
        return null; // Return null in case of an error
    }
}

// Function to update a specific presentation by ID
export const updatePresentation = async (user_id:number, presentation: Presentation): Promise<Presentation | null> => {
    try {
        const response = await axios.put<Presentation>(
            `${API_CONFIG.API_BASE}/Presentations/update?user_id=${user_id}`, 
            presentation
        )
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        return null; // Return null in case of an error
    }
}
// Function to delete a specific presentation by ID
export const deletePresentation = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_CONFIG.API_BASE}/Presentations/${id}`);
    } catch (error) {
        handleAxiosError(error);
    }
};
// Function to create a new presentation
export const createPresentation = async (presentation: Presentation, user_id: number) => {
    try {
        console.log(`user id ${user_id}`);
        console.log(`presentation data to create: ${JSON.stringify(presentation)}`);
        const response = await axios.post<{ message: string }>(
            `${API_CONFIG.API_BASE}/Presentations/create?user_id=${user_id}`,
            presentation
        );
        console.log('Presentation created successfully:', response.data);
    } catch (error) {
        handleAxiosError(error);
    }
}
// Fetch all reservations
export const getAllReservations = async ():Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`${API_CONFIG.API_BASE}/Reservations}`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};

export const getMyReservations = async (user_id:number, paid:boolean):Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`${API_CONFIG.API_BASE}/Reservations/my?user_id=${user_id}&paid=${paid}`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};

export const getGuestReservations = async (user_id:number, paid:boolean):Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`${API_CONFIG.API_BASE}/Reservations/guest?user_id=${user_id}&paid=${paid}`);
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
        const response = await axios.get<Reservation>(`${API_CONFIG.API_BASE}/Reservations/${id}?user_id=${user_id}`);
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
        await axios.put<{message:string}>(`${API_CONFIG.API_BASE}/Reservations/to_pay?user_id=${user_id}`, reservationsIds);
    }
    catch(error)
    {
        handleAxiosError(error);
    }
}

export const putResirvationsToConfirm = async(reservationsIds:number[], user_id:number, flag:boolean)=>{
    try
    {
        console.log(`reservations ids to confirm ${reservationsIds}`);
        await axios.put<{message:string}>(`${API_CONFIG.API_BASE}/Reservations/to_confirm?user_id=${user_id}&flag=${flag}`, reservationsIds);
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
        await axios.post<{message:string}>(`${API_CONFIG.API_BASE}/Reservations/create?user_id=${user_id}`, reservation);
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
        await axios.delete<{ message: string }>(`${API_CONFIG.API_BASE}/Reservations/delete?user_id=${user_id}`, {
            data: reservationsIds
        });
    }
    catch(error)
    {
        handleAxiosError(error);
    }   
}


export const deleteConference = async (conferenceId: number): Promise<void> => {
  try {
    await axios.delete(`${API_CONFIG.API_BASE}/Conferences/${conferenceId}`); // Replace with your actual endpoint
  } catch (error) {
    throw new Error('Failed to delete the conference');
  }
};

// Fetch all rooms
export const getAllRooms = async () => {
    try {
        const response = await axios.get<Room[]>(`${API_CONFIG.API_BASE}/Rooms`);
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
