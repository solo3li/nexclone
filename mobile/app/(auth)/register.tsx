import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import api from '@/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Focus states
  const [focusName, setFocusName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass] = useState(false);
  const [focusConfirm, setFocusConfirm] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/Auth/register', { fullName, email, password, confirmPassword });
      Alert.alert('Success', 'Registration successful! Please verify your email.');
      router.push('/(auth)/verify-email');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'FULL NAME', placeholder: 'John Doe', value: fullName, onChangeText: setFullName, focused: focusName, onFocus: () => setFocusName(true), onBlur: () => setFocusName(false), secureTextEntry: false, keyboardType: 'default' as const },
    { label: 'EMAIL', placeholder: 'you@example.com', value: email, onChangeText: setEmail, focused: focusEmail, onFocus: () => setFocusEmail(true), onBlur: () => setFocusEmail(false), secureTextEntry: false, keyboardType: 'email-address' as const, autoCapitalize: 'none' as const },
    { label: 'PASSWORD', placeholder: '••••••••', value: password, onChangeText: setPassword, focused: focusPass, onFocus: () => setFocusPass(true), onBlur: () => setFocusPass(false), secureTextEntry: true, keyboardType: 'default' as const },
    { label: 'CONFIRM PASSWORD', placeholder: '••••••••', value: confirmPassword, onChangeText: setConfirmPassword, focused: focusConfirm, onFocus: () => setFocusConfirm(true), onBlur: () => setFocusConfirm(false), secureTextEntry: true, keyboardType: 'default' as const },
  ];

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
        {/* Orb */}
        <View style={styles.orbContainer}>
          <View style={styles.orbOuter} />
          <View style={styles.orbInner} />
        </View>

        {/* Brand */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>NexMedia</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the AI-powered workspace</Text>

        {/* Fields */}
        {fields.map((field) => (
          <View key={field.label} style={styles.fieldGroup}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={[styles.input, field.focused && styles.inputFocused]}
              placeholder={field.placeholder}
              placeholderTextColor="#555570"
              value={field.value}
              onChangeText={field.onChangeText}
              onFocus={field.onFocus}
              onBlur={field.onBlur}
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.keyboardType}
              autoCapitalize={field.autoCapitalize ?? 'words'}
            />
          </View>
        ))}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.82}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 48,
  },

  // Orb
  orbContainer: {
    alignItems: 'center',
    marginBottom: 28,
    height: 100,
    justifyContent: 'center',
  },
  orbOuter: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9B51E0',
    opacity: 0.12,
  },
  orbInner: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#9B51E0',
    opacity: 0.22,
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
    fontSize: 30,
    fontWeight: '800',
    color: '#F0F0FF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#8888AA',
    textAlign: 'center',
    marginBottom: 36,
  },

  // Fields
  fieldGroup: {
    marginBottom: 18,
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
    paddingVertical: 15,
    fontSize: 16,
    color: '#F0F0FF',
  },
  inputFocused: {
    borderColor: 'rgba(155,81,224,0.5)',
  },

  // Button
  signUpButton: {
    backgroundColor: '#9B51E0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
    shadowColor: '#9B51E0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  signUpButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#8888AA',
    fontSize: 14,
  },
  footerLink: {
    color: '#9B51E0',
    fontWeight: '700',
    fontSize: 14,
  },
});
