import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store';
import './Profile.css';

export const Profile = ({ isPublic = false }) => {
  const { id } = useParams(); 
  const { token, user: currentUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [editData, setEditData] = useState({ username: '', description: '' });
  const [loading, setLoading] = useState(true);

  // Variable d'environnement pour l'URL API
  const API_URL = import.meta.env.VITE_API_URL;

  const targetId = isPublic ? id : currentUser?.id;

  const fetchProfile = useCallback(async () => {
    if (!token || !targetId) return;
    
    setLoading(true);
    try {
      // 1. Infos du profil avec API_URL
      const resUser = await fetch(`${API_URL}/api/users/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (resUser.ok) {
        const userData = await resUser.json();
        setProfileData(userData);
        
        if (!isPublic) {
          setEditData({ 
            username: userData.username || '', 
            description: userData.description || '' 
          });
        }
      }

      // 2. Posts avec API_URL
      const resPosts = await fetch(`${API_URL}/api/posts?filters[user][id][$eq]=${targetId}&populate=*&sort=createdAt:desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (resPosts.ok) {
        const postsData = await resPosts.json();
        setUserPosts(postsData.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    } finally {
      setLoading(false);
    }
  }, [token, targetId, isPublic, API_URL]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Sécurité : ne pas envoyer de données si on n'a pas de token
    if (!token || !currentUser?.id) return;

    try {
      const res = await fetch(`${API_URL}/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        // On s'assure d'envoyer un objet propre
        body: JSON.stringify({
          username: editData.username,
          description: editData.description
        })
      });
      
      const updatedUser = await res.json();

      if (res.ok) {
        dispatch(updateUser(updatedUser)); // Met à jour le store Redux
        setProfileData(updatedUser);      // Met à jour l'affichage local
        alert("Profil mis à jour !");
      } else {
        // Affiche l'erreur réelle de Strapi pour débugger
        console.error("Détails erreur Strapi:", updatedUser);
        alert(`Erreur: ${updatedUser.error?.message || "Impossible de mettre à jour"}`);
      }
    } catch (error) {
      console.error("Erreur réseau mise à jour :", error);
    }
  };
  
  if (loading || (!isPublic && !currentUser)) {
    return <div className="profile-container"><p className="loading-text">Chargement du profil...</p></div>;
  }

  if (!profileData) {
    return <div className="profile-container"><p className="error-text">Utilisateur {targetId} non trouvé.</p></div>;
  }

  return (
    <div className="profile-container">
      <h2>Profil de {profileData.username}</h2>
      
      <div className="profile-header">
        <p className="profile-info-item"><strong>Email :</strong> {profileData.email}</p>
        <p className="profile-info-item">
          <strong>Description :</strong> {profileData.description || "Aucune description fournie."}
        </p>
      </div>

      {!isPublic && (
        <form onSubmit={handleUpdate} className="edit-profile-form">
          <h3>Modifier mes informations</h3>
          <div className="form-group">
            <label>Pseudo</label>
            <input 
              className="profile-input"
              type="text" 
              value={editData.username} 
              onChange={e => setEditData({...editData, username: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="profile-textarea"
              value={editData.description} 
              onChange={e => setEditData({...editData, description: e.target.value})} 
            />
          </div>
          <button type="submit" className="btn-save">Enregistrer</button>
        </form>
      )}

      <hr className="profile-divider" />
      
      <h3>Publications ({userPosts.length})</h3>
      
      <div className="user-posts-list">
        {userPosts.map(post => (
          <div key={post.id} className="user-post-item">
            <p className="user-post-text">{post.attributes?.text || post.text}</p>
            <span className="user-post-date">
              Posté le {new Date(post.attributes?.createdAt || post.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};