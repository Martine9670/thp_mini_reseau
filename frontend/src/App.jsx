import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Navbar } from './pages/Navbar'; // Ton composant avec le CSS

const App = () => {
  return (
    <BrowserRouter>
      {/* On utilise le composant Navbar qui contient toute la logique et le style */}
      <Navbar />

      {/* On enveloppe les routes dans un container pour le contenu principal */}
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth isRegister={false} />} />
          <Route path="/register" element={<Auth isRegister={true} />} />
          {/* Version "Mon profil" (privé) */}
          <Route path="/profile/:id" element={<Profile isPublic={false} />} />
          {/* Version "Profil d'un autre" (public) */}
          <Route path="/user/:id" element={<Profile isPublic={true} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;