import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notification from './pages/Notification';
import Predictions from './pages/Predictions';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'; 
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import TeamsPage from './pages/TeamsPage';
import StandingsPage from './pages/StandingsPage';
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="app-container flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1"><Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<ProtectedRoute />}>
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/StandingPage" element={<StandingsPage />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/predictions" element={<Predictions />} />
      {/* Add more protected routes as needed */}
    </Route>
  </Route>
</Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;