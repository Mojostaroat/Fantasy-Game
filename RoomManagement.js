import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function RoomManagement({ navigation }) {
  const [roomName, setRoomName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [atmosphere, setAtmosphere] = useState('day');
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const roomsRef = database().ref('rooms');
    roomsRef.on('value', snapshot => {
      const data = snapshot.val();
      const roomList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setRooms(roomList);
    });

    return () => roomsRef.off();
  }, []);

  const createRoom = async () => {
    const userId = auth().currentUser.uid;
    const newRoomRef = database().ref('rooms').push();
    await newRoomRef.set({
      host: userId,
      settings: { difficulty, atmosphere },
      players: { [userId]: { name: auth().currentUser.email, ready: false } },
      status: 'waiting'
    });
    setRoomId(newRoomRef.key);
    navigation.navigate('Game', { roomId: newRoomRef.key });
  };

  const joinRoom = async (id) => {
    const userId = auth().currentUser.uid;
    const playerRef = database().ref(`rooms/${id}/players/${userId}`);
    await playerRef.set({ name: auth().currentUser.email, ready: false });
    setRoomId(id);
    navigation.navigate('Game', { roomId: id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Room</Text>
      <TextInput
        style={styles.input}
        placeholder="Room Name"
        value={roomName}
        onChangeText={setRoomName}
      />
      <TextInput
        style={styles.input}
        placeholder="Difficulty"
        value={difficulty}
        onChangeText={setDifficulty}
      />
      <TextInput
        style={styles.input}
        placeholder="Atmosphere"
        value={atmosphere}
        onChangeText={setAtmosphere}
      />
      <Button title="Create Room" onPress={createRoom} />

      <Text style={styles.title}>Join Room</Text>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomItem}>
            <Text>{item.id}</Text>
            <Button title="Join" onPress={() => joinRoom(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  roomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});
