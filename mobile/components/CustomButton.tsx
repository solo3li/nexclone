import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle, Platform } from 'react-native';
import { Palette } from '../constants/Colors';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export default function CustomButton({ title, style, textStyle, ...props }: CustomButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} activeOpacity={0.82} {...props}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Palette.purple,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: `0px 6px 16px rgba(155, 81, 224, 0.4)`,
      },
      default: {
        shadowColor: Palette.purple,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
