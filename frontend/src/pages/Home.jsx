import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Home.css';

export const Home = () => {
  const { token, user } = useSelector(state => state.auth);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  // On stocke l'URL dans une constante pour plus de clarté
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Utilisation de la variable d'environnement
      const res = await fetch(`${API_URL}/api/posts?populate=*&sort=createdAt:desc`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setPosts(data.data || []);
    } catch (error) {
      console.error("Erreur récupération :", error);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (documentId, currentLikes) => {
    try {
      // Utilisation de la variable d'environnement
      const res = await fetch(`${API_URL}/api/posts/${documentId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: { like: (Number(currentLikes) || 0) + 1 } })
      });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error("Erreur like :", error);
    }
  };

  const deletePost = async (documentId) => {
    if (!window.confirm("Supprimer ce post ?")) return;
    try {
      // Utilisation de la variable d'environnement
      const res = await fetch(`${API_URL}/api/posts/${documentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      // Utilisation de la variable d'environnement
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ data: { text: newPost, user: user.id } })
      });
      if (response.ok) {
        setNewPost("");
        fetchPosts(); 
      }
    } catch (error) {
      console.error("Erreur publication :", error);
    }
  };

  if (!token) return <div className="welcome"><h1>Welcome on My Social Network</h1></div>;

  return (
    <div className="home-container">
      <form className="post-form" onSubmit={handlePost}>
        <input 
          className="post-input"
          value={newPost} 
          onChange={e => setNewPost(e.target.value)} 
          placeholder="Quoi de neuf ?"
        />
        <button className="btn-post" type="submit" disabled={loading}>Poster</button>
      </form>

      {loading && <p>Chargement des messages...</p>}

      <div className="posts-list">
        {posts.map((post) => {
          const text = post.attributes?.text || post.text;
          const authorData = post.attributes?.user?.data || post.user;
          const username = authorData?.attributes?.username || authorData?.username || "Anonyme";
          const authorId = authorData?.id; 
          const likesCount = post.attributes?.like ?? post.like ?? 0;

          return (
            <div key={post.id} className="post-card">
              <Link to={`/user/${authorId}`} className="post-author">
                @{username}
              </Link>
              <p className="post-text">{text}</p>
              
              <div className="post-actions">
                <button className="btn-like" onClick={() => handleLike(post.documentId, likesCount)}>
                  ❤️ {likesCount}
                </button>
                
                {Number(authorId) === Number(user?.id) && (
                  <button className="btn-delete" onClick={() => deletePost(post.documentId)}>
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};