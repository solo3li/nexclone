import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';
import CustomSelect from '@/components/CustomSelect';
import ConfirmCostModal from '@/components/ConfirmCostModal';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';
import { SymbolView } from 'expo-symbols';

const LANGUAGES = [
  { label: 'Auto-Detect', value: 'auto' },
  { label: 'Arabic', value: 'ar' },
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Spanish', value: 'es' },
  { label: 'German', value: 'de' },
];

export default function VoiceToTextScreen() {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [language, setLanguage] = useState('auto');
  
  const [loading, setLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [chargedWallet, setChargedWallet] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

  const { isConnected } = useNotification();

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
        setUploadedFileId(null);
      }
    } catch (err) {
      console.log('Error picking file', err);
    }
  };

  const handleEstimateCost = async () => {
    if (!file) {
      Alert.alert('Error', 'Please select an audio file first');
      return;
    }

    setIsEstimating(true);
    try {
      const fileSizeBytes = file.size || 0;
      const durationMinutes = 0.01; // Mocking duration for mobile upload 
      
      const response = await api.post("/ai/voice-to-text/estimate", { 
        fileSizeBytes, 
        durationMinutes 
      });
      setEstimatedCost(response.data.estimatedCost);
      setChargedWallet(response.data.chargedWalletName);
      setShowConfirmModal(true);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Error calculating estimate.';
      Alert.alert('Error', msg);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleTranscribe = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      let fileId = uploadedFileId;
      
      if (!fileId) {
        // We use the new platform media endpoint for upload URL
        const { data: { url, objectName } } = await api.post('/Media/upload-url', {
          fileName: file!.name,
          contentType: file!.mimeType || 'audio/mpeg',
          toolName: 'voice-to-text'
        });

        const response = await fetch(file!.uri);
        const blob = await response.blob();
        const uploadResult = await fetch(url, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': file!.mimeType || 'audio/mpeg'
          }
        });
        
        if (!uploadResult.ok) {
           throw new Error("Failed to upload to S3/MinIO");
        }
        
        fileId = objectName;
        setUploadedFileId(objectName);
      }

      await api.post('/ai/voice-to-text/transcribe', {
        fileId: fileId,
        translate: language !== 'auto',
        targetLanguage: language
      });
      
      Alert.alert('Success', 'Your request has been submitted. You will receive a notification once the transcription is ready.');
      setFile(null);
      setUploadedFileId(null);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to start transcription';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: 'Voice AI', headerStyle: { backgroundColor: '#13131A' }, headerTintColor: '#F0F0FF' }} />
        
        <Text style={styles.title}>Voice to Text</Text>
        <Text style={styles.subtitle}>
          Transcribe audio files into accurate text.
          {isConnected ? ' (SignalR Connected)' : ' (Connecting...)'}
        </Text>

        <Text style={styles.sectionTitle}>LANGUAGE</Text>
        <SoftCard style={styles.card}>
          <CustomSelect 
            label="Target Language"
            options={LANGUAGES}
            selectedValue={language}
            onSelect={setLanguage}
            iconName="globe"
          />
        </SoftCard>

        <Text style={styles.sectionTitle}>UPLOAD AUDIO</Text>
        <SoftCard style={styles.card}>
          <TouchableOpacity style={styles.fileRow} onPress={handlePickFile} activeOpacity={0.7}>
            <View style={[styles.fileIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <SymbolView name="waveform" size={24} tintColor="#8B5CF6" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.fileLabel}>Audio File</Text>
              <Text style={styles.fileValue} numberOfLines={1}>
                {file ? file.name : 'Tap to select an audio file (mp3, wav)'}
              </Text>
            </View>
            {file && (
              <TouchableOpacity onPress={() => setFile(null)} style={{ padding: 8 }}>
                <SymbolView name="xmark.circle.fill" size={20} tintColor="#555570" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </SoftCard>

        <CustomButton 
          title={isEstimating ? "ESTIMATING..." : loading ? "PROCESSING..." : "START TRANSCRIPTION"} 
          onPress={handleEstimateCost}
          disabled={loading || isEstimating || !file}
          style={styles.generateBtn} 
          textStyle={styles.generateBtnText} 
        />
      </ScrollView>

      <ConfirmCostModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleTranscribe}
        estimatedCost={estimatedCost}
        chargedWallet={chargedWallet}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131A',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
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
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileLabel: {
    fontSize: 14,
    color: '#F0F0FF',
    fontWeight: '600',
    marginBottom: 4,
  },
  fileValue: {
    fontSize: 13,
    color: '#8888AA',
  },
  generateBtn: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#8B5CF6',
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
