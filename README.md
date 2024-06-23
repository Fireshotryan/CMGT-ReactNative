# React Native Event Finder App

This project is a React Native application designed to help users find events near their location. It utilizes various features such as maps, navigation, AsyncStorage for storing favorite events, and internationalization (i18n) for multi-language support.

## Features

- **Navigation**: Utilizes `react-navigation` for seamless navigation between screens.
- **Maps Integration**: Displays events on a map using `react-native-maps` and fetches user's current location using `expo-location`.
- **Theme Support**: Implements dark mode and light mode themes using `ThemeProvider` and `ThemeContext`.
- **Favorites Management**: Allows users to add events to favorites, stored using `AsyncStorage` and managed with `FavoritesContext`.
- **Multi-Language Support**: Supports multiple languages with translations managed through `i18next`.

## Screens

### EventFinder Screen
- Displays a map with markers for events near the user's location.
- Allows navigation to event details and supports adding/removing events from favorites.

### Settings Screen
- Provides options to change app language (English, Dutch, German).
- Includes a toggle for switching between dark mode and light mode.

### Favorites Screen
- Lists events that the user has marked as favorites.
- Allows removing events from favorites directly from the list.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your_username/your_project.git
   cd your_project

2. Install dependencies:
npm install

3. Run the application:
npm start

4. Follow the instructions to run the app on your desired platform (iOS/Android).

### Dependencies
- react, react-native: Core libraries for building the UI.
- @react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/stack: For navigation between screens.
- react-native-maps: To integrate maps and display event locations.
- -expo-location: For fetching the user's current location.
- @react-native-async-storage/async-storage: For storing favorite events locally.
- i18next, react-i18next: For managing translations and multi-language support.
- react-native-vector-icons: Provides icons for the tab navigator.
- react-native-elements: Used for styling and UI components.

### Usage
- Customize and extend the application as per your requirements.
- Add more features such as user authentication, additional settings, or enhanced event details.




# Explanation in Dutch: React Native Event Finder App

Dit project is een React Native-toepassing ontworpen om gebruikers te helpen evenementen in de buurt van hun locatie te vinden. Het maakt gebruik van verschillende functies zoals kaarten, navigatie, AsyncStorage voor het opslaan van favoriete evenementen, en internationalisatie (i18n) voor ondersteuning van meerdere talen.

## Kenmerken

- **Navigatie**: Gebruikt `react-navigation` voor naadloze navigatie tussen schermen.
- **Kaartintegratie**: Toont evenementen op een kaart met behulp van `react-native-maps` en haalt de huidige locatie van de gebruiker op met `expo-location`.
- **Thema-ondersteuning**: Implementeert donkere en lichte thema's met behulp van `ThemeProvider` en `ThemeContext`.
- **Beheer van favorieten**: Stelt gebruikers in staat om evenementen toe te voegen aan favorieten, opgeslagen met `AsyncStorage` en beheerd met `FavoritesContext`.
- **Ondersteuning voor meerdere talen**: Ondersteunt meerdere talen met vertalingen beheerd via `i18next`.

## Schermen

### EventFinder Scherm
- Toont een kaart met markers voor evenementen in de buurt van de locatie van de gebruiker.
- Maakt navigatie naar evenementdetails mogelijk en ondersteunt toevoegen/verwijderen van evenementen aan/uit favorieten.

### Instellingen Scherm
- Biedt opties om de app-taal te wijzigen (Engels, Nederlands, Duits).
- Bevat een schakelaar voor het wisselen tussen donkere modus en lichte modus.

### Favorieten Scherm
- Lijst van evenementen die door de gebruiker als favoriet zijn gemarkeerd.
- Maakt rechtstreeks verwijderen van evenementen uit favorieten vanuit de lijst mogelijk.

## Installatie

1. Kloon de repository:
   ```bash
   git clone https://github.com/your_username/your_project.git
   cd your_project

2. Installeer de afhankelijkheden:
npm install

3. Start de applicatie:
npm run start

4. Volg de instructies om de app te draaien op het gewenste platform (iOS/Android).

## Afhankelijkheden

- react, react-native: Kernbibliotheken voor het bouwen van de UI.
- @react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/stack: Voor navigatie tussen schermen.
- react-native-maps: Voor integratie van kaarten en het tonen van evenementlocaties.
- expo-location: Voor het ophalen van de huidige locatie van de gebruiker.
- @react-native-async-storage/async-storage: Voor lokaal opslaan van favoriete evenementen.
- i18next, react-i18next: Voor het beheren van vertalingen en ondersteuning voor meerdere talen.
- react-native-vector-icons: Biedt pictogrammen voor de tabnavigator.
- react-native-elements: Gebruikt voor styling en UI-componenten.

## Gebruik
- Pas de applicatie aan en breid deze uit naar uw wensen.
- Voeg meer functies toe zoals gebruikersauthenticatie, extra instellingen of uitgebreide evenementdetails.
