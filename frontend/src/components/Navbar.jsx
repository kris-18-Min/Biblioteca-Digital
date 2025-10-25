import React from 'react';

export default function Navbar({ token, onLogout }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src="/public/favicon.svg" alt="logo" style={{width:40,height:40}} />
        <div>
          <div style={{fontWeight:700}}>Biblioteca Digital</div>
          <div style={{fontSize:12,color:'#9aa4b2'}}>Sistema de gestión</div>
        </div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <a href="#" style={{textDecoration:'none',color:'inherit'}} onClick={(e)=>e.preventDefault()}>Home</a>
        <a href="#" style={{textDecoration:'none',color:'inherit'}} onClick={(e)=>e.preventDefault()}>Libros</a>
        <a href="#" style={{textDecoration:'none',color:'inherit'}} onClick={(e)=>e.preventDefault()}>Auditoría</a>
        {token ? <button className="button" onClick={onLogout}>Cerrar sesión</button> : null}
      </div>
    </div>
  );
}
