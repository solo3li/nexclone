import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue to NexMedia</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Link href="/(auth)/forgot-password" asChild>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </Link>

      <CustomButton 
        title={loading ? "Signing in..." : "Sign In"} 
        onPress={handleLogin} 
        disabled={loading}
        style={styles.loginBtn}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/(auth)/register" asChild>
          <Text style={styles.registerLink}>Sign Up</Text>
        </Link>
      </View>
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
  },
  inputContainer: {
    marginBottom: 20,
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
  forgotPassword: {
    color: Colors.light.tint,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  loginBtn: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.light.textSecondary,
    fontSize: 15,
  },
  registerLink: {
    color: Colors.light.tint,
    fontWeight: '700',
    fontSize: 15,
  },
});
