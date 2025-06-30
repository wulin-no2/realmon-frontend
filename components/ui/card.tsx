// components/ui/card.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card = ({ children, style, ...props }: ViewProps & { children: React.ReactNode }) => {
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: '#fff',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          marginVertical: 6,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardContent = ({ children, style, ...props }: ViewProps & { children: React.ReactNode }) => {
  return (
    <View
      {...props}
      style={[
        {
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
