import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function GameScreen({ route }) {
  const { roomId } = route.params;
  const [players, setPlayers] = useState({});
  const [ready, setReady] = useState(false);
  const [scene, setScene] = useState('day');

  useEffect(() => {
    const playersRef = database().ref(`rooms/${roomId}/players`);
    playersRef.on('value', snapshot => {
      setPlayers(snapshot.val());
    });

    const settingsRef = database().ref(`rooms/${roomId}/settings`);
    settingsRef.on('value', snapshot => {
      setScene(snapshot.val().atmosphere);
    });

    return () => {
      playersRef.off();
      settingsRef.off();
    };
  }, [roomId]);

  const toggleReady = () => {
    const userId = auth().currentUser.uid;
    const readyRef = database().ref(`rooms/${roomId}/players/${userId}/ready`);
    readyRef.transaction(prev => !prev);
    setReady(!ready);
  };

  const startGame = () => {
    const allReady = Object.values(players).every(p => p.ready);
    const count = Object.keys(players).length;
    if (allReady && count >= 2) {
      database().ref(`rooms/${roomId}/status`).set('playing');
    }
  };

  return (
    <ImageBackground source={{ uri: getSceneImage(scene) }} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Game Screen</Text>
        <View style={styles.playersList}>
          {Object.keys(players).map(key => (
            <Text key={key}>{players[key].name} - {players[key].ready ? 'Ready' : 'Not Ready'}</Text>
          ))}
        </View>
        <Button title={ready ? 'Unready' : 'Ready'} onPress={toggleReady} />
        <Button title="Start Game" onPress={startGame} />
      </View>
    </ImageBackground>
  );
}

const getSceneImage = (scene) => {
  switch (scene) {
    case 'day':
      return 'https://example.com/day.jpg';
    case 'night':
      return 'https://example.com/night.jpg';
    case 'rainy':
      return 'https://example.com/rainy.jpg';
    case 'fog':
      return 'https://example.com/fog.jpg';
    default:
      return 'https://example.com/default.jpg';
  }
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  playersList: {
    marginBottom: 16,
  },
});
