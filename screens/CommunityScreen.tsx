import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../config/api';
import { authFetch } from '../utils/authFetch';

type CommunityItem = {
  id: string;
  user: string;
  time: string;
  message: string;
  image: string;
} | {
  id: number;
  username: string;
  avatarUrl: string;
  speciesIcon: string;
  description: string;
  createdAt: string;
  imageUrl: string;
};
const communityFeed = [
  {
    id: '11111111',
    user: 'Mira',
    time: '1 min ago',
    message: '🦊 saw a red fox near Eyre Square.',
    image: 'https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_webp/wildernessclassroom.org/wp-content/uploads/2008/11/red_fox.jpg',
  },
  {
    id: '211111111111',
    user: 'Christy',
    time: '8 mins ago',
    message: '🐞 spotted a ladybug resting on a leaf.',
    image: 'https://www.terminix.com/-/media/Feature/Terminix/Articles/ladybug-seven-spotted.jpg?h=400&w=600&rev=42a52fee48b840fc807d14a529cfbbe6&hash=E1319C30AE2EAD8EFD9731C7985F2B3F',
  },
  {
    id: '3111111111111',
    user: 'Lina',
    time: 'yesterday',
    message: '🌧️ found a seagull after the rain in Galway Park.',
    image: 'https://ichef.bbci.co.uk/images/ic/1200x675/p059qg7n.jpg',
  },
];

const CommunityScreen = () => {
  const [apiFeed, setApiFeed] = useState<CommunityItem[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/post/recent`);
        const data = await res.json();
        setApiFeed(data);
        console.log('API posts loaded:', data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
  
    fetchPosts();
  }, []);

  return (
    // <FlatList
    //   style={styles.container}
    //   data={[...apiFeed, ...communityFeed]}
    //   keyExtractor={(item) => item.id}
    //   renderItem={({ item }) => (
    //     // <View style={styles.card}>
    //     //   <View style={styles.header}>
    //     //     <Icon name="person-circle-outline" size={24} color="#4b5563" />
    //     //     <Text style={styles.userText}>
    //     //       <Text style={styles.username}>{item.user}</Text> · {item.time}
    //     //     </Text>
    //     //   </View>
    //     //   <Text style={styles.message}>{item.message}</Text>
    //     //   {item.image && (
    //     //     <Image source={{ uri: item.image }} style={styles.image} />
    //     //   )}
    //     // </View>
    //     <View style={styles.card}>
    //       <View style={styles.header}>
    //         <Icon name="person-circle-outline" size={24} color="#4b5563" />
    //         <Text style={styles.userText}>
    //           <Text style={styles.username}>{item.username || item.user}</Text>
    //           {' · '}
    //           {item.time || new Date(item.createdAt).toLocaleDateString()}
    //         </Text>
    //       </View>
    //       <Text style={styles.message}>
    //         {item.message || `${item.speciesIcon || ''} ${item.description || ''}`}
    //       </Text>
    //       {item.image || item.imageUrl ? (
    //         <Image
    //           source={{ uri: item.image || item.imageUrl }}
    //           style={styles.image}
    //         />
    //       ) : null}
    //     </View>
    //   )}
    // />
    <FlatList
      style={styles.container}
      data={[...apiFeed, ...communityFeed]}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Icon name="person-circle-outline" size={24} color="#4b5563" />
            <Text style={styles.userText}>
              <Text style={styles.username}>
                {('username' in item && item.username) || ('user' in item && item.user)}
              </Text>
              {' · '}
              {('time' in item && item.time) ||
                ('createdAt' in item && new Date(item.createdAt).toLocaleDateString())}
            </Text>
          </View>
          <Text style={styles.message}>
            {('message' in item && item.message) ||
              (`${('speciesIcon' in item ? item.speciesIcon : '')} ${'description' in item ? item.description : ''}`)}
          </Text>
          {/* {('image' in item && item.image) || ('imageUrl' in item && item.imageUrl) ? (
            <Image
              source={{ uri: ('image' in item && item.image) || ('imageUrl' in item && item.imageUrl) }}
              style={styles.image}
            />
          ) : null} */}
          {(() => {
                  const imageUri =
                    'image' in item
                      ? item.image
                      : 'imageUrl' in item
                      ? item.imageUrl
                      : undefined;

                  return imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  ) : null;
                })()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4b5563',
  },
  username: {
    fontWeight: '600',
    color: '#065f46',
  },
  message: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
});

export default CommunityScreen;
