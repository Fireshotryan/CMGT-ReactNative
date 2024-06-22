import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import { ThemeContext } from './ThemeContext';
import { FavoritesContext } from './FavoritesContext';

const FavoritesScreen = () => {
  const { t } = useTranslation(); // Use useTranslation hook
  const { isDarkMode } = useContext(ThemeContext);
  const { favoriteEvents, removeFavorite } = useContext(FavoritesContext);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <Text style={isDarkMode ? styles.darkTitle : styles.title}>{t('favoritesScreen')}</Text>
      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.eventContainer, { borderColor: isDarkMode ? '#444' : '#ccc' }]}>
            <View style={styles.eventInfo}>
              <Text style={isDarkMode ? styles.darkEventTitle : styles.eventTitle}>{item.title}</Text>
              <Text style={isDarkMode ? styles.darkEventDescription : styles.eventDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={() => removeFavorite(item.id)}
            >
              <Icon name="heart" size={24} color="gold" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={isDarkMode ? styles.darkEmptyText : styles.emptyText}>{t('noFavoriteEvents')}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  darkTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  darkEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffffff',
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
  },
  darkEventDescription: {
    fontSize: 16,
    color: '#cccccc',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  darkEmptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#cccccc',
  },
  favoriteIcon: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
});

export default FavoritesScreen;
