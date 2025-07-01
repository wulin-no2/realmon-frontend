// screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, Region, MapViewProps } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BASE_URL } from "../config/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Realmon } from "../types/types";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [region, setRegion] = useState<Region | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [realmons, setRealmons] = useState<Realmon[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView | null>(null);



  const fetchNearby = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/observations/nearby?lat=${lat}&lon=${lon}&radiusKm=5`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Realmon[] = await response.json();
      setRealmons(data);
    } catch (error) {
      console.error("Error fetching nearby realmons", error);
    } finally {
      setLoading(false);
      console.log("📍 BASE_URL used from HomeScreen:", BASE_URL);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;
      const initialRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      setCurrentLocation(initialRegion); 
      setRegion(initialRegion);
      await fetchNearby(latitude, longitude);

    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        
      });
    }, 10000); //update location every 10s
  
    return () => clearInterval(interval);
  }, []);
  
  return (
    <View style={styles.container}>
      {region ? (
        <MapView 
        ref={mapRef}
        style={styles.map} 
        region={region}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          fetchNearby(newRegion.latitude, newRegion.longitude);
        }}
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
          {realmons.map((realmon, index) => (
            <Marker
              key={realmon.id ? `realmon-${realmon.id}` : `fallback-${index}`}
              coordinate={{
                latitude: realmon.latitude,
                longitude: realmon.longitude,
              }}
              title={realmon.speciesName}
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
              <Text style={{ fontSize: 36 }}>{realmon.speciesIcon}</Text>
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
});