import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NavigationContainer, useNavigation, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import SettingsScreen from './Settings';
import FavoritesScreen from './Favorites';
import EventDetail from './EventDetail';
import i18n from './i18n';
import { LogBox } from 'react-native';
import { FavoritesProvider } from './FavoritesContext';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const Tab = createBottomTabNavigator(); // Bottom Tab Navigator
const Stack = createStackNavigator(); // Stack Navigator

// Stack Navigator voor de EventFinder
const EventFinderStack = ({ favoriteEvents, setFavoriteEvents }) => {
  const isFocused = useIsFocused();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen} // HomeScreen als component
        options={{ headerShown: false }} // Verberg de header
        initialParams={{ favoriteEvents, setFavoriteEvents }} // Initiale parameters doorgeven
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail} 
        options={{ 
          title: i18n.t('eventDetail'), // Titel instellen vanuit vertalingen
          headerStyle: {
            backgroundColor: useContext(ThemeContext).isDarkMode ? '#121212' : '#f8f8f8', 
          },
          headerTintColor: useContext(ThemeContext).isDarkMode ? '#ffffff' : '#000000', 
        }}
        initialParams={{ favoriteEvents, setFavoriteEvents }} // Initiale parameters doorgeven
      />
    </Stack.Navigator>
  );
};

