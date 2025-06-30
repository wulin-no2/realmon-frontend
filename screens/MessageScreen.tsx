import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const messages = [
  {
    id: '1',
    icon: 'leaf-outline',
    title: 'Daily Quest Available!',
    content: 'Try spotting a butterfly nearby!',
    time: '1h ago',
  },
  {
    id: '2',
    icon: 'location-outline',
    title: 'New Realmon Spotted!',
    content: '🦊 Someone found a red fox near Eyre Square.',
    time: '2h ago',
  },
  {
    id: '3',
    icon: 'trophy-outline',
    title: 'Badge Earned!',
    content: '🏅 You just unlocked the Insect Explorer badge!',
    time: 'Yesterday',
  },
  {
    id: '4',
    icon: 'cloudy-outline',
    title: 'Rainy Weather Quest!',
    content: 'Perfect time for a weather challenge 🌧️',
    time: '2 days ago',
  },
];

const MessageScreen = () => {
  return (
    <FlatList
      style={styles.container}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name={item.icon} size={24} color="#059669" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  card: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: '#374151',
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default MessageScreen;
