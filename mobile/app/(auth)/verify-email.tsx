import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import api from '@/services/api';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      // The backend expects token via query parameter or body, adjust based on AuthModels
      await api.get(`/Auth/verify-email?token=${token}`);
      
      Alert.alert('Success', 'Email verified successfully! You can now log in.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Verification failed. Invalid or expired token.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.subtitle}>Check your inbox and enter the code below.</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Code"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
        />
      </View>

      <CustomButton 
        title={loading ? "Verifying..." : "Verify"} 
        onPress={handleVerify} 
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});
