import React, { useState } from 'react';
import axios from 'axios';

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setMsg('La contraseña debe tener al menos 6 caracteres'); return; }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, form);
      setMsg('Usuario creado: ' + res.data.id);
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Registro</h2>
      <div><label>Nombre</label><input className="input" name="name" value={form.name} onChange={onChange} /></div>
      <div><label>Email</label><input className="input" name="email" value={form.email} onChange={onChange} /></div>
      <div><label>Password</label><input type="password" className="input" name="password" value={form.password} onChange={onChange} /></div>
      <button className="button" type="submit" style={{marginTop:10}}>Registrar</button>
      <p className="small">{msg}</p>
    </form>
  );
}
