import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from "axios";
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🌍 Map not available on Web. Please open in Expo Go or Simulator.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, textAlign: 'center', padding: 20 },
});
