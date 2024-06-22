import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext';

const EventDetail = ({ route }) => {
  const { event, favoriteEvents } = route.params || {}; // Destructure favoriteEvents from route.params
  const { isDarkMode } = useContext(ThemeContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if the event is already in favorites
    setIsFavorite(favoriteEvents.some((favEvent) => favEvent.id === event.id));
  }, [event, favoriteEvents]);

  // Function to toggle favorite status
  const toggleFavorite = () => {
    // Implement toggle logic based on favoriteEvents array
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{event.title}</Text>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{event.description}</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isFavorite ? 'gold' : 'tomato' }]}
        onPress={toggleFavorite}
      >
        <Text style={styles.buttonText}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 18,
    marginBottom: 10,
  },
  darkText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventDetail;
