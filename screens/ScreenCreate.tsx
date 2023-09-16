import React, {useState, useContext} from 'react';
import {View, TextInput, Button, StyleSheet, ScrollView} from 'react-native';
import {createContact} from '../database/Database';
import {ThemeContext} from '../ThemeContext';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

const CreateScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const isValidInput = input => {
    const regex = /^[a-zA-Z0-9- ]*$/;
    return regex.test(input);
  };

  const handleSubmit = () => {
    if (!firstName || !lastName || !phone || !email || !address) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('errors.allFields'),
      });
      return;
    }
    if (!/^\+?\d+$/.test(phone)) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('errors.phoneFormat'),
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('errors.emailFormat'),
      });
      return;
    }
    if (
      !isValidInput(firstName) ||
      !isValidInput(lastName) ||
      !isValidInput(address)
    ) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('errors.invalidCharacters'),
      });
      return;
    }

    const newContact = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      address: address,
    };

    createContact(newContact)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: t('messages.success'),
          text2: t('messages.contactSaved'),
        });
        navigation.goBack();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: t('errors.error'),
          text2: t('errors.createContact'),
        });
        console.error("Erreur d'ajout de contact:", error);
      });
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <TextInput
          placeholder={t('contacts.firstName')}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#000'}
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder={t('contacts.lastName')}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#000'}
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder={t('contacts.phone')}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#000'}
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
        <TextInput
          placeholder={t('contacts.email')}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#000'}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder={t('contacts.adrese')}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#000'}
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
        <Button title={t('contacts.save')} onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    scroll: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    input: {
      borderBottomWidth: 1,
      marginBottom: 10,
      padding: 8,
      color: theme === 'dark' ? '#fff' : '#000',
    },
  });

export default CreateScreen;
