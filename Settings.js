import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n'; 
import { ThemeContext } from './ThemeContext'; 

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Gebruik de context voor thema

  // Functie om de taal van de app te veranderen
  const changeLanguage = async (language) => {
    await AsyncStorage.setItem('user-language', language);
    i18n.changeLanguage(language); // Update de taal direct in i18next
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }]}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{t('settings')}</Text>
      <TouchableOpacity onPress={() => changeLanguage('en')}>
        <Text style={isDarkMode ? styles.darkText : styles.text}>Engels</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('nl')}>
        <Text style={isDarkMode ? styles.darkText : styles.text}>Nederlands</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLanguage('de')}>
        <Text style={isDarkMode ? styles.darkText : styles.text}>Duits</Text>
      </TouchableOpacity>
      <Text style={isDarkMode ? styles.darkText : styles.text}>{t('darkMode')}</Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
      />
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
});

export default SettingsScreen;