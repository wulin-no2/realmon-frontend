import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { authFetch } from '../utils/authFetch';

interface RealmonItem {
  speciesId: string;
  speciesName: string;
  speciesImageUrls: string[];
}
const badgeColors: Record<string, any> = {
  PLANT: { backgroundColor: '#bbf7d0' },   // light green
  INSECT: { backgroundColor: '#fef9c3' },  // light yellow
  MAMMAL: { backgroundColor: '#e0f2fe' },
};

const badgeIcons: Record<string, string> = {
  PLANT: '🌿',
  INSECT: '🦋',
  MAMMAL: '🦊',
};

const MyScreen = () => {
  const [user, setUser] = useState({
    id: '',
    username: '',
    avatarUrl: '',
    collected: 0,
    badges: [] as string[],
  });

  const [realmonDeck, setRealmonDeck] = useState<RealmonItem[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user info
        const resUser = await authFetch('/api/user/me');
        const dataUser = await resUser.json();
        console.log('🎯 Realmon Deck:', dataUser);


        // Fetch collection
        const resDeck = await authFetch('/api/user/collected');
        const dataDeck = await resDeck.json();

        console.log('🎯 Realmon Deck:', dataDeck);

        setUser({
          id: dataUser.id,
          username: dataUser.username,
          avatarUrl: dataUser.avatarUrl,
          collected: dataDeck.totalCollected,
          badges: dataDeck.badges || [],
        });

        setRealmonDeck(dataDeck.items || []);

      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, []);

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
        <Text style={styles.username}>{user.username}</Text>

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
        keyExtractor={(item) => item.speciesId}
        contentContainerStyle={styles.deckList}
        renderItem={({ item }) => (
          <View style={styles.deckCard}>
            <Image 
              source={{ uri: item.speciesImageUrls?.[0] || 'https://placehold.co/100x100' }}
              style={styles.deckImage} 
            />
            <Text style={styles.deckName}>{item.speciesName}</Text>
          </View>
        )}
      />

            {/* Badges */}
            <Text style={styles.sectionTitle}>Your Badges</Text>
      <View style={styles.badgeRow}>
        {user.badges.map((b) => (
          <View key={b} style={[styles.badgeCircle, badgeColors[b] || {backgroundColor: '#e5e7eb'}]}>
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