// HomeScreen component
const HomeScreen = ({ navigation, route }) => {
  const { isDarkMode } = useContext(ThemeContext); // Themacontext gebruiken
  const [loading, setLoading] = useState(true); // Laadstatus van gegevens
  const [events, setEvents] = useState([]); // Lijst van evenementen
  const [location, setLocation] = useState(null); // Huidige locatie
  const [errorMsg, setErrorMsg] = useState(null); // Foutmelding

  useEffect(() => {
    // Functie om gegevens op te halen
    const fetchData = async () => {
      try {
        const response = await fetch('https://stud.hosted.hr.nl/1052755/event.json'); // API voor evenementen ophalen
        if (!response.ok) {
          throw new Error('Failed to fetch data'); 
        }
        const data = await response.json(); // Gegevens omzetten naar JSON
        console.log('Fetched data:', data); 
        if (data && Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events); // Evenementen instellen als er gegevens zijn
        } else {
          console.warn('No events found in the API response or events array is empty'); 
        }
      } catch (error) {
        console.error('Error fetching events:', error); 
        setErrorMsg('Failed to fetch events. Please try again later.'); 
      } finally {
        setLoading(false); // Laden voltooid
      }
    };

    fetchData(); // Gegevens ophalen

    // Toestemming vragen en huidige locatie ophalen
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); // Toestemming vragen voor locatie
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied'); // Toestemming geweigerd
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({}); // Huidige locatie ophalen
        setLocation(location); // Locatie instellen
      } catch (error) {
        console.error('Error getting current location:', error); // Fout bij het ophalen van huidige locatie
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

// Component voor kaartweergave
const MapViewComponent = ({ events, location, loading, errorMsg, navigation }) => {
  const { isDarkMode } = useContext(ThemeContext); 
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 

  // Navigeer naar detailscherm van evenement
  const navigateToDetail = (event) => {
    setSelectedEvent(event); 
    setModalVisible(true); 
  };

  // Modaal venster sluiten
  const closeModal = () => {
    setModalVisible(false);
  };

  // Actie voor 'Ja' knop
  const handleYes = () => {
    closeModal(); // Modaal venster sluiten
    navigation.navigate('EventDetail', { event: selectedEvent }); 
  };

  return (
    <View style={[styles.mapContainer, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      {loading ? ( // Laden bezig
        <Text style={isDarkMode ? styles.darkText : styles.text}>{i18n.t('loadingMap')}</Text>
      ) : (
        <>
          {errorMsg ? ( // Foutmelding aanwezig
            <Text style={isDarkMode ? styles.darkText : styles.text}>{errorMsg}</Text>
          ) : (
            <>
              {location && events.length > 0 ? ( // Locatie en evenementen aanwezig
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  showsUserLocation={true} // Display user's location
                  followsUserLocation={true} // Adjust map region to follow user's location
                >
                  {events.map(event => (
                    <Marker
                      key={event.id}
                      coordinate={{
                        latitude: event.latitude,
                        longitude: event.longitude,
                      }}
                      title={event.title}
                      onPress={() => navigateToDetail(event)} // Druk op marker om naar detailscherm te navigeren
                    />
                  ))}
                </MapView>
              ) : (
                <Text style={isDarkMode ? styles.darkText : styles.text}>{i18n.t('noEventsFound')}</Text> // Geen evenementen gevonden
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
                onPress={handleYes} // Actie voor 'Ja' knop
                >
                  <Text style={styles.buttonText}>{i18n.t('yes')}</Text> 
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: 'red' }]}
                  onPress={closeModal} // Actie voor 'Nee' knop
                >
                  <Text style={styles.buttonText}>{i18n.t('no')}</Text> 
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  // Hoofdcomponent App
  export default function App() {
    const [favoriteEvents, setFavoriteEvents] = useState([]); 
    const [languageChanged, setLanguageChanged] = useState(false); 
  
    useEffect(() => {
      // Haal favoriete evenementen op bij het starten van de app
      const retrieveFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favoriteEvents'); // Favoriete evenementen uit AsyncStorage ophalen
          if (storedFavorites !== null) {
            const parsedFavorites = JSON.parse(storedFavorites); // Favoriete evenementen parsen
            setFavoriteEvents(parsedFavorites); // Favoriete evenementen instellen
          }
        } catch (error) {
          console.error('Error retrieving favorites from AsyncStorage:', error); // Fout bij het ophalen van favoriete evenementen
        }
      };
  
      retrieveFavorites(); 
    }, []); 
  
    // op taalverandering om opnieuw te renderen
    useEffect(() => {
      const onLanguageChange = () => {
        setLanguageChanged(prev => !prev); // Toggle state om opnieuw te renderen
      };
  
      i18n.on('languageChanged', onLanguageChange); 
  
      return () => {
        i18n.off('languageChanged', onLanguageChange); 
      };
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
                    iconName = 'home'; // Pictogram voor 'Home'
                  } else if (route.name === 'Settings') {
                    iconName = 'settings'; // Pictogram voor 'Instellingen'
                  } else if (route.name === 'Favorites') {
                    iconName = 'heart'; // Pictogram voor 'Favorieten'
                  }
                  return <Icon name={iconName} size={size} color={color} />; // Icon component met dynamische eigenschappen
                },
                tabBarActiveTintColor: useContext(ThemeContext).isDarkMode ? 'purple' : 'tomato', // Actieve kleur voor tabbladbalk
                tabBarInactiveTintColor: 'gray', 
                tabBarStyle: {
                  backgroundColor: useContext(ThemeContext).isDarkMode ? '#121212' : '#ffffff', // Achtergrondkleur tabbladbalk
                },
                headerStyle: {
                  backgroundColor: useContext(ThemeContext).isDarkMode ? '#121212' : '#f8f8f8', // Achtergrondkleur header
                },
                headerTintColor: useContext(ThemeContext).isDarkMode ? '#ffffff' : '#000000', // Tekstkleur header
                tabBarLabel: ({ focused, color }) => {
                  const routeName = route.name; 
                  let label;
                  switch (routeName) {
                    case 'EventFinder':
                      label = i18n.t('eventFinder'); 
                      break;
                    case 'Settings':
                      label = i18n.t('settings'); 
                      break;
                    case 'Favorites':
                      label = i18n.t('favorites'); 
                      break;
                    default:
                      label = routeName; 
                  }
                  return <Text style={{ color }}>{label}</Text>; // Tekstcomponent met dynamische kleur
                },
              })}
              key={languageChanged ? 'languageChanged' : 'noChange'} // Sleutel om opnieuw te renderen bij taalverandering
            >
              <Tab.Screen name="EventFinder">
                {() => <EventFinderStack favoriteEvents={favoriteEvents} setFavoriteEvents={setFavoriteEvents} />} 
              </Tab.Screen>
              <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: i18n.t('settings') }} /> 
              <Tab.Screen name="Favorites">
                {() => <FavoritesScreen favoriteEvents={favoriteEvents} />} 
              </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </FavoritesProvider>
    );
  }
  
  // Stijlen voor componenten
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
  