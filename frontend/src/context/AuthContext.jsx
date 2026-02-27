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
                try {
                    const parsedUser = JSON.parse(userInfo);
                    setUser(parsedUser);
                } catch {
                    localStorage.removeItem('userInfo');
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
            return { success: true, pendingApproval: data.pendingApproval };
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
    };

    // 5. Update Profile
    const updateProfile = async (profileData) => {
        try {
            const { data } = await api.put('/auth/profile', profileData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    // 6. Get My Enrolled Courses with Progress
    const getMyEnrollments = async () => {
        try {
            const { data } = await api.get('/auth/my-enrollments');
            return { success: true, data };
        } catch (err) {
            return { success: false, data: [], message: err.response?.data?.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, getMyEnrollments }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
