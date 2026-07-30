import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { Palette } from '../constants/Colors';

interface SoftCardProps extends ViewProps {
  children: React.ReactNode;
  style?: object | any[];
  variant?: 'default' | 'elevated' | 'glass';
}

export default function SoftCard({ children, style, variant = 'default', ...props }: SoftCardProps) {
  return (
    <View style={[styles.card, styles[variant], style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.bg2,
    borderRadius: 20,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  default: {
    ...Platform.select({
      web: { boxShadow: '0px 4px 24px rgba(0,0,0,0.4)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  elevated: {
    ...Platform.select({
      web: { boxShadow: '0px 8px 32px rgba(155,81,224,0.15)' },
      default: {
        shadowColor: '#9B51E0',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
    borderColor: 'rgba(155,81,224,0.2)',
  },
  glass: {
    backgroundColor: 'rgba(28,28,40,0.7)',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 24px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 6,
      },
    }),
    borderColor: Palette.glassBorder,
  },
});
