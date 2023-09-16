import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import {ThemeContext} from '../ThemeContext';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';
import i18n from '../locales/i18n';
import Icon from 'react-native-ico-flags';

const SettingsScreen = () => {
  const {t} = useTranslation();
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    Toast.show({
      type: 'success',
      text1: t('settings.success'),
      text2: t('settings.language_changed'),
    });
  };

  const requestPermissions = () => {
    request(PERMISSIONS.ANDROID.READ_SMS).then(response => {
      console.log(response);
    });
    request(PERMISSIONS.ANDROID.SEND_SMS).then(response => {
      console.log(response);
    });
    Toast.show({
      type: 'success',
      text1: t('messages.success'),
      text2: t('messages.permissions'),
    });
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkTheme]}>
      <TouchableOpacity style={styles.button} onPress={requestPermissions}>
        <Text style={styles.buttonText}>{t('settings.checkPermissions')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleTheme}>
        <Text style={styles.buttonText}>{t('settings.switchTheme')}</Text>
      </TouchableOpacity>
      <View style={styles.languageContainer}>
        <Text style={styles.languageTitle}>
          {t('settings.select_language')}
        </Text>
        <View style={styles.flagsContainer}>
          <TouchableOpacity
            onPress={() => changeLanguage('en')}
            style={styles.flagContainer}>
            <View style={styles.flagButton}>
              <Icon name="united-kingdom" style={styles.flagIcon} />
            </View>
            <Text
              style={[
                styles.languageOption,
                language === 'en' && styles.languageOptionSelected,
              ]}>
              English
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeLanguage('fr')}
            style={styles.flagContainer}>
            <View style={styles.flagButton}>
              <Icon name="france" style={styles.flagIcon} />
            </View>
            <Text
              style={[
                styles.languageOption,
                language === 'fr' && styles.languageOptionSelected,
              ]}>
              Français
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  flagContainer: {
    alignItems: 'center',
    width: '45%',
  },
  flagButton: {
    alignItems: 'center',
  },
  flagIcon: {
    fontSize: 50,
  },
  languageContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#6200ea',
  },
  languageTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  languageOption: {
    fontSize: 14,
    marginVertical: 5,
    color: 'white',
  },
  languageOptionSelected: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkTheme: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;
