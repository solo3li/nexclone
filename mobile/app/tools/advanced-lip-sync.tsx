import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';
import ConfirmCostModal from '@/components/ConfirmCostModal';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';
import { SymbolView } from 'expo-symbols';

export default function AdvancedLipSyncScreen() {
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<{ uri: string, name: string, mimeType: string } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [chargedWallet, setChargedWallet] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isConnected } = useNotification();

  const handlePickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideo(result.assets[0].uri);
    }
  };

  const handlePickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAudio({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          mimeType: result.assets[0].mimeType || 'audio/mpeg'
        });
      }
    } catch (err) {
      console.log('Error picking audio file', err);
    }
  };

  const handleEstimateCost = async () => {
    if (!video || !audio) {
      Alert.alert('Error', 'Please select both a video and an audio file');
      return;
    }

    setIsEstimating(true);
    try {
      const response = await api.get("/video/estimate-lipsync");
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

  const handleGenerate = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', {
        uri: video,
        name: 'video.mp4',
        type: 'video/mp4'
      } as any);
      formData.append('audio', {
        uri: audio!.uri,
        name: audio!.name,
        type: audio!.mimeType
      } as any);

      await api.post('/video/start-lipsync', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      Alert.alert('Success', 'Your Lip Sync video is generating. We will notify you when it is ready.');
      setVideo(null);
      setAudio(null);
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to start lip sync';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: 'Lip Sync AI', headerStyle: { backgroundColor: '#13131A' }, headerTintColor: '#F0F0FF' }} />
        
        <Text style={styles.title}>Advanced Lip Sync</Text>
        <Text style={styles.subtitle}>
          Sync audio perfectly with any video.
          {isConnected ? ' (SignalR Connected)' : ' (Connecting...)'}
        </Text>

        <Text style={styles.sectionTitle}>UPLOAD VIDEO</Text>
        <SoftCard style={styles.card}>
          <TouchableOpacity style={styles.fileRow} onPress={handlePickVideo} activeOpacity={0.7}>
            <View style={[styles.fileIconBox, { backgroundColor: 'rgba(236, 72, 153, 0.1)' }]}>
              <SymbolView name="video.fill" size={24} tintColor="#EC4899" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.fileLabel}>Source Video</Text>
              <Text style={styles.fileValue} numberOfLines={1}>
                {video ? 'Video Selected ✓' : 'Tap to upload a video'}
              </Text>
            </View>
            {video && (
              <TouchableOpacity onPress={() => setVideo(null)} style={{ padding: 8 }}>
                <SymbolView name="xmark.circle.fill" size={20} tintColor="#555570" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </SoftCard>

        <Text style={styles.sectionTitle}>UPLOAD AUDIO</Text>
        <SoftCard style={styles.card}>
          <TouchableOpacity style={styles.fileRow} onPress={handlePickAudio} activeOpacity={0.7}>
            <View style={[styles.fileIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <SymbolView name="music.note" size={24} tintColor="#F59E0B" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.fileLabel}>Lip-Sync Audio</Text>
              <Text style={styles.fileValue} numberOfLines={1}>
                {audio ? audio.name : 'Tap to upload an audio file'}
              </Text>
            </View>
            {audio && (
              <TouchableOpacity onPress={() => setAudio(null)} style={{ padding: 8 }}>
                <SymbolView name="xmark.circle.fill" size={20} tintColor="#555570" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </SoftCard>

        <CustomButton 
          title={isEstimating ? "ESTIMATING..." : loading ? "PROCESSING..." : "START LIP SYNC"} 
          onPress={handleEstimateCost}
          disabled={loading || isEstimating || !video || !audio}
          style={styles.generateBtn} 
          textStyle={styles.generateBtnText} 
        />
      </ScrollView>

      <ConfirmCostModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleGenerate}
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
    backgroundColor: '#EC4899',
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
