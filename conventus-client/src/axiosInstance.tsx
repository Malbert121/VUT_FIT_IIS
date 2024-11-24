import axios from 'axios';
import { API_CONFIG } from './config';


const axiosInstance = axios.create({
    baseURL: API_CONFIG.API_REMOTE,
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
       
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
