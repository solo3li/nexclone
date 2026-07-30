import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
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
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      },
    }),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
});
