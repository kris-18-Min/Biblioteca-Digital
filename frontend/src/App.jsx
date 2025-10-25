import React from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import './styles.css';

export default function App(){
  const [token, setToken] = React.useState(localStorage.getItem('token') || null);
  React.useEffect(()=> {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  },[]);
  const handleLogout = () => { localStorage.removeItem('token'); setToken(null); }

  return (
    <div className="container">
      <div className="card header">
        <Navbar token={token} onLogout={handleLogout} />
      </div>

      {!token ? (
        <div className="grid" style={{marginTop:20}}>
          <div className="card"><Register /></div>
          <div className="card"><Login onLogin={(t)=>{localStorage.setItem('token', t); setToken(t);}} /></div>
        </div>
      ) : (
        <div style={{marginTop:20}} className="card"><Dashboard token={token} /></div>
      )}
    </div>
  );
}
