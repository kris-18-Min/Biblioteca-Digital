import React, { useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function Login({ onLogin }){
  const [form, setForm] = useState({ email:'', password:'' });
  const [msg, setMsg] = useState('');
  const onChange = e => setForm({...form, [e.target.name]: e.target.value});
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/login', form);
      onLogin(res.data.token);
      setMsg('Inicio exitoso');
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={submit}>
        <div><label>Email</label><input className="input" name="email" value={form.email} onChange={onChange} /></div>
        <div><label>Password</label><input type="password" className="input" name="password" value={form.password} onChange={onChange} /></div>
        <button className="button" style={{marginTop:10}} type="submit">Entrar</button>
        <p className="small">{msg}</p>
      </form>
    </div>
  );
}
