import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { ThemeProvider, ThemeContext } from './ThemeContext'; // Import ThemeContext
import SettingsScreen from './Settings'; // Import ThemeContext

const Tab = createBottomTabNavigator();

export default function App() {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Settings') {
                iconName = 'settings';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: useContext(ThemeContext).isDarkMode ? 'purple' : 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: useContext(ThemeContext).isDarkMode ? '#000' : '#fff',
            },
            headerStyle: {
              backgroundColor: useContext(ThemeContext).isDarkMode ? '#000' : '#fff',
            },
            headerTintColor: useContext(ThemeContext).isDarkMode ? '#fff' : '#000',
          })}
        >
          <Tab.Screen name="Home" options={{ title: 'Home' }}>
            {() => (
              <HomeScreen events={events} location={location} loading={loading} errorMsg={errorMsg} />
            )}
          </Tab.Screen>
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const HomeScreen = ({ events, location, loading, errorMsg }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <MapViewComponent events={events} location={location} loading={loading} errorMsg={errorMsg} />
    </View>
  );
};

const MapViewComponent = ({ events, location, loading, errorMsg }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.mapContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
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
                      description={event.description}
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
      <StatusBar style="auto" />
    </View>
  );
};

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
    color: '#000',
    fontSize: 18,
    marginBottom: 10,
  },
  darkText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});
