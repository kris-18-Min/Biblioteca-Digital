import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ 
    email: '', 
    password: '' 
  });
  const [msg, setMsg] = useState('');
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  
  const onChange = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault();
    if (step === 1) {
      try {
        // Simular envío de código de verificación
        setStep(2);
        setMsg('Se ha enviado un código de verificación a tu email');
        return;
      } catch (err) {
        setMsg('Error: ' + (err.response?.data?.error || err.message));
        return;
      }
    }
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        ...form,
        verificationCode: step === 2 ? verificationCode : undefined
      });
      const decodedToken = jwtDecode(res.data.token);
      onLogin(res.data.token);
      setMsg('¡Bienvenido ' + decodedToken.name + '!');
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="form-container card">
      <img src="/book-logo.svg" alt="Logo" className="logo" style={{display:'block',margin:'0 auto 20px'}} />
      <h2 style={{textAlign:'center',marginBottom:24}}>Iniciar sesión</h2>
      <form onSubmit={submit}>
        {step === 1 ? (
          <>
            <div className="form-group">
              <label>Email</label>
              <input 
                className="input" 
                name="email" 
                type="email" 
                required
                value={form.email} 
                onChange={onChange}
                placeholder="correo@ejemplo.com" 
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input 
                type="password" 
                className="input" 
                name="password" 
                required
                value={form.password} 
                onChange={onChange}
                placeholder="Tu contraseña" 
              />
            </div>
          </>
        ) : (
          <div className="form-group">
            <label>Código de Verificación</label>
            <input 
              type="text" 
              className="input" 
              name="verificationCode"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              placeholder="Ingresa el código enviado a tu email" 
              required
            />
          </div>
        )}
        
        <button className="button" style={{width:'100%',marginTop:20}} type="submit">
          {step === 1 ? 'Continuar' : 'Iniciar Sesión'}
        </button>
        
        {msg && <p className={msg.includes('Error') ? 'error' : 'success'}>{msg}</p>}
        
        <p style={{textAlign:'center',marginTop:20}}>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}
