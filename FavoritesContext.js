import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteEvents');
        if (storedFavorites) {
          setFavoriteEvents(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorite events:', error);
      }
    };

    loadFavorites();
  }, []);

  const addFavorite = async (event) => {
    try {
      const updatedFavorites = [...favoriteEvents, event];
      setFavoriteEvents(updatedFavorites);
      await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error adding favorite event:', error);
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      const updatedFavorites = favoriteEvents.filter(event => event.id !== eventId);
      setFavoriteEvents(updatedFavorites);
      await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite event:', error);
    }
  };

  const isFavorite = (eventId) => {
    return favoriteEvents.some(event => event.id === eventId);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteEvents, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
