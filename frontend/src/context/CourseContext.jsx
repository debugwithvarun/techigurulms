/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]); // For instructors
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Fetch All Public Courses
    const fetchCourses = async (keyword = '', pageNumber = '') => {
        setLoading(true);
        try {
            // Supports filtering: /courses?keyword=react&pageNumber=1
            const { data } = await api.get(`/courses?keyword=${keyword}&pageNumber=${pageNumber}`);
            setCourses(data.courses);
            return data; // Return full object for pagination data (pages, page)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    // 2. Fetch Single Course
    const fetchCourseById = async (id) => {
        try {
            const { data } = await api.get(`/courses/${id}`);
            return data;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // 3. Fetch Instructor Courses (My Courses)
    const fetchMyCourses = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/courses/mycourses');
            setMyCourses(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch your courses');
        } finally {
            setLoading(false);
        }
    };

    // 4. Create Course
    const createCourse = async (courseData) => {
        try {
            const { data } = await api.post('/courses', courseData);
            setMyCourses([...myCourses, data]); // Update local list
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Creation failed' };
        }
    };

    // 5. Update Course
    const updateCourse = async (id, courseData) => {
        try {
            const { data } = await api.put(`/courses/${id}`, courseData);
            // Update in local state maps
            setCourses(prev => prev.map(c => c._id === id ? data : c));
            setMyCourses(prev => prev.map(c => c._id === id ? data : c));
            return { success: true, data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    // 6. Delete Course
    const deleteCourse = async (id) => {
        try {
            await api.delete(`/courses/${id}`);
            // Remove from local state
            setCourses(prev => prev.filter(c => c._id !== id));
            setMyCourses(prev => prev.filter(c => c._id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Delete failed' };
        }
    };

    return (
        <CourseContext.Provider value={{ 
            courses, 
            myCourses, 
            loading, 
            error, 
            fetchCourses, 
            fetchCourseById, 
            fetchMyCourses,
            createCourse, 
            updateCourse, 
            deleteCourse 
        }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourse = () => useContext(CourseContext);