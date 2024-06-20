import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext'; // Import ThemeContext

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <Text style={isDarkMode ? styles.darkText : styles.text}>Dark Mode</Text>
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

export default SettingsScreen;
