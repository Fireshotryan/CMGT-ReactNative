import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from './ThemeContext';

const EventDetail = ({ route }) => {
  const { event } = route.params || {};
  const { isDarkMode } = useContext(ThemeContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Load favorite status from AsyncStorage on component mount
    loadFavoriteStatus();
  }, []);

  const loadFavoriteStatus = async () => {
    try {
      const favoriteEventsStr = await AsyncStorage.getItem('favoriteEvents');
      if (favoriteEventsStr !== null) {
        const favoriteEvents = JSON.parse(favoriteEventsStr);
        const found = favoriteEvents.some((favEvent) => favEvent.id === event.id);
        setIsFavorite(found);
      }
    } catch (error) {
      console.error('Error loading favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      let favoriteEvents = [];
      const favoriteEventsStr = await AsyncStorage.getItem('favoriteEvents');
      if (favoriteEventsStr !== null) {
        favoriteEvents = JSON.parse(favoriteEventsStr);
      }

      const foundIndex = favoriteEvents.findIndex((favEvent) => favEvent.id === event.id);
      if (foundIndex !== -1) {
        // Event already in favorites, remove it
        favoriteEvents.splice(foundIndex, 1);
        setIsFavorite(false);
      } else {
        // Event not in favorites, add it
        favoriteEvents.push(event);
        setIsFavorite(true);
      }

      // Save updated favorite events back to AsyncStorage
      await AsyncStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents));
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{event?.title}</Text>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{event?.description}</Text>
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteContainer}>
        <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? 'red' : 'black'} />
        <Text style={[styles.favoriteText, { color: isFavorite ? 'red' : 'black' }]}>
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
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  favoriteText: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default EventDetail;
