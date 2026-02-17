/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Load User on Startup
    useEffect(() => {
        const loadUser = async () => {
            const userInfo = localStorage.getItem('userInfo');
            
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
                
                // Verify token validity with backend (optional but recommended)
                try {
                    // We temporarily set the user state, but verify via API
                    // If the token is invalid, the interceptor or backend will fail
                    // For now, we trust localStorage to keep UI snappy
                } catch (err) {
                    console.error("Session expired");
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // 2. Login
    const login = async (email, password) => {
        setError(null);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    // 3. Register
    const register = async (name, email, password, role) => {
        setError(null);
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    // 4. Logout
    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        // Optional: Redirect to login via window.location or navigate in component
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);