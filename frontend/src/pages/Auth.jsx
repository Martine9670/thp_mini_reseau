import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import ajouté

export const Auth = ({ isRegister }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isRegister 
      ? `${API_URL}/api/auth/local/register` 
      : `${API_URL}/api/auth/local`;

    // Structure du body pour Strapi
    const body = isRegister 
      ? { 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        }
      : { 
          identifier: formData.email, // L'email sert d'identifiant à la connexion
          password: formData.password 
        };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.jwt) {
        dispatch(loginSuccess(data));
        navigate('/');
      } else {
        console.error("Détail erreur Strapi:", data.error);
        alert(data.error?.message || "Erreur d'authentification");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Inscription' : 'Connexion'}</h2>
        
        {isRegister && (
          <input 
            type="text" 
            placeholder="Username" 
            required
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})} 
          />
        )}
        
        <input 
          type="text" 
          placeholder={isRegister ? "Email" : "Email ou Username"} 
          required
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          required
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})} 
        />
        
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};