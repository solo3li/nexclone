import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';

export default function VoiceToTextScreen() {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const { isConnected } = useNotification();

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking file', err);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      Alert.alert('Error', 'Please select an audio file first');
      return;
    }

    setLoading(true);
    try {
      const { data: { url, objectName } } = await api.post('/Media/upload-url', {
        fileName: file.name,
        contentType: file.mimeType || 'audio/mpeg',
        toolName: 'voice-to-text'
      });

      const response = await fetch(file.uri);
      const blob = await response.blob();
      const uploadResult = await fetch(url, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': file.mimeType || 'audio/mpeg'
        }
      });
      
      if (!uploadResult.ok) {
         throw new Error("Failed to upload to S3/MinIO");
      }

      await api.post('/VoiceToText/transcribe', {
        fileId: objectName,
        sourceLanguage: 'auto',
        targetLanguage: 'en'
      });
      
      Alert.alert('Success', 'Your request has been submitted. You will receive a notification once the transcription is ready.');
      setFile(null);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to start transcription';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Voice AI', headerStyle: { backgroundColor: '#13131A' }, headerTintColor: '#F0F0FF' }} />
      
      <Text style={styles.title}>Voice to Text</Text>
      <Text style={styles.subtitle}>
        Transcribe audio files into accurate text.
        {isConnected ? ' (SignalR Connected)' : ' (Connecting...)'}
      </Text>

      <Text style={styles.sectionTitle}>UPLOAD AUDIO</Text>
      <SoftCard style={styles.card}>
        <View style={styles.uploadArea}>
          <Text style={styles.uploadLabel}>{file ? file.name : 'Select an audio file (mp3, wav)'}</Text>
          <CustomButton 
            title={file ? "Change File" : "Select Audio File"} 
            onPress={handlePickFile} 
            style={styles.pickBtn}
          />
        </View>
      </SoftCard>

      <CustomButton 
        title={loading ? "PROCESSING..." : "START TRANSCRIPTION"} 
        onPress={handleTranscribe}
        disabled={loading || !file}
        style={styles.generateBtn} 
        textStyle={styles.generateBtnText} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131A',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F0FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8888AA',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F0FF',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  uploadLabel: {
    fontSize: 16,
    color: '#8888AA',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickBtn: {
    paddingHorizontal: 24,
  },
  generateBtn: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#22C55E',
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
