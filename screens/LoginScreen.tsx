// // screens/LoginScreen.tsx
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../config/api';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/AppNavigator';
// import * as Notifications from 'expo-notifications';
// import { registerPushToken } from '../utils/registerPushToken';

// export default function LoginScreen() {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const scheduleDailyReminder = async () => {
//     // cancel all previous notifications, prevent duplication
//     await Notifications.cancelAllScheduledNotificationsAsync();
  
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: "🌿 Daily Quest Ready!",
//         body: "Come discover a new Realmon today 🌿",
//         sound: true,
//       },
//       trigger: {

//         channelId: 'default',
//         hour: 9, // notification every day at 9
//         minute: 0,
//         repeats: true,
//         // seconds: 5,  
//       },
     
//     });
  
//     console.log('✅ Daily Quest daily reminder scheduled.');
//   };

//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert('Missing fields', 'Please enter both username and password.');
//       return;
//     }

//     setLoading(true);
//     console.log("🚀 BASE_URL in runtime:", BASE_URL);

//     // ✅ Wrap fetch in timeout
//     const fetchWithTimeout = (url, options, timeout = 10000) => {
//       return Promise.race([
//         fetch(url, options),
//         new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))
//       ]);
//     };

//     try {
//       const res = await fetch(`${BASE_URL}/api/user/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

      
//       console.log("✅ Fetch completed. Status:", res.status);
//       const text = await res.text();

//       if (res.status === 401) {
//         Alert.alert('Login failed', 'Invalid username or password');
//         return;
//       }
      
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         console.error("❌ Failed to parse JSON:", e);
//         Alert.alert('Error', 'Invalid server response');
//         return;
//       }

//       if (!data.token) {
//         Alert.alert('Error', 'No token received from server');
//         return;
//       }

//       // store token
//       await AsyncStorage.setItem('token', data.token);
//       await AsyncStorage.setItem('userId', data.userId.toString());
//       await AsyncStorage.setItem('username', data.username);

//       // add scheduleDailyReminder
//       await scheduleDailyReminder();

//       // upload Expo Push Token. Move it to home screen
//       // await registerPushToken();



//       // jump to home screen
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Home' }],
//       });

//     } catch (err) {
//       if (err.message === "timeout") {
//         Alert.alert('Network Error', 'Server did not respond in time. Please try again.');
//         console.error("⏱️ Fetch timed out:", err);
//       } else if (err.message.includes("Network request failed")) {
//         Alert.alert('Network Error', 'Cannot connect to server. Check your internet or server URL.');
//         console.error("🌐 Network error:", err);
//       } else {
//         Alert.alert('Error', 'Something went wrong. Please try again.');
//         console.error('Login error:', err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome back</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         autoCapitalize="none"
//         value={username}
//         onChangeText={setUsername}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         autoCapitalize="none"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20, flex: 1, justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
// });

// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import { registerPushToken } from '../utils/registerPushToken';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const scheduleDailyReminder = async () => {
  //   try {
  //     await Notifications.cancelAllScheduledNotificationsAsync();
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: "🌿 Daily Quest Ready!",
  //         body: "Come discover a new Realmon today 🌿",
  //         sound: true,
  //       },
  //       trigger: {
  //         channelId: 'default',
  //         hour: 9,
  //         minute: 0,
  //         repeats: true,
  //       },
  //     });
  //     console.log('✅ Daily Quest daily reminder scheduled.');
  //   } catch (err) {
  //     console.error("📌 Notification schedule error:", err);
  //   }
  // };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing fields', 'Please enter both username and password.');
      return;
    }
    if (!BASE_URL) {
      Alert.alert('Config error', 'BASE_URL is not set');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const rawText = await res.text();

      if (res.status === 401) {
        Alert.alert('Login failed', 'Invalid username or password');
        return;
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("❌ JSON parse error:", parseErr);
        Alert.alert('Server error', 'Invalid response format.');
        return;
      }

      if (!data?.token) {
        console.error("❌ Missing token in response:", data);
        Alert.alert('Server error', 'Token not received.');
        return;
      }

      // store token
      // await AsyncStorage.setItem('token', data.token);
      // await AsyncStorage.setItem('userId', data.userId?.toString() || '');
      // await AsyncStorage.setItem('username', data.username || '');
      await AsyncStorage.multiSet([
        ['token', data.token],
        ['userId', data.userId?.toString() || ''],
        ['username', data.username || '']
      ]);
      // schedule daily reminder
      // await scheduleDailyReminder();

      // navigate to home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
