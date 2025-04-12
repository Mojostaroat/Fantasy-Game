import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import LoginScreen from './LoginScreen';
import RoomManagement from './RoomManagement';
import GameScreen from './GameScreen';

const app = initializeApp(firebaseConfig);

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RoomManagement" component={RoomManagement} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    textAlign : 'center',
    textTransform : 'uppercase',
    
  },
  middle: {
    flex: 0.2,
    height: 100,
    backgroundColor: 'grey',
    borderWidth : 5,
    margin : 10
  },
  under: {
    flex: 0.2,
    height: 100,
    backgroundColor: 'green',
    borderWidth : 5,
    margin : 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
