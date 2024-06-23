import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import 'intl-pluralrules'; 

// Taal detector configuratie voor i18next
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    // Haal opgeslagen taalvoorkeur op uit AsyncStorage
    const savedDataJson = await AsyncStorage.getItem('user-language');
    const selectLanguage = savedDataJson || (I18nManager.isRTL ? 'ar' : 'en');
    callback(selectLanguage);
  },
  cacheUserLanguage: (lng) => {
    AsyncStorage.setItem('user-language', lng.toString());
  },
};

// Initialisatie van i18next met configuratie en vertalingen
i18n
  .use(languageDetector) 
  .use(initReactI18next) 
  .init({
    fallbackLng: 'en', // Standaardtaal als vertaling niet beschikbaar is
    resources: {
      en: { // Engelse vertalingen
        translation: {
          darkMode: 'Dark Mode',
          favoritesScreen: 'Favorites Screen',
          loadingMap: 'Loading map...',
          noEventsFound: 'No events found or location not available.',
          yes: 'Yes',
          no: 'No',
          addToFavorites: 'Add to Favorites',
          removeFromFavorites: 'Remove from Favorites',
          favorites: 'Favorites',
          settings: 'Settings',
          eventDetail: 'Event Detail',
          location: 'Location',
          noFavoriteEvents: 'No favorite events yet.',
        },
      },
      nl: { // Nederlandse vertalingen
        translation: {
          darkMode: 'Donkere modus',
          favoritesScreen: 'Favorieten scherm',
          loadingMap: 'Kaart laden...',
          noEventsFound: 'Geen evenementen gevonden of locatie niet beschikbaar.',
          yes: 'Ja',
          no: 'Nee',
          addToFavorites: 'Toevoegen aan favorieten',
          removeFromFavorites: 'Verwijderen uit favorieten',
          favorites: 'Favorieten',
          settings: 'Instellingen',
          eventDetail: 'Evenement Detail',
          location: 'Locatie',
          noFavoriteEvents: 'Nog geen favoriete evenementen.',
        },
      },
      de: { // Duitse vertalingen
        translation: {
          darkMode: 'Dunkler Modus',
          favoritesScreen: 'Favoriten Bildschirm',
          loadingMap: 'Karte wird geladen...',
          noEventsFound: 'Keine Veranstaltungen gefunden oder Standort nicht verfügbar.',
          yes: 'Ja',
          no: 'Nein',
          addToFavorites: 'Zu Favoriten hinzufügen',
          removeFromFavorites: 'Aus Favoriten entfernen',
          favorites: 'Favoriten',
          settings: 'Einstellungen',
          eventDetail: 'Veranstaltungsdetail',
          location: 'Ort',
          noFavoriteEvents: 'Keine Lieblingsveranstaltungen vorhanden.',
        },
      },
    },
    interpolation: {
      escapeValue: false, 
    },
    pluralSeparator: '_', 
  });

export default i18n;
