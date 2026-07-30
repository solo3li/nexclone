import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import api from '@/services/api';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocusedToken, setIsFocusedToken] = useState(false);

  const handleVerify = async () => {
    if (!token) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
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
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Orb Decoration */}
        <View style={styles.orbContainer}>
          <View style={styles.orbOuter} />
          <View style={styles.orbInner} />
        </View>

        {/* Brand */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>NexMedia</Text>
        </View>

        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>Check your inbox and enter the code below.</Text>

        {/* Token Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>VERIFICATION CODE</Text>
          <TextInput
            style={[styles.input, isFocusedToken && styles.inputFocused]}
            placeholder="Enter code"
            placeholderTextColor="#555570"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            onFocus={() => setIsFocusedToken(true)}
            onBlur={() => setIsFocusedToken(false)}
          />
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={loading}
          activeOpacity={0.82}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Account</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#13131A',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },

  // Orb
  orbContainer: {
    alignItems: 'center',
    marginBottom: 32,
    height: 120,
    justifyContent: 'center',
  },
  orbOuter: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9B51E0',
    opacity: 0.15,
  },
  orbInner: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9B51E0',
    opacity: 0.25,
  },

  // Brand
  brandContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  brandText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#9B51E0',
    letterSpacing: 0.5,
  },

  // Heading
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F0F0FF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },

  // Field
  fieldGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#8888AA',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1C1C28',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#F0F0FF',
  },
  inputFocused: {
    borderColor: 'rgba(155,81,224,0.5)',
  },

  // Button
  verifyButton: {
    backgroundColor: '#9B51E0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#9B51E0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
