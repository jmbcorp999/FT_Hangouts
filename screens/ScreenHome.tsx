import React, {useState, useEffect, useContext} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {fetchContacts} from '../database/Database';
import {ThemeContext} from '../ThemeContext';
import {useTranslation} from 'react-i18next';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [contacts, setContacts] = useState([]);

  const loadContacts = () => {
    fetchContacts()
      .then(data => setContacts(data))
      .catch(error =>
        console.log(`Error fetching contacts from database: ${error}`),
      );
  };

  useEffect(() => {
    loadContacts();
    const unsubscribe = navigation.addListener('focus', loadContacts);
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              navigation.navigate('Details', {contactId: item.id.toString()})
            }>
            <View style={styles.avatar} />
            <Text style={styles.nameText}>
              {item.firstName} {item.lastName} ({item.phone})
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Create')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      padding: 15,
      width: '100%',
      justifyContent: 'flex-start',
    },
    nameText: {
      fontSize: 16,
      marginLeft: 20,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'skyblue',
    },
    floatingButton: {
      position: 'absolute',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 30,
      borderRadius: 30,
      backgroundColor: 'skyblue',
      elevation: 8,
    },
    buttonText: {
      fontSize: 36,
      color: 'white',
    },
  });

export default HomeScreen;
