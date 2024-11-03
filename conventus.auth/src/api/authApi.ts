import axios from 'axios';
import { LoginRequest, AuthResponse, RegisterRequest } from '../types/auth';

const API_URL = 'https://localhost:7156/api/Auth';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    return response.data; // Ensure that you're returning response.data
};


export const register = async (data: RegisterRequest): Promise<void> => {
    await axios.post(`${API_URL}/register`, data);
};
