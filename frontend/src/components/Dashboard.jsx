import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BooksList from './BooksList';

export default function Dashboard({ token }){
  const [me, setMe] = useState(null);
  const [audit, setAudit] = useState([]);
  useEffect(()=>{
    (async ()=>{
      try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, { headers: { Authorization: 'Bearer ' + token } });
        setMe(res.data);
      }catch(e){
        setMe(null);
      }
      try{
        const a = await axios.get(`${import.meta.env.VITE_ADMIN_URL}/audit/recent`);
        setAudit(a.data.entries || []);
      }catch(e){
        setAudit([]);
      }
    })();
  },[token]);

  return (
    <div>
      <h2>Panel</h2>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <div className="card">
            <h3>Mi perfil</h3>
            {me ? <div><p><strong>{me.name}</strong></p><p className="small">{me.email}</p></div> : <p className="small">No disponible</p>}
          </div>
          <div style={{marginTop:16}} className="card"><BooksList token={token} /></div>
        </div>
        <div style={{width:320}}>
          <div className="card">
            <h3>Auditoría (reciente)</h3>
            <div className="audit">{audit.length ? audit.map((l,i)=>(<div key={i}>{l}</div>)) : <div className="small">No hay eventos todavía</div>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
