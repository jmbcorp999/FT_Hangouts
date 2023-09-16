import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/ScreenHome';
import MessagesScreen from '../screens/ScreenMessages';
import SettingsScreen from '../screens/ScreenSettings';
import CreateScreen from '../screens/ScreenCreate';
import DetailsScreen from '../screens/ScreenDetails';
import EditScreen from '../screens/ScreenEdit';
import ConvScreen from '../screens/ScreenConv'; // Ajustez le chemin en fonction de l'emplacement de votre fichier
import {RouteProp, ParamListBase} from '@react-navigation/native';
import {ColorValue} from 'react-native';

import {ThemeContext} from '../ThemeContext';
import {useTranslation} from 'react-i18next';

const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {

  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Create" component={CreateScreen} />
      <HomeStack.Screen name="Edit" component={EditScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const MessagesStack = createStackNavigator();

function MessagesStackNavigator() {
  return (
    <MessagesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MessagesStack.Screen name="MessagesTab" component={MessagesScreen} />
      <MessagesStack.Screen name="ConvScreen" component={ConvScreen} />
    </MessagesStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingsStack.Screen name="SettingsTab" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

const TabBarIcon = (
  route: RouteProp<ParamListBase, string>,
  focused: boolean,
  color: number | ColorValue | undefined,
  size: number | undefined,
) => {
  let iconName;
  if (route.name === 'Contacts') {
    iconName = focused ? 'contacts' : 'contacts';
  } else if (route.name === 'Messages') {
    iconName = focused ? 'message1' : 'message1';
  } else if (route.name === 'Settings') {
    iconName = focused ? 'setting' : 'setting';
  }

  return <AntDesign name={iconName} size={size} color={color} />;
};

function BottomTabsNavigator() {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);

  const tabBarStyle = {
    backgroundColor: theme === 'dark' ? 'black' : '#fff',
  };
  const activeTintColor = theme === 'dark' ? '#fff' : 'tomato';
  const inactiveTintColor = theme === 'dark' ? '#aaa' : 'gray';

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) =>
          TabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: [tabBarStyle, {display: 'flex'}, null],
      })}>
      <Tab.Screen
        name="Contacts"
        component={HomeStackNavigator}
        options={{
          title: t('menu.contacts'),
          headerStyle: {
            backgroundColor: theme === 'dark' ? 'black' : '#fff',
          },
          headerTintColor: theme === 'dark' ? '#fff' : '#000',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStackNavigator}
        options={{
          title: t('menu.messages'),
          headerStyle: {
            backgroundColor: theme === 'dark' ? 'black' : '#fff',
          },
          headerTintColor: theme === 'dark' ? '#fff' : '#000',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          title: t('menu.settings'),
          headerStyle: {
            backgroundColor: theme === 'dark' ? 'black' : '#fff',
          },
          headerTintColor: theme === 'dark' ? '#fff' : '#000',
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabsNavigator;
