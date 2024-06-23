import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n'; 
import { ThemeContext } from './ThemeContext'; 

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use context for theme

  // Function to change the app's language
  const changeLanguage = async (language) => {
    await AsyncStorage.setItem('user-language', language);
    i18n.changeLanguage(language); // Update the language directly in i18next
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{t('settings')}</Text>
      <TouchableOpacity 
        style={[styles.button, { borderColor: isDarkMode ? '#ffffff' : '#000000' }]} 
        onPress={() => changeLanguage('en')}
      >
        <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, { borderColor: isDarkMode ? '#ffffff' : '#000000' }]} 
        onPress={() => changeLanguage('nl')}
      >
        <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>Nederlands</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, { borderColor: isDarkMode ? '#ffffff' : '#000000' }]} 
        onPress={() => changeLanguage('de')}
      >
        <Text style={isDarkMode ? styles.darkButtonText : styles.buttonText}>Deutsch</Text>
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        <Text style={isDarkMode ? styles.darkText : styles.text}>{t('darkMode')}</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
        />
      </View>
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
  },
  darkButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default SettingsScreen;
