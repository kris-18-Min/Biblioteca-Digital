import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar({ token, onLogout }) {
  const location = useLocation();
  const userName = token ? jwtDecode(token).name : null;

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'var(--card-bg)',
      borderRadius: '12px',
      boxShadow: '0 2px 4px var(--shadow)'
    }}>
      <div style={{display:'flex',alignItems:'center',gap:20}}>
        <img src="/book-logo.svg" alt="logo" style={{width:48,height:48}} />
        <div>
          <div style={{fontSize:'1.5rem',fontWeight:700,color:'var(--primary)'}}>
            Biblioteca Digital
          </div>
          <div style={{fontSize:'0.9rem',color:'var(--text)'}}>
            Sistema de Gestión
          </div>
        </div>
      </div>
      
      <div style={{display:'flex',gap:24,alignItems:'center'}}>
        {token && (
          <>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Inicio
            </Link>
            <Link to="/books" className={`nav-link ${location.pathname === '/books' ? 'active' : ''}`}>
              Libros
            </Link>
            <span style={{color:'var(--primary)',fontWeight:500}}>
              ¡Bienvenido, {userName}!
            </span>
            <button 
              className="button" 
              onClick={onLogout}
              style={{background:'var(--error)',padding:'8px 16px'}}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
