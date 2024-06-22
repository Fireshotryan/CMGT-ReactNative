import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import SettingsScreen from './Settings';
import FavoritesScreen from './Favorites';
import EventDetail from './EventDetail';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { LogBox } from 'react-native';
import { FavoritesProvider } from './FavoritesContext';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const EventFinderStack = ({ favoriteEvents, setFavoriteEvents }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
        initialParams={{ favoriteEvents, setFavoriteEvents }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ 
          title: 'Event Detail',
          headerStyle: {
            backgroundColor: useContext(ThemeContext).isDarkMode ? '#121212' : '#f8f8f8',
          },
          headerTintColor: useContext(ThemeContext).isDarkMode ? '#ffffff' : '#000000',
        }}
        initialParams={{ favoriteEvents, setFavoriteEvents }}
      />
    </Stack.Navigator>
  );
};

const HomeScreen = ({ navigation, route }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://stud.hosted.hr.nl/1052755/events.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        if (data && Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
        } else {
          console.warn('No events found in the API response or events array is empty');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMsg('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        console.error('Error getting current location:', error);
        setErrorMsg('Error getting current location');
      }
    })();
  }, []);

  useEffect(() => {
    console.log('Events:', events);
    console.log('Location:', location);
  }, [events, location]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <MapViewComponent
        events={events}
        location={location}
        loading={loading}
        errorMsg={errorMsg}
        navigation={navigation}
      />
    </View>
  );
};

const MapViewComponent = ({ events, location, loading, errorMsg, navigation }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigateToDetail = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleYes = () => {
    closeModal();
    navigation.navigate('EventDetail', { event: selectedEvent });
  };

  return (
    <View style={[styles.mapContainer, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      {loading ? (
        <Text style={isDarkMode ? styles.darkText : styles.text}>Loading map...</Text>
      ) : (
        <>
          {errorMsg ? (
            <Text style={isDarkMode ? styles.darkText : styles.text}>{errorMsg}</Text>
          ) : (
            <>
              {location && events.length > 0 ? (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {events.map(event => (
                    <Marker
                      key={event.id}
                      coordinate={{
                        latitude: event.latitude,
                        longitude: event.longitude,
                      }}
                      title={event.title}
                      onPress={() => navigateToDetail(event)}
                    />
                  ))}
                </MapView>
              ) : (
                <Text style={isDarkMode ? styles.darkText : styles.text}>No events found or location not available.</Text>
              )}
            </>
          )}
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalView, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
            <Text style={isDarkMode ? styles.darkText : styles.text}>{selectedEvent?.title}</Text>
            <Text style={isDarkMode ? styles.darkText : styles.text}>{selectedEvent?.description}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={handleYes}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'red' }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function App() {
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  useEffect(() => {
    // Retrieve favorite events from AsyncStorage on app startup
    const retrieveFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteEvents');
        if (storedFavorites !== null) {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavoriteEvents(parsedFavorites);
        }
      } catch (error) {
        console.error('Error retrieving favorites from AsyncStorage:', error);
      }
    };

    retrieveFavorites();
  }, []);

  return (
    <FavoritesProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'EventFinder') {
                  iconName = 'home';
                } else if (route.name === 'Settings') {
                  iconName = 'settings';
                } else if (route.name === 'Favorites') {
                  iconName = 'heart';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: useContext(ThemeContext).isDarkMode ? 'purple' : 'tomato',
              tabBarInactiveTintColor: 'gray',
              tabBarStyle: {
                backgroundColor: useContext(ThemeContext).isDarkMode ? '#121212' : '#ffffff',
              },
              headerStyle: {
                backgroundColor: useContext(ThemeContext).isDarkMode ? '#121212' : '#f8f8f8',
              },
              headerTintColor: useContext(ThemeContext).isDarkMode ? '#ffffff' : '#000000',
            })}
          >
            <Tab.Screen name="EventFinder">
              {() => <EventFinderStack favoriteEvents={favoriteEvents} setFavoriteEvents={setFavoriteEvents} />}
            </Tab.Screen>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            <Tab.Screen name="Favorites">
              {() => <FavoritesScreen favoriteEvents={favoriteEvents} />}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },
});
