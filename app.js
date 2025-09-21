import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import ServiceDetail from './components/ServiceDetail';
import AddService from './components/AddService';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/add-service" element={<AddService />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
