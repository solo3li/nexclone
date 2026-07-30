import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Colors from '../constants/Colors';

interface SoftCardProps extends ViewProps {
  children: React.ReactNode;
  style?: object | any[];
}

export default function SoftCard({ children, style, ...props }: SoftCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    // Soft shadow for Light Minimalist Apple-like look
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // For Android
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
});
