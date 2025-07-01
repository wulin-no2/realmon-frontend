import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Linking,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
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

  const { imageUri, location, timestamp } = route.params;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const identifySpecies = async () => {
      try {
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);

        const res = await fetch(`${BASE_URL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });

        if (!res.ok) throw new Error('Scan failed');
        const data = await res.json();

        if (!data.length) {
          Alert.alert('No match', 'Could not identify a species. Try another photo.');
          navigation.goBack();
          return;
        }

        setResult(data[0]);
      } catch (error) {
        console.error('Scan error:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    identifySpecies();
  }, []);

  const handleFound = async () => {
    if (!result) return;

    try {
      const response = await authFetch(`/api/user/collect`, {
        method: 'POST',
        body: JSON.stringify({
          speciesId: result.id,
          imageUrl: result.imageUrl,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp,
          source: 'scan',
        }),
      });

      if (!response.ok) throw new Error('Failed to record observation');
      Alert.alert('🎉 Success', 'This Realmon has been added to your deck!');
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Upload Failed', 'Please try again later.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.uploadedImage} />

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Identifying species...</Text>
          </View>
        ) : (
          <>
            <Image source={{ uri: result.imageUrl }} style={styles.realmonImage} />
            <Text style={styles.title}>{result.name || result.scientificName}</Text>
            <Text style={styles.score}>
              AI Confidence: {(result.score).toFixed(1)}%
            </Text>

            <Text style={styles.meta}>
              Category: {result.icon || '❓'} {result.category}
            </Text>
            <Text style={styles.meta}>Spotted by: You</Text>
            <Text style={styles.meta}>
              Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
            <Text style={styles.meta}>Time: {new Date(timestamp).toLocaleString()}</Text>

            {result.wikiUrl && (
              <Text style={styles.link} onPress={() => Linking.openURL(result.wikiUrl)}>
                🔗 View more on Wikipedia
              </Text>
            )}

            <View style={{ marginTop: 24 }}>
              <Button title="I Found It!" onPress={handleFound} />
            </View>

            <Text style={styles.disclaimer}>
              This species was identified using AI. If it's inaccurate, try a clearer photo or different angle.
            </Text>
          </>
        )}
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
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#065f46',
  },
});

export default ScanResultScreen;
