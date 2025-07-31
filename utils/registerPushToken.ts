// utils/registerPushToken.ts
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/api";

export async function registerPushToken() {
  // get token
  const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
  console.log("📲 Expo Push Token:", expoPushToken);

  // read JWT
  const jwt = await AsyncStorage.getItem("token");
  if (!jwt) {
    console.error("❌ No JWT token in storage");
    return;
  }

  // upload to backend
  const res = await fetch(`${BASE_URL}/api/user/me/push-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    },
    body: JSON.stringify({ expoPushToken })
  });

  if (res.ok) {
    console.log("✅ Expo Push Token uploaded successfully.");
  } else {
    console.error("❌ Failed to upload Expo Push Token:", res.status);
  }
}

