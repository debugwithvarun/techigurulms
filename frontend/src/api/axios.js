import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL,
});


// --- REQUEST INTERCEPTOR ---
// Automatically adds the Token to the header of every request
api.interceptors.request.use(
    (config) => {
        // Get user info from local storage
        const userInfo = localStorage.getItem('userInfo')
            ? JSON.parse(localStorage.getItem('userInfo'))
            : null;

        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- RESPONSE INTERCEPTOR ---
// Handle 401 Unauthorized errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Auto-logout on token expiration
            // localStorage.removeItem('userInfo');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;