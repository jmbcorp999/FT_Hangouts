/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {getContactById, deleteContactById} from '../database/Database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../ThemeContext';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

type RootStackParamList = {
  Home: undefined;
  Details: {contactId: string};
  Create: undefined;
  Messages: undefined;
  Edit: {contactId: string};
};

type ScreenDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Details'
>;
type ScreenDetailsRouteProp = RouteProp<RootStackParamList, 'Details'>;

type Props = {
  navigation: ScreenDetailsNavigationProp;
  route: ScreenDetailsRouteProp;
};

const ScreenDetails: React.FC<Props> = ({route, navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [contact, setContact] = useState(null);

  const loadContactDetails = () => {
    getContactById(route.params.contactId)
      .then(data => setContact(data))
      .catch(error =>
        console.error('Erreur lors de la récupération du contact:', error),
      );
  };

  useEffect(() => {
    loadContactDetails();
    const unsubscribe = navigation.addListener('focus', loadContactDetails);
    return () => {
      unsubscribe();
    };
  }, [navigation, route.params.contactId]);

  const handleEdit = () => {
    if (!contact) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('errors.noContactToEdit'),
      });
      return;
    }
    navigation.navigate('Edit', {contactId: contact.id});
  };

  const handleNewMSG = () => {
    if (!contact) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text2: t('errors.noContactSelected'),
      });
      return;
    }

    if (!contact.address) {
      Toast.show({
        type: 'error',
        text1: t('errors.error'),
        text1: t('errors.noAdress'),
      });
      return;
    }

    if (contact && contact.address && contact.firstName && contact.lastName) {
      navigation.navigate('Messages', {
        screen: 'ConvScreen',
        params: {
          address: contact.phone,
          firstName: contact.firstName,
          lastName: contact.lastName,
        },
      });
    } else {
      console.error('Contact or contact properties are undefined');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('messages.confirm'),
      t('messages.confirmDelete'),
      [
        {
          text: t('messages.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('messages.confirm'),
          onPress: () => {
            deleteContactById(contact.id)
              .then(() => {
                Toast.show({
                  type: 'success',
                  text1: t('messages.success'),
                  text2: t('messages.contactDeleted'),
                });
                navigation.goBack();
              })
              .catch(error => {
                console.error(
                  'Erreur lors de la suppression du contact:',
                  error,
                );
                Toast.show({
                  type: 'error',
                  text1: t('errors.error'),
                  text2: t('errors.deleteContact'),
                });
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  if (!contact) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailGroup}>
        <MaterialIcons
          name="person"
          size={24}
          color={theme === 'dark' ? '#fff' : 'gray'}
        />
        <Text style={styles.detailText}>
          {t('contacts.firstName')}: {contact.firstName}
        </Text>
      </View>

      <View style={styles.detailGroup}>
        <MaterialIcons
          name="person-outline"
          size={24}
          color={theme === 'dark' ? '#fff' : 'gray'}
        />
        <Text style={styles.detailText}>
          {t('contacts.lastName')}: {contact.lastName}
        </Text>
      </View>

      <View style={styles.detailGroup}>
        <MaterialIcons
          name="phone"
          size={24}
          color={theme === 'dark' ? '#fff' : 'gray'}
        />
        <Text style={styles.detailText}>
          {t('contacts.phone')}: {contact.phone}
        </Text>
      </View>

      <View style={styles.detailGroup}>
        <MaterialIcons
          name="email"
          size={24}
          color={theme === 'dark' ? '#fff' : 'gray'}
        />
        <Text style={styles.detailText}>
          {t('contacts.email')}: {contact.email}
        </Text>
      </View>

      <View style={styles.detailGroup}>
        <MaterialIcons
          name="location-on"
          size={24}
          color={theme === 'dark' ? '#fff' : 'gray'}
        />
        <Text style={styles.detailText}>
          {t('contacts.adrese')}: {contact.address}
        </Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Ionicons name="pencil" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.SMSButton} onPress={handleNewMSG}>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    deleteButton: {
      position: 'absolute', // Positionnement absolu
      right: 10, // À droite
      top: 120, // En haut
      backgroundColor: theme === 'dark' ? '#BD1313' : 'red', // Couleur de fond
      borderRadius: 30, // Rendre le bouton rond
      width: 50, // Largeur du bouton
      height: 50, // Hauteur du bouton
      justifyContent: 'center', // Centrer l'icône verticalement
      alignItems: 'center', // Centrer l'icône horizontalement
      shadowColor: '#000', // Ombre
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    deleteButtonText: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    editButton: {
      position: 'absolute', // Positionnement absolu
      right: 10, // À droite
      top: 65, // En haut
      backgroundColor: theme === 'dark' ? '#BD8913' : 'orange', // Couleur de fond
      borderRadius: 30, // Rendre le bouton rond
      width: 50, // Largeur du bouton
      height: 50, // Hauteur du bouton
      justifyContent: 'center', // Centrer l'icône verticalement
      alignItems: 'center', // Centrer l'icône horizontalement
      shadowColor: '#000', // Ombre
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    SMSButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      backgroundColor: theme === 'dark' ? '#1BBD13' : 'green',
      borderRadius: 30,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    detailGroup: {
      flexDirection: 'row', // Disposition horizontale
      alignItems: 'center', // Alignement vertical au centre
      marginBottom: 15, // Espacement entre les éléments
      borderBottomWidth: 0.5, // Ligne de séparation
      borderBottomColor: theme === 'dark' ? '#fff' : 'gray', // Couleur de la ligne de séparation
      paddingVertical: 10,
    },
    detailText: {
      marginLeft: 15, // Espacement augmenté entre l'icône et le texte
      fontSize: 16,
      flexShrink: 1, // Permet au texte de se réduire si nécessaire pour s'adapter à la largeur de l'écran
      color: theme === 'dark' ? '#fff' : '#000', // Couleur du texte
    },
  });

export default ScreenDetails;
