import axios from 'axios';
import { User, Conference, Presentation, Reservation, Room, ApiMsg } from './data'; // Adjust the import path
import { RegisterData, AuthResponse } from './data';


// Function to fetch user data with token in headers
export const getUser = async (userId: number): Promise<User> => {
    const token = localStorage.getItem('token');
    
    if (!token) throw new Error('No token found');

    try {
        const response = await axios.get<User>(`https://localhost:7156/api/Users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw new Error('Failed to fetch user data');
    }
};


export const getAnotherUser = async (userId: number): Promise<User> => {
    try {
        const response = await axios.get<User>(`https://localhost:7156/api/Users/detail/admin/${userId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
        throw new Error('Failed to fetch user data');
    }
};

export const postUser = async (model: string, data: User) => {
    try {
        const response = await axios.post(`https://localhost:7156/api/${model}/post`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Assuming the API returns an array of rooms
    } catch (error) {
        handleAxiosError(error);
        console.error("Error fetching rooms:", error);
        return null; // Return an empty array in case of an error
    }
};

export const putUser = async (id: number, model: string, data: User) => {
    try {
        const response = await axios.put(`https://localhost:7156/api/${model}/update/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Assuming the API returns an array of rooms
    } catch (error) {
        handleAxiosError(error);
        console.error("Error fetching rooms:", error);
        return null; // Return an empty array in case of an error
    }
};

export const deleteUser = async (id: number, model: string) => {
    try {
        await axios.delete(`https://localhost:7156/api/${model}/delete/${id}`);
    } catch (error) {
        handleAxiosError(error);
        console.error("Error fetching rooms:", error);
    }
};

export const registerUser = async (registerData: User) => {
    try {
        const response = await axios.post('https://localhost:7156/api/Auth/register', registerData);
        alert("Registration successful!");
    } catch (error) {
        handleAxiosError(error);
        alert("Error occured");
    }
};

// Fetch all users
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`https://localhost:7156/api/Users/all`);
        return response.data; // Assuming the API returns an array of users
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; // Return an empty array in case of an error
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

// Fetch all reservations
export const getAllReservations = async ():Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};

export const getAvailabelReservations = async ():Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations/available`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};


export const getUnpaidReservations = async ():Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations/unpaid`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};


export const getGuestReservations = async ():Promise<Reservation[]> => {
    try {
        const response = await axios.get<Reservation[]>(`https://localhost:7156/api/Reservations/guest`);
        return response.data; // Assuming the API returns an array of reservations
    } catch (error) {
        handleAxiosError(error);
        return [];
    }
};

export const getReservation = async (id:Number): Promise<Reservation | null> => {
    try
    {
        console.log(`id = ${id}`)
        const response = await axios.get<Reservation>(`https://localhost:7156/api/Reservations/${id}`);
        return response.data;
    }
    catch (error)
    {
        console.error("Error fetching presentation:", error);
        return null;
    }
}


export const putResirvationsToPay = async(reservationsIds:number[]):Promise<ApiMsg>=>{
    try
    {
        console.log(`reservations ids ${reservationsIds}`);
        const response = await axios.put<{message:string}>(`https://localhost:7156/api/Reservations/to_pay`, reservationsIds);
        return {success:true, msg: response.data.message};
    }
    catch(error)
    {
        let errMsg: string|null = null;
        if (axios.isAxiosError(error)) 
        {
            
            console.error('Error response:', error.response);
            if (error.response?.status === 400) 
            {
                errMsg = 'The request body was invalid or empty';
            }
            else if (error.response?.status === 404) {
                errMsg = 'No reservations found to update';
            } 
            else if (error.response?.status === 500) {
                errMsg = 'Internal server error';
            }
        } 
        else {
            console.error('Unexpected error:', error);
            errMsg='Unexpected error'
        }

        return {success:false, msg:errMsg};
    }
}


export const putResirvationsToConfirm = async(reservationsIds:number[], flag:boolean):Promise<ApiMsg>=>{
    try
    {
        console.log(`reservations ids ${reservationsIds}`);
        const response = await axios.put<{message:string}>(`https://localhost:7156/api/Reservations/to_confirm?flag=${flag}`, reservationsIds);
        return {success:true, msg: response.data.message};
    }
    catch(error)
    {
        let errMsg: string|null = null;
        if (axios.isAxiosError(error)) 
        {
            
            console.error('Error response:', error.response);
            if (error.response?.status === 400) 
            {
                errMsg = 'The request body was invalid or empty';
            }
            else if (error.response?.status === 404) {
                errMsg = 'No reservations found to update';
            } 
            else if (error.response?.status === 500) {
                errMsg = 'Internal server error';
            }
        } 
        else {
            console.error('Unexpected error:', error);
            errMsg='Unexpected error'
        }

        return {success:false, msg:errMsg};
    }
}

export const putResirvation = async (reservationsIds: number): Promise<ApiMsg> => {
    try {
        console.log(`reservations ids ${reservationsIds}`);
        const response = await axios.put<{ message: string }>(`https://localhost:7156/api/Reservations/${reservationsIds}`);
        return { success: true, msg: response.data.message };
    }
    catch (error) {
        let errMsg: string | null = null;
        if (axios.isAxiosError(error)) {

            console.error('Error response:', error.response);
            if (error.response?.status === 400) {
                errMsg = 'The request body was invalid or empty';
            }
            else if (error.response?.status === 404) {
                errMsg = 'No reservations found to update';
            }
            else if (error.response?.status === 500) {
                errMsg = 'Internal server error';
            }
        }
        else {
            console.error('Unexpected error:', error);
            errMsg = 'Unexpected error'
        }

        return { success: false, msg: errMsg };
    }
}

// Fetch all rooms
export const getAllRooms = async () => {
    try {
        const response = await axios.get<Room[]>(`https://localhost:7156/api/Rooms`);
        return response.data; // Assuming the API returns an array of rooms
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return []; // Return an empty array in case of an error
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

export const deleteEntity = async(id: number, model: string) => {
    try {
        await axios.delete(`https://localhost:7156/api/${model}/${id}`);
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
};

export const getDetailEdit = async (id: number, model: string) => {
    try {
        const response = await axios.get(`https://localhost:7156/api/${model}/${id}`);
        return response.data; // Assuming the API returns an array of rooms
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return null; // Return an empty array in case of an error
    }
};

export const postEntity = async (model: string, data: User | Conference | Reservation | Room | Presentation) => {
    try {
        const response = await axios.post(`https://localhost:7156/api/${model}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Assuming the API returns an array of rooms
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return null; // Return an empty array in case of an error
    }
};

export const putEntity = async (id: number, model: string, data: User | Conference | Reservation | Room | Presentation) => {
    try {
        const response = await axios.put(`https://localhost:7156/api/${model}/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Assuming the API returns an array of rooms
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return null; // Return an empty array in case of an error
    }
};


