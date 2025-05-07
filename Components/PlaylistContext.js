// src/context/PlaylistContext.js
import React, { createContext, useState, useContext } from 'react';

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);

  function addToPlaylist(track) {
    // если уже есть — не добавлять
    setPlaylist(prev =>
      prev.find(t => t.id === track.id) ? prev : [...prev, track]
    );
  }

  function removeFromPlaylist(id) {
    setPlaylist(prev => prev.filter(t => t.id !== id));
  }

  return (
    <PlaylistContext.Provider value={{ playlist, addToPlaylist, removeFromPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}

// хук для удобства
export function usePlaylist() {
  return useContext(PlaylistContext);
}
