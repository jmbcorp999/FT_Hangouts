/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import SmsAndroid from 'react-native-get-sms-android';
import {PERMISSIONS, request} from 'react-native-permissions';
import {ThemeContext} from '../ThemeContext';
import SmsListener from 'react-native-android-sms-listener';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const fetchMessages = async (address: any) => {
  try {
    const status = await request(PERMISSIONS.ANDROID.READ_SMS);
    if (status === 'granted') {
      const getMessages = (box: string) =>
        new Promise((resolve, reject) => {
          SmsAndroid.list(
            JSON.stringify({box, address}),
            (fail: any) => reject(fail),
            (count: any, smsList: string) => {
              const messages = JSON.parse(smsList);
              resolve(messages);
            },
          );
        });

      const [inboxMessages, sentMessages] = await Promise.all([
        getMessages('inbox'),
        getMessages('sent'),
      ]);

      const allMessages = [
        ...inboxMessages.map((msg: any) => ({...msg, isSent: false})),
        ...sentMessages.map((msg: any) => ({...msg, isSent: true})),
      ];

      return allMessages
        .sort((a, b) => parseInt(a.date) - parseInt(b.date))
        .reverse();
    } else {
      console.log('Permission denied');
    }
  } catch (error) {
    console.log(`Error in permission request: ${error}`);
  }
  return [];
};

const ConvScreen = () => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const route = useRoute();
  const {address, lastName, firstName} = route.params;

  useEffect(() => {
    console.log(route.params);
    const loadMessages = async () => {
      try {
        const msgs = await fetchMessages(address);
        setMessages(msgs.sort((a, b) => parseInt(b.date) - parseInt(a.date)));
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
      }
    };

    loadMessages();

    console.log('Setting up listener...');
    const subscription = SmsListener.addListener(
      (message: {originatingAddress: any; body: any}) => {
        console.log('SMS reçu:', message);
        setMessages(prevMessages => [
          {
            address: message.originatingAddress,
            body: message.body,
            date: Date.now().toString(),
            isSent: false,
            _id: Math.random().toString(),
          },
          ...prevMessages,
        ]);
        console.log('Listener set up.');
      },
    );

    return () => {
      subscription.remove();
    };
  }, [address]);

  const sendSMS = async () => {
    try {
      const status = await request(PERMISSIONS.ANDROID.SEND_SMS);
      if (status === 'granted') {
        SmsAndroid.autoSend(
          address,
          inputText,
          (fail: string) => {
            console.log('Failed with this error: ' + fail);
          },
          () => {
            console.log('SMS sent successfully');
            setMessages(prevMessages => [
              {
                body: inputText,
                date: Date.now().toString(),
                isSent: true,
                _id: Math.random().toString(),
              },
              ...prevMessages,
            ]);
            setInputText('');
          },
        );
      } else {
        console.log('Permission to send SMS denied');
      }
    } catch (error) {
      console.log(`Failed to request permission: ${error}`);
    }
  };

  const renderItem = ({item}) => {
    const date = new Date(parseInt(item.date, 10));
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    return (
      <View
        style={[styles.message, item.isSent ? styles.sent : styles.received]}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.text}>{item.body}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>
        {t('messages.convWith')} {firstName} {lastName} ({address})
      </Text>
      <FlatList
        data={messages}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('messages.typeSMS')}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#555'}
        />
        <TouchableOpacity style={styles.sendSMS} onPress={sendSMS}>
          <Ionicons name="send-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    nameText: {
      fontSize: 12,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    text: {
      color: theme === 'dark' ? '#fff' : '#000',
    },
    message: {
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      maxWidth: '70%',
    },
    sent: {
      alignSelf: 'flex-end',
      backgroundColor: theme === 'dark' ? '#2E5A2C' : '#84FF80',
    },
    received: {
      alignSelf: 'flex-start',
      backgroundColor: theme === 'dark' ? '#2C325A' : '#697DD8',
    },
    dateText: {
      fontSize: 10,
      color: theme === 'dark' ? '#aaa' : '#555',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    input: {
      flex: 1,
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme === 'dark' ? '#444' : '#f0f0f0',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    sendSMS: {
      backgroundColor: theme === 'dark' ? '#0D8D09' : 'green',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ConvScreen;
