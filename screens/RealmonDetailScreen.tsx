import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import { BASE_URL } from '../config/api';
import { Realmon, SpeciesDetails } from "../types/types";
import { ScrollView } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';


const RealmonDetailScreen = ({ route, navigation }) => {
  const {
    speciesId,
    speciesName,
    scientificName,
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
  const [details, setDetails] = useState<SpeciesDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [founding, setFounding] = useState(false);


  useEffect(() => {
    if (!speciesId) return;

    // fetch(`${BASE_URL}/api/species/${speciesId}`)
    //   .then(res => res.json())
    //   .then(data => setDetails(data))
    //   .catch(err => {
    //     console.error('Failed to fetch species details', err);
    //     setDetails(null); // optional fallback
    //   })
    //   .finally(() => setLoading(false));
    fetch(`${BASE_URL}/api/species/${String(speciesId)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setDetails(data))
      .catch(err => {
        console.error('Failed to fetch species details', err);
        setDetails(null);
      })
      .finally(() => setLoading(false));

  }, [speciesId]);

  const handleFound = async () => {
    try {
      setFounding(true);
      await fetch(
        `${BASE_URL}/api/user/collect`
        , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ realmonId: id }),
      });
      alert('Recorded in your deck!');
    } catch (err) {
      alert('Record failed.');
    } finally {
      setFounding(false);
    }
  };

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.title}>{speciesName}</Text>
        
        <Text >Scientific Name:</Text> 
        <Text style={styles.info}>{scientificName} </Text>
        <Text >Category:</Text> 
        <Text style={styles.info}>{speciesIcon} {category}</Text>
        <Text >Found by: </Text> 
        <Text style={styles.info}>{observerName} from {source}</Text>
        <Text >Time:  </Text> 
        <Text style={styles.info}>{new Date(timestamp).toLocaleString()}</Text>
        <Text >Location:  </Text> 
        <Text style={styles.info}>{latitude}, {longitude}</Text>

        {details?.funFact && <Text style={styles.detail}>💡 {details.funFact}</Text>}
        {details?.symbolism && <Text style={styles.detail}>🌿 {details.symbolism}</Text>}
        {details?.texture && <Text style={styles.detail}>👋 Texture: {details.texture}</Text>}
        {details?.lifeCycle && <Text style={styles.detail}>🔁 Life Cycle: {details.lifeCycle}</Text>}
        {details?.protectionLevel && <Text style={styles.detail}>🛡 Status: {details.protectionLevel}</Text>}

        <Text style={styles.link} onPress={() => Linking.openURL(wikiUrl)}>
          Find Out More From WikiPedia
        </Text>

      </ScrollView>
      <View style={styles.bottomButton}>
        {/* <Button title="I found it!" onPress={() => alert('Recorded!')} /> */}
        <Button  title={founding ? "Submitting..." : "I found it!"} onPress={handleFound} disabled={founding}/>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  container: { padding: 20 ,
    paddingBottom: 80,

  },
  image: { width: '100%', height: 400, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  link: { color: 'darkgreen', fontWeight: 'bold', fontSize: 16, marginBottom: 24,
    marginVertical: 10 },
  info: { fontWeight: 'bold', marginTop: 4, marginBottom: 4, fontSize: 16},
  detail: { marginVertical: 4, fontSize: 14, fontStyle: 'italic' },
  bottomButton: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: '#ffffffee',
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

});

export default RealmonDetailScreen;


