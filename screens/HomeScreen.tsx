// screens/HomeScreen.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  
} from "react-native";
import * as Notifications from "expo-notifications";

import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Region,  } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BASE_URL } from "../config/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Realmon } from "../types/types";
import throttle from "lodash.throttle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch } from "../utils/authFetch";

// daily reminder 
const scheduleDailyReminder = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌿 Daily Quest Ready!",
        body: "Come discover a new Realmon today 🌿",
        sound: true,
      },
      trigger: {
        channelId: 'default',
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
    console.log('✅ Daily Quest daily reminder scheduled.');
  } catch (err) {
    console.error("📌 Notification schedule error:", err);
  }
};


export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const [region, setRegion] = useState<Region | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [realmons, setRealmons] = useState<Realmon[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);

  // get notification permissions
  useEffect(() => {
    const askNotificationPermission = async () => {
      console.log("🚀 Asking notification permission...");
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("❌ Notification permissions not granted");
      } else {
        console.log("✅ Notification permission granted");
        await scheduleDailyReminder(); //  Home screen auto Daily Quest reminder
      }
    };
  
    askNotificationPermission();
  }, []);
  

  // for notification test
  // const sendTestNotification = async () => {
  //   console.log("Scheduling test notification...");
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "🎉 Test Notification",
  //       body: "This is a test notification.",
  //       sound: true,
  //     },
  //     trigger: null, // right away
  //   });
  // };

  // auto trigger for notification test
  // useEffect(() => {
  //   const scheduleNotification = async () => {
  //     await Notifications.scheduleNotificationAsync({
        
  //       content: {
  //         title: "🌿 Welcome Back!",
  //         body: "This is an auto-triggered test notification.",
  //         sound: true,
  //       },
  //       trigger: { 
  //         channelId: 'default',
  //         seconds: 5 },
  //     });
  //   };
  
  //   scheduleNotification();
  // }, []);



  const fetchNearby = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/observations/nearby?lat=${lat}&lon=${lon}&radiusKm=5`
      );
      if (!response.ok) {
        // throw new Error(`HTTP error! status: ${response.status}`);
        console.warn(`⚠️ Nearby API failed: ${response.status}`);
        setRealmons([]); // fallback null，avoid undefined
        return;
      }
      const data: Realmon[] = await response.json();
      // setRealmons(data);
      setRealmons(Array.isArray(data) ? data : []); // double check to avoid backend error
    } catch (error) {
      console.error("Error fetching nearby realmons", error);
      setRealmons([]); // network error fallback
    } finally {
      setLoading(false);
      console.log("📍 BASE_URL used from HomeScreen:", BASE_URL);
    }
  };
  // get expo notification token every time 
  // useEffect(() => {
  //   const uploadPushToken = async () => {
  //     console.log("🚀 Trying to get push token...");  // see if uploadPushToken is running
  //     // get permission
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       console.warn("❌ Notification permissions not granted");
  //       return;
  //     }
  
  //     // get Expo Push Token
  //     const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
  //     console.log("✅ Expo Push Token:", expoPushToken);
  
  //     // get JWT
  //     const jwt = await AsyncStorage.getItem("token");
  //     if (!jwt) {
  //       console.warn("No JWT found, skip uploading push token");
  //       return;
  //     }
  
  //     // upload to backend
  //     const res = await fetch(`${BASE_URL}/api/user/me/push-token`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${jwt}`,
  //       },
  //       body: JSON.stringify({ expoPushToken }),
  //     });
  
  //     if (res.ok) {
  //       console.log("✅ Push token uploaded successfully");
  //     } else {
  //       console.error("❌ Failed to upload push token");
  //     }
  //   };
  
  //   uploadPushToken();
  // }, []);
  
  

  // test token
  // useEffect(() => {
  //   const testPushToken = async () => {
  //     console.log("🚀 HomeScreen: Trying to get push token...");
  
  //     try {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       if (status !== "granted") {
  //         console.warn("❌ Permission not granted");
  //         return;
  //       }
  
  //       const { data: token } = await Notifications.getExpoPushTokenAsync();
  //     } catch (e) {
  //       console.error("❌ HomeScreen: Error getting push token:", e);
  //     }
  //   };
  
  //   testPushToken();
  // }, []);
  
  

    // Get user location once on mount
  useEffect(() => {
    (async () => {
      try{
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          setLoading(false);
          return;
        }
      }catch (e) {
        console.error('Location init failed', e);
     }
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const initRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      // setCurrentLocation(initialRegion); 
      // setRegion(initialRegion);
      setInitialRegion(initRegion);
      setCurrentLocation(initRegion);


      await fetchNearby(latitude, longitude);

    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try{
        const loc = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          
        });
      }catch(e){
        console.warn("Location update failed", e);

      }
    }, 10000); //update location every 10s
  
    return () => clearInterval(interval);
  }, []);

  // Throttled fetch for when user moves the map
  const handleRegionChangeComplete = useCallback(
    throttle((newRegion: Region) => {
      fetchNearby(newRegion.latitude, newRegion.longitude);
    }, 2000),
    []
  );
  
  return (
    <View style={styles.container}>
      {initialRegion ? (
        <MapView 
        ref={mapRef}
        style={styles.map} 
        // region={region}
        initialRegion={initialRegion}

        // onRegionChangeComplete={(newRegion) => {
        //   setRegion(newRegion);
        //   fetchNearby(newRegion.latitude, newRegion.longitude);
        // }}
        onRegionChangeComplete={handleRegionChangeComplete}

        >
          {/* current location Marker */}
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="You are here"
              pinColor="blue"
            />
          )}
          {/* realmon markers */}
          {realmons && realmons.map((realmon, index) => (
            <Marker
              key={realmon.id ? `realmon-${realmon.id}` : `fallback-${index}`}
              coordinate={{
                latitude: realmon.latitude || 53,
                longitude: realmon.longitude || -9,
              }}
              title={realmon.speciesName || 'Unknown'}
              description={realmon.username}
              onPress={() =>
                navigation.navigate("RealmonDetail", {
                  id: realmon.id,
                  speciesId: realmon.speciesId, 
                  latitude: realmon.latitude,
                  longitude: realmon.longitude,
                  timestamp: realmon.observedAt,
                  imageUrl: realmon.imageUrl,
                  source: realmon.source,
                  speciesName: realmon.speciesName,
                  scientificName: realmon.scientificName,
                  speciesIcon: realmon.speciesIcon,
                  category: realmon.category,
                  observerName: realmon.username,
                  wikiUrl: realmon.wikiUrl,
                })
              }
            >
              <Text style={{ fontSize: 36 }}>{realmon.speciesIcon || "❓"}</Text>
            </Marker>
          ))}
        </MapView>
      ) : (
        <ActivityIndicator size="large" style={styles.loading} />
      )}

      <View style={styles.topRight}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Messages")}
        >
          <Ionicons name="mail-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Community")}
        >
          <Ionicons name="people-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("ScanFlow")}
      >
        <Ionicons name="camera-outline" size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomLeft}
        onPress={() => navigation.navigate("Quest")}
      >
        <Ionicons name="calendar-outline" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomRight}
        onPress={() => navigation.navigate("My")}
      >
        <Ionicons name="person-outline" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recenterButton}
        onPress={() => {
          if (currentLocation && mapRef.current) {
            mapRef.current.animateToRegion({
              ...currentLocation,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }, 1000);
          }
        }}
      >
        <Ionicons name="locate" size={24} color="black" />
      </TouchableOpacity>
      {/* <Button title="Send Test Notification" onPress={sendTestNotification} /> */}



    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topRight: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  centerButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2196f3",
    padding: 16,
    borderRadius: 40,
    elevation: 6,
  },
  bottomLeft: {
    position: "absolute",
    bottom: 40,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
  bottomRight: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
  recenterButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },
  title: { fontSize: 20, marginBottom: 20 },
});

