import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store'; 
import './Navbar.css';

export const Navbar = () => {
  const { token, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        MySocialNet
      </Link>

      <div className="nav-links">
        {token ? (
          <>
            <Link to="/" className="nav-item">Fil d'actualité</Link>
            <Link to={`/profile/${user?.id}`} className="nav-item">Mon Profil</Link>
            
            <div className="nav-user-info">
              <span className="welcome-text">
                Bonjour, <strong>{user?.username}</strong>
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Connexion</Link>
            <Link to="/register" className="nav-item">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};