import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import './styles.css';

export default function App(){
  const [token, setToken] = React.useState(localStorage.getItem('token') || null);
  
  React.useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  },[]);

  const handleLogout = () => { 
    localStorage.removeItem('token'); 
    setToken(null); 
  }

  const handleLogin = (t) => {
    localStorage.setItem('token', t); 
    setToken(t);
  }

  return (
    <Router>
      <div className="container">
        <div className="card header">
          <Navbar token={token} onLogout={handleLogout} />
        </div>

        <Routes>
          <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register onRegisterSuccess={() => window.location.href = '/login'} /> : <Navigate to="/" />} />
          <Route path="/" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
