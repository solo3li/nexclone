import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/Auth/login', { email, password });
      if (response.data.token) {
        await signIn(response.data.token, response.data.email, response.data.isVerified);
      } else {
        Alert.alert('Login failed', 'Invalid response from server');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed, please check your credentials.';
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

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={[styles.input, isFocusedEmail && styles.inputFocused]}
            placeholder="you@example.com"
            placeholderTextColor="#555570"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
          />
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={[styles.input, isFocusedPassword && styles.inputFocused]}
            placeholder="••••••••"
            placeholderTextColor="#555570"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setIsFocusedPassword(true)}
            onBlur={() => setIsFocusedPassword(false)}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity activeOpacity={0.7} style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.signInButton, loading && styles.signInButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.82}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.footerLink}>Sign Up</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },

  // Orb decoration
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
  },

  // Fields
  fieldGroup: {
    marginBottom: 20,
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

  // Forgot
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 28,
  },
  forgotText: {
    color: '#9B51E0',
    fontWeight: '600',
    fontSize: 14,
  },

  // Button
  signInButton: {
    backgroundColor: '#9B51E0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#9B51E0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 32,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
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
