import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';

export default function TextToSpeechScreen() {
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1); // Usually TTS handles this via style, but we map it to mock UI for now.
  const [loading, setLoading] = useState(false);
  const { isConnected } = useNotification();

  const handleGenerate = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    setLoading(true);
    try {
      await api.post('/TextToVoice/generate', {
        text,
        language: 'other',
        voiceName: 'echo',
        quality: 'Standard'
      });
      
      Alert.alert('Success', 'Your request has been submitted. You will receive a notification once the audio is ready.');
      setText('');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to generate audio';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Speech AI' }} />
      
      <Text style={styles.title}>Text to Speech</Text>
      <Text style={styles.subtitle}>
        Convert text to natural-sounding speech.
        {isConnected ? ' (SignalR Connected)' : ' (Connecting...)'}
      </Text>

      <Text style={styles.sectionTitle}>TEXT INPUT</Text>
      <SoftCard style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Enter or paste your text here..."
          placeholderTextColor={Colors.light.textSecondary}
          value={text}
          onChangeText={setText}
          maxLength={5000}
        />
        <View style={styles.inputFooter}>
          <Text style={styles.charCount}>{text.length} / 5000</Text>
        </View>
      </SoftCard>

      <Text style={styles.sectionTitle}>VOICE SETTINGS</Text>
      <SoftCard style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>Echo (Male)</Text>
          </View>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>SPEED</Text>
            <Text style={styles.sliderValue}>{speed.toFixed(1)}x</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={speed}
            onValueChange={setSpeed}
            minimumTrackTintColor={Colors.light.tint}
            maximumTrackTintColor={Colors.light.border}
          />
        </View>

        <View style={styles.divider} />
        
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>PITCH</Text>
            <Text style={styles.sliderValue}>{pitch.toFixed(1)}</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={pitch}
            onValueChange={setPitch}
            minimumTrackTintColor={Colors.light.tint}
            maximumTrackTintColor={Colors.light.border}
          />
        </View>
      </SoftCard>

      <CustomButton 
        title={loading ? "GENERATING..." : "GENERATE SPEECH"} 
        onPress={handleGenerate}
        disabled={loading}
        style={styles.generateBtn} 
        textStyle={styles.generateBtnText} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputCard: {
    padding: 0,
    height: 200,
    overflow: 'hidden',
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    padding: 16,
    paddingTop: 16,
    fontSize: 16,
    color: Colors.light.text,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  charCount: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  settingsCard: {
    padding: 0,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  sliderSection: {
    padding: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  generateBtn: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 16,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
