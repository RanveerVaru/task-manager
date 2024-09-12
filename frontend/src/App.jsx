import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './components/Home';
import TaskForm from './pages/TaskForm';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar  />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Wrap protected routes with ProtectedRoute */}
        <Route 
          path="/" 
          element={<ProtectedRoute Component={Home} />} 
        />
        <Route 
          path="/form" 
          element={<ProtectedRoute Component={TaskForm} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
