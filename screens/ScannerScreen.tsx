// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   ActivityIndicator,
//   FlatList,
//   Linking,
//   StyleSheet,
//   Alert
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { BASE_URL } from '../config/api';

// interface ScanResult {
//   name?: string;
//   scientificName?: string;
//   category: string;
//   score: number;
//   imageUrl: string;
//   wikiUrl?: string;
// }

// export default function ScannerScreen() {
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [results, setResults] = useState<ScanResult[]>([]);
//   const [loading, setLoading] = useState(false);

//   const askPermissions = async (): Promise<boolean> => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission needed', 'Camera permission is required to take photos.');
//       return false;
//     }
//     return true;
//   };

//   const takePhoto = async () => {
//     const hasPermission = await askPermissions();
//     if (!hasPermission) return;

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const uri = result.assets[0].uri;
//       setImageUri(uri);
//       scanImage(uri);
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const uri = result.assets[0].uri;
//       setImageUri(uri);
//       scanImage(uri);
//     }
//   };

//   const scanImage = async (uri: string) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', {
//         uri,
//         type: 'image/jpeg',
//         name: 'scan.jpg',
//       } as any); // Workaround for React Native FormData

//       const response = await fetch(`${BASE_URL}/api/scan`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: ScanResult[] = await response.json();
//       setResults(data);
//     } catch (error) {
//       console.error('Scan error:', error);
//       Alert.alert('Error', 'Failed to identify species.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="📷 Take Photo" onPress={takePhoto} />
//       <View style={{ marginVertical: 8 }} />
//       <Button title="🖼️ Select Photo" onPress={pickImage} />

//       {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

//       {loading && <ActivityIndicator size="large" color="#2196f3" style={{ marginTop: 12 }} />}

//       <FlatList
//         data={results}
//         keyExtractor={(_, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
//             <Text style={styles.title}>{item.name || item.scientificName}</Text>
//             <Text style={styles.meta}>{item.category} • Score: {item.score.toFixed(2)}</Text>
//             {item.wikiUrl && (
//               <Text style={styles.link} onPress={() => Linking.openURL(item.wikiUrl)}>
//                 🔗 View more on Wikipedia
//               </Text>
//             )}
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 16 },
//   preview: { width: '100%', height: 200, marginVertical: 12, borderRadius: 8 },
//   card: { marginVertical: 10, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
//   resultImage: { width: '100%', height: 180, borderRadius: 6 },
//   title: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
//   meta: { color: '#555', marginTop: 4, fontSize: 16 },
//   link: { color: '#007AFF', marginTop: 6 },
// });
