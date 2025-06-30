// components/ui/button.tsx
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  className?: string; // optional if using Tailwind or utility parser
}

export const Button = ({ children, onPress, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#ccc' : '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
