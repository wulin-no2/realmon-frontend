// screens/AuthGate.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BASE_URL } from '../config/api';

export default function AuthGate() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          navigation.replace('Home'); // token valid, to home
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login'); // token invalid
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
