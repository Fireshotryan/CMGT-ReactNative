import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from './ThemeContext';
import { FavoritesContext } from './FavoritesContext';

const EventDetail = ({ route }) => {
  const { event } = route.params || {};
  const { isDarkMode } = useContext(ThemeContext);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const [favoriteStatus, setFavoriteStatus] = useState(false);

  useEffect(() => {
    setFavoriteStatus(isFavorite(event.id));
  }, [isFavorite, event.id]);

  const toggleFavorite = () => {
    if (favoriteStatus) {
      removeFavorite(event.id);
    } else {
      addFavorite(event);
    }
    setFavoriteStatus(!favoriteStatus);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{event?.title}</Text>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{event?.description}</Text>
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteContainer}>
        <Icon name={favoriteStatus ? 'heart' : 'heart-outline'} size={30} color={favoriteStatus ? 'red' : 'black'} />
        <Text style={[styles.favoriteText, { color: favoriteStatus ? 'red' : 'black' }]}>
          {favoriteStatus ? 'Remove from Favorites' : 'Add to Favorites'}
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
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  darkText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  favoriteContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteText: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default EventDetail;
