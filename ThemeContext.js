import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // State voor het beheren van de dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect voor het laden van de opgeslagen themamodus bij het mounten van de component
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const storedThemeMode = await AsyncStorage.getItem('themeMode');
        if (storedThemeMode !== null) {
          setIsDarkMode(JSON.parse(storedThemeMode));
        }
      } catch (error) {
        console.error('Fout bij laden van themamodus:', error);
      }
    };

    loadThemeMode();
  }, []);

  // Functie voor het togglen van de themamodus
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('themeMode', JSON.stringify(newMode));
    } catch (error) {
      console.error('Fout bij toggelen van themamodus:', error);
    }
  };

  // Geef de ThemeContext.Provider terug met de huidige modus en toggle functie als waarde
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
