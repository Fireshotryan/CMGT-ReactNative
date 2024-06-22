import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = () => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  useEffect(() => {
    // Load favorite events from AsyncStorage on component mount
    loadFavoriteEvents();
  }, []);

  const loadFavoriteEvents = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteEvents');
      if (storedFavorites !== null) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavoriteEvents(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorite events:', error);
    }
  };

  const removeFavoriteEvent = async (eventId) => {
    try {
      let updatedFavorites = favoriteEvents.filter(event => event.id !== eventId);
      setFavoriteEvents(updatedFavorites);
      await AsyncStorage.setItem('favoriteEvents', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite event:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites Screen</Text>
      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={() => removeFavoriteEvent(item.id)}
            >
              <Icon name="heart" size={24} color="gold" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorite events yet.</Text>}
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
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
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
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  favoriteIcon: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
});

export default FavoritesScreen;
