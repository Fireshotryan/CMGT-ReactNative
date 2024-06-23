import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next'; 
import { ThemeContext } from './ThemeContext'; 
import { FavoritesContext } from './FavoritesContext';

const EventDetail = ({ route }) => {
  const { t } = useTranslation();
  const { event } = route.params || {}; 
  const { isDarkMode } = useContext(ThemeContext); 
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const [favoriteStatus, setFavoriteStatus] = useState(false); 

  useEffect(() => {
    // Update favoriet status bij verandering in isFavorite of event.id
    setFavoriteStatus(isFavorite(event.id));
  }, [isFavorite, event.id]);

  // Toggle functie voor toevoegen of verwijderen van favoriet
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
      <Text style={isDarkMode ? styles.darkText : styles.text}>
        {t('location')}: {event?.latitude}, {event?.longitude} 
      </Text>
      <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteContainer}>
        <Icon 
          name={favoriteStatus ? 'heart' : 'heart-outline'}  
          size={30} 
          color={favoriteStatus ? 'red' : (isDarkMode ? '#ffffff' : '#000000')} 
        />
        <Text style={[styles.favoriteText, { color: favoriteStatus ? 'red' : (isDarkMode ? '#ffffff' : '#000000') }]}>
          {favoriteStatus ? t('removeFromFavorites') : t('addToFavorites')} 
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
