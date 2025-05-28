import React from 'react';
import { View, Text, Image, Button, Linking, StyleSheet } from 'react-native';

const RealmonDetailScreen = ({ route, navigation }) => {
  const {
    speciesName,
    speciesIcon,
    source,
    category,
    observerName,
    timestamp,
    latitude,
    longitude,
    imageUrl,
    wikiUrl,
    id,
  } = route.params;

  const handleFound = async () => {
    try {
      await fetch(`http://192.168.1.185:8080/api/user/collect`, {
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
      <Text >Category:</Text> 
      <Text style={styles.info}>{speciesIcon} {category}</Text>
      <Text >Found by: </Text> 
      <Text style={styles.info}>{observerName} from {source}</Text>
      <Text >Time:  </Text> 
      <Text style={styles.info}>{new Date(timestamp).toLocaleString()}</Text>
      <Text >Location:  </Text> 
      <Text style={styles.info}>{latitude}, {longitude}</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(wikiUrl)}>
        Find Out More From WikiPedia
      </Text>
      <Button title="I found it!" onPress={handleFound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 400, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  link: { color: 'darkgreen', fontWeight: 'bold', fontSize: 16, marginBottom: 24,
    marginVertical: 10 },
  info: { fontWeight: 'bold', marginTop: 4, marginBottom: 4, fontSize: 16}
});

export default RealmonDetailScreen;
