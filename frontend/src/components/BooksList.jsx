import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function BooksList({ token }){
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title:'', author:'', isbn:'', description:'' });
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await axios.get('http://localhost:3001/books');
        setBooks(res.data);
      }catch(e){ setBooks([]); }
    })();
  },[]);

  const onChange = e => setForm({...form,[e.target.name]: e.target.value});

  const create = async e => {
    e.preventDefault();
    try{
      await axios.post('http://localhost:3001/books', form, { headers: { Authorization: 'Bearer ' + token } });
      setMsg('Libro creado');
      const res = await axios.get('http://localhost:3001/books');
      setBooks(res.data);
      setForm({ title:'', author:'', isbn:'', description:'' });
    }catch(err){ setMsg('Error: ' + (err.response?.data?.error || err.message)); }
  };

  const remove = async (id) => {
    try{
      await axios.delete('http://localhost:3001/books/' + id, { headers: { Authorization: 'Bearer ' + token } });
      setBooks(books.filter(b=>b.id!==id));
    }catch(e){}
  };

  return (
    <div>
      <h3>Libros</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
        <div>
          <div style={{display:'grid',gap:12}}>
            {books.map(b=>(
              <div key={b.id} className="card" style={{marginBottom:10}}>
                <h4>{b.title}</h4>
                <p className="small">{b.author} — {b.isbn}</p>
                <p>{b.description}</p>
                {token ? <button className="button" onClick={()=>remove(b.id)}>Eliminar</button> : null}
              </div>
            ))}
          </div>
        </div>
        {token ? (
          <div className="card">
            <h4>Agregar libro</h4>
            <form onSubmit={create}>
              <input className="input" name="title" placeholder="Título" value={form.title} onChange={onChange} />
              <input className="input" name="author" placeholder="Autor" value={form.author} onChange={onChange} />
              <input className="input" name="isbn" placeholder="ISBN" value={form.isbn} onChange={onChange} />
              <textarea className="input" name="description" placeholder="Descripción" value={form.description} onChange={onChange} />
              <button className="button" style={{marginTop:8}} type="submit">Crear</button>
              <p className="small">{msg}</p>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
