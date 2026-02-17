import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// Contexts (Required for Data & Auth)
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import SignupPage from "./page/Signup";
import LoginPage from "./page/Login";
import TutorDashboard from "./page/TutorDashbaord";
import Active from "./page/Active";
import Inactive from "./page/Inactive";
import CourseDetail from "./components/Course/CourseDetail";
import CertificatesPage from "./page/CertificatesPage";
// 1. Layout for pages WITH Navbar & Footer
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20">
        {" "}
        {/* Add padding for fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* 2. Wrap everything in Providers so Context works everywhere */}
      <AuthProvider>
        <CourseProvider>
          <Routes>
            {/* --- PUBLIC LAYOUT (Navbar + Footer) --- */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} /> {/* Default to Home Page */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/active-course" element={<Active />} />
              <Route path="/inactive-course" element={<Inactive />} />
              <Route
                path="/active-certificates"
                element={<CertificatesPage />}
              />
              <Route
                path="/inactive-certificates"
                element={<CertificatesPage />}
              />
            </Route>

            {/* --- STANDALONE PAGES (No Navbar/Footer) --- */}

            {/* IMPORTANT: This must match 'const { id } = useParams()' in CourseDetail.tsx */}
            <Route path="/course/:id" element={<CourseDetail />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Private Route */}
            <Route path="/dashboard" element={<TutorDashboard />} />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="text-center py-20 font-bold text-xl">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
