import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CourseProvider>
        <App />
      </CourseProvider>
    </AuthProvider>
  </React.StrictMode>,
);