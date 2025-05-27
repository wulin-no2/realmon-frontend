import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator
  , FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView , { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
// import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [region, setRegion] = useState(null);
  const [realmons, setRealmons] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.error("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     const { latitude, longitude } = location.coords;
  //     setRegion({
  //       latitude,
  //       longitude,
  //       latitudeDelta: 0.05,
  //       longitudeDelta: 0.05,
  //     });

  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8080/api/realmons/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=50`
  //       );
  //       setRealmons(response.data);
  //     } catch (error) {
  //       console.error("Error fetching nearby realmons", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  // return (
  //   <View style={styles.container}>
  //     <MapView style={styles.map} />

  //     {/* Top Right Icons */}
  //     <View style={styles.topRight}>
  //       <TouchableOpacity
  //         style={styles.iconButton}
  //         onPress={() => navigation.navigate("Messages")}
  //       >
  //         <Ionicons name="mail-outline" size={24} color="black" />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={styles.iconButton}
  //         onPress={() => navigation.navigate("Community")}
  //       >
  //         <Ionicons name="people-outline" size={24} color="black" />
  //       </TouchableOpacity>
  //     </View>

  //     {/* Floating Scanner Button */}
  //     <TouchableOpacity
  //       style={styles.centerButton}
  //       onPress={() => navigation.navigate("Scan")}
  //     >
  //       <Ionicons name="camera-outline" size={32} color="white" />
  //     </TouchableOpacity>

  //     {/* Bottom Left (Quest) */}
  //     <TouchableOpacity
  //       style={styles.bottomLeft}
  //       onPress={() => navigation.navigate("Quest")}
  //     >
  //       <Ionicons name="calendar-outline" size={24} color="black" />
  //     </TouchableOpacity>

  //     {/* Bottom Right (Dex/Profile) */}
  //     <TouchableOpacity
  //       style={styles.bottomRight}
  //       onPress={() => navigation.navigate("My")}
  //     >
  //       <Ionicons name="person-outline" size={24} color="black" />
  //     </TouchableOpacity>
  //   </View>
  // );
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // let location = await Location.getCurrentPositionAsync({});
      // const { latitude, longitude } = location.coords;
      const latitude = 53.3;
      const longitude = -9;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      try {
        const response = await fetch(
          `http://192.168.1.185:8080/api/observations/nearby?lat=${latitude}&lon=${longitude}&radiusKm=50`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("response.json() is:", data);
        setRealmons(data);
      } catch (error) {
        console.error("Error fetching nearby realmons", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region}>
          {realmons.map((realmon) => (
            <Marker
              key={realmon.id}
              coordinate={{
                latitude: realmon.latitude,
                longitude: realmon.longitude,
              }}
              title={realmon.speciesName}
              
            >
            <Text style={{ fontSize: 24 }}>{realmon.speciesIcon}</Text>
            </Marker>
          ))}
        </MapView>
      ) : (
        <ActivityIndicator size="large" style={styles.loading} />
      )}
      {/* Top Right Icons */}
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

      {/* Floating Button - Scan */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("Scan")}
      >
        <Ionicons name="camera-outline" size={32} color="white" />
      </TouchableOpacity>
      {/* Bottom Left (Quest) */}
      <TouchableOpacity
        style={styles.bottomLeft}
        onPress={() => navigation.navigate("Quest")}
      >
        <Ionicons name="calendar-outline" size={24} color="black" />
      </TouchableOpacity>

      {/* Bottom Right (Dex/Profile) */}
      <TouchableOpacity
        style={styles.bottomRight}
        onPress={() => navigation.navigate("My")}
      >
        <Ionicons name="person-outline" size={24} color="black" />
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
});
