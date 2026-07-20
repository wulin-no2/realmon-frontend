// screens/AuthGate.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View,Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BASE_URL } from '../config/api';

export default function AuthGate() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log("❌ No token found, redirecting to Login");
          navigation.replace('Login');
          return;
        }
        console.log(`🚀 Checking token at ${BASE_URL}/api/user/me`);

      // try {
        const res = await fetch(`${BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          console.log("✅ Token valid, redirecting to Home");
          navigation.replace('Home');
        } else {
          console.warn("⚠️ Token invalid or expired, clearing storage");
          await AsyncStorage.multiRemove(['token', 'userId', 'username']);
          navigation.replace('Login');
        }
      } catch (err: any) {
        console.error("AuthGate error:", err);
        setError(err.message);
        await AsyncStorage.multiRemove(['token', 'userId', 'username']);
        navigation.replace('Login');
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Checking session...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>Auth error: {error}</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return null;
}
