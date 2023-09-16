/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {getContactById, updateContactById} from '../database/Database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

type RootStackParamList = {
  Home: undefined;
  Details: {contactId: string};
  Create: undefined;
  Messages: undefined;
};

type ScreenEditNavigationProp = StackNavigationProp<RootStackParamList, 'Edit'>;
type ScreenEditRouteProp = RouteProp<RootStackParamList, 'Edit'>;

type Props = {
  navigation: ScreenEditNavigationProp;
  route: ScreenEditRouteProp;
};

const ScreenEdit: React.FC<Props> = ({route, navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [contact, setContact] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const loadContact = () => {
    getContactById(route.params.contactId)
      .then(data => {
        setContact(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone);
        setEmail(data.email);
        setAddress(data.address);
      })
      .catch(error =>
        Toast.show({
          type: 'error',
          text1: t('errors.error'),
          text2: t('errors.getContact'),
        }),
      );
  };

  useEffect(() => {
    loadContact();
    const unsubscribe = navigation.addListener('focus', loadContact);
    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.contactId]);

  const isValidInput = input => {
    const regex = /^[a-zA-Z0-9- ]*$/;
    return regex.test(input);
  };

  const handleSave = () => {
    if (!contact) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('errors.NoContactToUpdate'),
      });
      return;
    }
    const updatedContact = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      address: address,
    };
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

    updateContactById(contact.id, updatedContact)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: t('messages.success'),
          text2: t('messages.updated'),
        });
        navigation.goBack();
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: t('errors.error'),
          text2: t('errors.updateContact'),
        });
      });
  };

  if (!contact) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.detailGroup}>
          <MaterialIcons name="person" size={24} color="gray" />
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t('contacts.firstName')}
            style={styles.input}
          />
        </View>

        <View style={styles.detailGroup}>
          <MaterialIcons name="person-outline" size={24} color="gray" />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder={t('contacts.lastName')}
            style={styles.input}
          />
        </View>

        <View style={styles.detailGroup}>
          <MaterialIcons name="phone" size={24} color="gray" />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder={t('contacts.phone')}
            style={styles.input}
          />
        </View>

        <View style={styles.detailGroup}>
          <MaterialIcons name="email" size={24} color="gray" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('contacts.email')}
            style={styles.input}
          />
        </View>

        <View style={styles.detailGroup}>
          <MaterialIcons name="location-on" size={24} color="gray" />
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder={t('contacts.adrese')}
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    scroll: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === 'dark' ? '#333' : '#fff', // Appliquer le thème ici
    },
    saveButton: {
      backgroundColor: theme === 'dark' ? '#0D8D09' : 'green',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    detailGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      borderBottomColor: 'gray',
      paddingVertical: 10,
    },
    detailText: {
      marginLeft: 15,
      fontSize: 16,
      flexShrink: 1,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    input: {
      flex: 1,
      marginLeft: 15,
      fontSize: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: theme === 'dark' ? '#fff' : 'gray',
      color: theme === 'dark' ? '#fff' : '#000',
    },
  });

export default ScreenEdit;
