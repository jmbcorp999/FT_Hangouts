import React, {useEffect, useState} from 'react';
import {initializeDatabase} from './database/Database';
import {NavigationContainer} from '@react-navigation/native';
import BottomTabsNavigator from './navigation/AppNavigator';
import {enableScreens} from 'react-native-screens';
import {ThemeProvider} from './ThemeContext';
import {AppState} from 'react-native';
import Toast from 'react-native-toast-message';
import 'intl-pluralrules';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/fr';
import './locales/i18n';
import {useTranslation} from 'react-i18next';

enableScreens();

export default function App() {
  const {t} = useTranslation();
  const [backgroundTime, setBackgroundTime] = useState(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'background') {
        setBackgroundTime(new Date());
      } else if (nextAppState === 'active' && backgroundTime) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: t('menu.backgrounded'),
          text2: `${backgroundTime.toLocaleTimeString()}`,
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [backgroundTime]);

  return (
    <>
      <ThemeProvider>
        <NavigationContainer>
          <BottomTabsNavigator />
        </NavigationContainer>
      </ThemeProvider>
      <Toast />
    </>
  );
}
