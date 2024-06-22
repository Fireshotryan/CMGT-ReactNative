import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const FavoritesScreen = ({ favoriteEvents }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites Screen</Text>
      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
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
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
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
});

export default FavoritesScreen;
