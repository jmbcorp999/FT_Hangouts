/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */

import React, {useState, useEffect, useContext} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import {PERMISSIONS, request} from 'react-native-permissions';
import {fetchContacts} from '../database/Database';
import {useFocusEffect} from '@react-navigation/native';
import {ThemeContext} from '../ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';

const MessagesScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadContacts = async () => {
        try {
          const data = await fetchContacts();
          setContacts(data);
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: t('errors.error'),
            text2: t('errors.getContacts'),
          });
        }
      };

      loadContacts();
    }, []),
  );

  useEffect(() => {
    if (contacts.length === 0) {
      return;
    }

    const requestPermission = async () => {
      try {
        const status = await request(PERMISSIONS.ANDROID.READ_SMS);
        if (status === 'granted') {
          const getMessages = (box: string) =>
            new Promise((resolve, reject) => {
              SmsAndroid.list(
                JSON.stringify({box}),
                (fail: string) => {
                  console.log('Failed with this error: ' + fail);
                  reject(fail);
                },
                (count: any, smsList: string) => {
                  const messages = JSON.parse(smsList);
                  resolve(messages);
                },
              );
            });

          try {
            const [inboxMessages, sentMessages] = await Promise.all([
              getMessages('inbox'),
              getMessages('sent'),
            ]);

            const allMessages = [...inboxMessages, ...sentMessages];

            const contactMap = contacts.reduce((map, contact) => {
              map[contact.phone] = contact;
              return map;
            }, {});

            const relevantMessages = allMessages.filter(msg =>
              contactMap.hasOwnProperty(msg.address),
            );

            relevantMessages.sort(
              (a, b) => parseInt(b.date) - parseInt(a.date),
            );

            const groups = relevantMessages.reduce((acc, msg) => {
              const contact = contactMap[msg.address];
              const id = contact ? contact.phone : msg.address; // Utilisez phone si le contact est trouvé, sinon utilisez address

              (acc[id] = acc[id] || []).push(msg);
              return acc;
            }, {});

            const latestMessages = Object.values(groups).map(group => {
              const contact = contactMap[group[0].address];

              const isSentMessage = sentMessages.includes(group[0]);

              let bodyPreview = group[0].body.substring(0, 30);
              bodyPreview =
                group[0].body.length > 30 ? bodyPreview + '...' : bodyPreview;
              bodyPreview = isSentMessage
                ? `Vous : ${bodyPreview}`
                : bodyPreview;

              return {
                ...group[0],
                contact: contact
                  ? `${contact.firstName} ${contact.lastName}`
                  : group[0].address,
                bodyPreview,
                isSentMessage,
                firstName: contact?.firstName,
                lastName: contact?.lastName,
              };
            });

            setConversations(latestMessages);
          } catch (error) {
            console.log('Failed to get messages:', error);
          }
        } else {
          console.log('Permission denied');
        }
      } catch (error) {
        console.log(`Error in permission request: ${error}`);
      }
    };

    requestPermission();
  }, [contacts]);

  const handlePress = (address: any, firstName: any, lastName: any) => {
    navigation.navigate('ConvScreen', {address, firstName, lastName});
  };

  const convertDate = (item: {date: string}) => {
    const date = new Date(parseInt(item.date));
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handlePress(item.address, item.firstName, item.lastName)}
      style={styles.listItem}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={styles.textBold}>{item.contact}</Text>
          <Text style={styles.text} numberOfLines={1}>
            {item.bodyPreview}
          </Text>
        </View>
        <Text style={[styles.date, {marginLeft: 0}]}>{convertDate(item)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.address}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
};

const getStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    list: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      padding: 10,
      width: '100%',
      justifyContent: 'flex-start',
    },
    text: {
      fontSize: 14,
      marginLeft: 10,
      color: theme === 'dark' ? '#DCDBDB' : '#848383',
    },
    date: {
      fontSize: 12,
      marginLeft: 10,
      color: theme === 'dark' ? 'grey' : 'grey',
    },
    textBold: {
      fontSize: 16,
      marginLeft: 10,
      color: theme === 'dark' ? '#fff' : '#000',
      fontWeight: 'bold',
    },
  });

export default MessagesScreen;
