import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const user = {
  name: 'testuser',
  avatarUrl: '',
  collected: 24,
  badges: ['Plant', 'Insect'],
};

const realmonDeck = [
  { id: 'r1', name: 'Butterfly', imageUrl: 'https://www.timeforkids.com/wp-content/uploads/2021/04/butterflies.jpg?w=1024', category: 'Insect' },
  { id: 'r2', name: 'Maple Leaf', imageUrl: 'https://plantmegreen.com/cdn/shop/articles/WlG6sR0G59WQFO01fx9fjv3gdrKz5prK1656445268.jpg?crop=center&height=1200&v=1656519572&width=1200', category: 'Plant' },
  { id: 'r3', name: 'Clover', imageUrl: 'https://parade.com/.image/t_share/MTkwNTgxNDU5NDY0MzY1OTQ4/four-leaf-clover-jpg.jpg', category: 'Plant' },
];

const badgeColors = {
  Plant: { backgroundColor: '#bbf7d0' },   // light green
  Insect: { backgroundColor: '#fef9c3' },  // light yellow
};

const badgeIcons = {
  Plant: '🌿',
  Insect: '🦋',
};

const MyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header: Avatar + Name */}
      <View style={styles.header}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarCircle}>
            <Icon name="person" size={36} color="#ffffff" />
          </View>
        )}
        <Text style={styles.username}>{user.name}</Text>

        <View style={styles.stats}>
          <Text style={styles.statText}>🌱 {user.collected} Realmons Collected</Text>
          <Text style={styles.statText}>🏅 {user.badges.length} Badges Earned</Text>
        </View>
      </View>



      {/* Realmon Deck */}
      <Text style={styles.sectionTitle}>Realmon Deck</Text>
      <FlatList
        data={realmonDeck}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.deckList}
        renderItem={({ item }) => (
          <View style={styles.deckCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.deckImage} />
            <Text style={styles.deckName}>{item.name}</Text>
          </View>
        )}
      />

            {/* Badges */}
            <Text style={styles.sectionTitle}>Your Badges</Text>
      <View style={styles.badgeRow}>
        {user.badges.map((b) => (
          <View key={b} style={[styles.badgeCircle, badgeColors[b]]}>
            <Text style={styles.badgeIcon}>{badgeIcons[b]}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#065f46', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 12,
  },
  stats: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  statText: {
    fontSize: 16,
    color: '#374151',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, 
    marginBottom: 24,
  },
  badgeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeIcon: {
    fontSize: 36,
  },
  deckList: {
    gap: 12,
    paddingBottom: 20,
  },
  deckCard: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 12,
  },
  deckImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#ffffff',
  },
  deckName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#065f46',
    textAlign: 'center',
  },
});

export default MyScreen;
