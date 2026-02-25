import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen'
import HomeScreen from './src/screens/HomeScreen';
// import SettingsScreen from './src/screens/Settings';
import AllImagesScreen from './src/screens/AllImagesScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import SelectedProjectScreen from './src/screens/SelectedProjectScreen';
import ShopScreen from './src/screens/ShopScreen';
import ProjectImagesScreen from './src/screens/ProjectImagesScreen';
import ActiveScreen from './src/screens/ActiveScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='welcome'>
        <Stack.Screen
          name="welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="home"
          component={HomeScreen}
        />
        {/* <Stack.Screen
          name="settings"
          component={SettingsScreen}
        /> */}
        <Stack.Screen
          name="allImages"
          component={AllImagesScreen}
        />
        <Stack.Screen
          name="projects"
          component={ProjectsScreen}
        />
        <Stack.Screen
          name="selectedProject"
          component={SelectedProjectScreen}
        />
        <Stack.Screen
          name="shop"
          component={ShopScreen}
        />
        <Stack.Screen
          name="projectImages"
          component={ProjectImagesScreen}
        />
        <Stack.Screen
          name="active"
          component={ActiveScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
