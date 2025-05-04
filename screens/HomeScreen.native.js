import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <MapView style={styles.map} />

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

      {/* Floating Scanner Button */}
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
