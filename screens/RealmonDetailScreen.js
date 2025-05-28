import React from 'react';
import { View, Text, Image, Button, Linking, StyleSheet } from 'react-native';

const RealmonDetailScreen = ({ route, navigation }) => {
  const {
    speciesName,
    classification,
    observerName,
    timestamp,
    latitude,
    longitude,
    imageUrl,
    wikipediaUrl,
    id,
  } = route.params;

  const handleFound = async () => {
    try {
      await fetch(`http://192.168.1.185:8080/api/realmons/collect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ realmonId: id }),
      });
      alert('Recorded in your deck!');
    } catch (err) {
      alert('Recorded failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{speciesName}</Text>
      <Text>Category:{classification}</Text>
      <Text>Found by: {observerName}</Text>
      <Text>Time: {new Date(timestamp).toLocaleString()}</Text>
      <Text>Location: {latitude}, {longitude}</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(wikipediaUrl)}>
        Check Wiki:
      </Text>
      <Button title="I found it!" onPress={handleFound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  link: { color: 'blue', textDecorationLine: 'underline', marginVertical: 10 },
});

export default RealmonDetailScreen;
