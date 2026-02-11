import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';

export default function App() {

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='welcome'>
        <Stack.Screen
          name="welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="login"
        />
        <Stack.Screen
          name="home"
        />
        <Stack.Screen
          name="settings"
        />
        <Stack.Screen
          name="allImages"
        />
        <Stack.Screen
          name="projects"
        />
        <Stack.Screen
          name="selectedProject"
        />
        <Stack.Screen
          name="shop"
        />
        <Stack.Screen
          name="projectImages"
        />
        <Stack.Screen
          name="active"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
