// components/QuestButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface QuestButtonProps {
  completed: boolean;
  onPress: () => void;
}

export default function QuestButton({ completed, onPress }: QuestButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.questButton,
        completed ? styles.completedButton : styles.inProgressButton
      ]}
      onPress={onPress}
      disabled={completed}
    >
      <Text style={styles.buttonText}>
        {completed ? 'Completed' : 'In Progress'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  questButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    
  },
  completedButton: {
    backgroundColor: '#065f46',
    opacity:0.6
  },
  inProgressButton: {
    backgroundColor: '#4CAF50',
    opacity:1
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
