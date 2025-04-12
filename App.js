import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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
