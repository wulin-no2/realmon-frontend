// ScanResultScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../config/api';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authFetch } from '../utils/authFetch';

type ScanResultRouteProp = RouteProp<RootStackParamList, 'ScanResult'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ScanResultScreen = () => {
  const route = useRoute<ScanResultRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const {
    imageUri,
    username,
    timestamp,
    location,
    speciesId,
    speciesName,
    scientificName,
    speciesIcon,
    category,
    imageUrl,
    wikiUrl,
    score,
  } = route.params;

  const handleFound = async () => {
    try {
      const response = await authFetch(`/api/user/collect`, {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speciesId,
          imageUrl,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp,
          source: 'scan',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record observation');
      }

      Alert.alert('🎉 Success', 'This Realmon has been added to your deck!');
    } catch (error) {
      console.error('Error uploading observation:', error);
      Alert.alert('Upload Failed', 'Please try again later.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.uploadedImage} />

        <Image source={{ uri: imageUrl }} style={styles.realmonImage} />
        <Text style={styles.title}>{speciesName || scientificName}</Text>
        <Text style={styles.score}>AI Confidence: {(score * 100).toFixed(1)}%</Text>

        <Text style={styles.meta}>Category: {speciesIcon} {category}</Text>
        <Text style={styles.meta}>Spotted by: {username}</Text>
        <Text style={styles.meta}>
          Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </Text>
        <Text style={styles.meta}>Time: {new Date(timestamp).toLocaleString()}</Text>

        {wikiUrl && (
          <Text style={styles.link} onPress={() => Linking.openURL(wikiUrl)}>
            🔗 View more on Wikipedia
          </Text>
        )}

        <View style={{ marginTop: 24 }}>
          <Button title="I Found It!" onPress={handleFound} />
        </View>

        <Text style={styles.disclaimer}>
          This species was identified using AI. If it's inaccurate, try a clearer photo or different angle.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  uploadedImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 20 },
  realmonImage: { width: '100%', height: 180, borderRadius: 8 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  score: { fontSize: 16, color: '#2196f3', marginVertical: 4 },
  meta: { fontSize: 16, marginVertical: 2 },
  link: { color: '#007AFF', marginTop: 8, fontWeight: '500' },
  disclaimer: {
    fontSize: 14,
    color: '#777',
    marginTop: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ScanResultScreen;
