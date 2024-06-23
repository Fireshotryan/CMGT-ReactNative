import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  // Effect hook om favoriete evenementen uit AsyncStorage te laden bij het mounten van de component
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteEvents');
        if (storedFavorites) {
          setFavoriteEvents(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorite events:', error);
        console.error('Fout bij laden van favoriete evenementen:', error);
      }
    };

    loadFavorites();
  }, []);

  // Functie om een evenement aan favorieten toe te voegen
  const addFavorite = async (event) => {
    try {
      const updatedFavorites = [...favoriteEvents, event];
      setFavoriteEvents(updatedFavorites);
      await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Fout bij toevoegen van favoriet evenement:', error);
    }
  };

  // Functie om een evenement uit favorieten te verwijderen
  const removeFavorite = async (eventId) => {
    try {
      const updatedFavorites = favoriteEvents.filter(event => event.id !== eventId);
      setFavoriteEvents(updatedFavorites);
      await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Fout bij verwijderen van favoriet evenement:', error);
    }
  };

  // Functie om te controleren of een evenement favoriet is
  const isFavorite = (eventId) => {
    return favoriteEvents.some(event => event.id === eventId);
  };

  // Provider die de favoriete evenementen en de CRUD-operaties daarop aanbiedt aan de onderliggende componenten
  return (
    <FavoritesContext.Provider value={{ favoriteEvents, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
