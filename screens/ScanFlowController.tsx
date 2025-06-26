// ScanFlowController.tsx
import React, { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ScanFlow'>;

export default function ScanFlowController() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      try {
        // get camera permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera access is required.');
          navigation.goBack();
          return;
        }

        // get location permission
        const locationStatus = await Location.requestForegroundPermissionsAsync();
        if (locationStatus.status !== 'granted') {
          Alert.alert('Permission needed', 'Location access is required.');
          navigation.goBack();
          return;
        }

        // open camera
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });

        if (result.canceled || !result.assets.length) {
          navigation.goBack();
          return;
        }

        const photoUri = result.assets[0].uri;

        // get location
        const location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        // upload image and identify
        const formData = new FormData();
        formData.append('image', {
          uri: photoUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        } as any);

        const res = await fetch(`${BASE_URL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Scan failed');
        }

        const data = await res.json();
        if (!data.length) {
          Alert.alert('Try again', 'No species could be identified.');
          navigation.goBack();
          return;
        }

        const best = data[0];

        // jump to scan result page
        navigation.replace('ScanResult', {
            imageUri: photoUri,
            username: 'You',
            timestamp: new Date().toISOString(),
            location: { latitude, longitude },
            speciesId: best.id,
            speciesName: best.name,
            scientificName: best.scientificName,
            speciesIcon: best.icon || '❓',
            category: best.category,
            imageUrl: best.imageUrl,
            wikiUrl: best.wikiUrl || '',
            score: best.score || 0,
          });
      } catch (error) {
        console.error('Scan error', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
        navigation.goBack();
      }
    })();
  }, []);

  return null;
}
