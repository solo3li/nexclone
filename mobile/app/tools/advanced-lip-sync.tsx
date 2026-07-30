import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Image } from 'react-native';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';

export default function AdvancedLipSyncScreen() {
  const [video, setVideo] = useState<string | null>(null);
  const [audio, setAudio] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
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
        setAudio(result.assets[0]);
      }
    } catch (err) {
      console.log('Error picking audio file', err);
    }
  };

  const handleGenerate = async () => {
    if (!video || !audio) {
      Alert.alert('Error', 'Please select both a video and an audio file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', {
        uri: video,
        name: 'video.mp4',
        type: 'video/mp4'
      } as any);
      formData.append('audio', {
        uri: audio.uri,
        name: audio.name,
        type: audio.mimeType || 'audio/mpeg'
      } as any);

      await api.post('/Video/start-lipsync', formData, {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Lip Sync AI', headerStyle: { backgroundColor: '#13131A' }, headerTintColor: '#F0F0FF' }} />
      
      <Text style={styles.title}>Advanced Lip Sync</Text>
      <Text style={styles.subtitle}>
        Sync audio perfectly with any video.
        {isConnected ? ' (SignalR Connected)' : ' (Connecting...)'}
      </Text>

      <Text style={styles.sectionTitle}>UPLOAD VIDEO</Text>
      <SoftCard style={styles.card}>
        <View style={styles.uploadArea}>
          <Text style={styles.uploadLabel}>{video ? "Video Selected ✓" : 'Select a video with a clear face'}</Text>
          <CustomButton 
            title={video ? "Change Video" : "Choose Video"} 
            onPress={handlePickVideo} 
            style={styles.pickBtn}
          />
        </View>
      </SoftCard>

      <Text style={styles.sectionTitle}>UPLOAD AUDIO</Text>
      <SoftCard style={styles.card}>
        <View style={styles.uploadArea}>
          <Text style={styles.uploadLabel}>{audio ? audio.name : 'Select the audio to sync'}</Text>
          <CustomButton 
            title={audio ? "Change Audio" : "Choose Audio"} 
            onPress={handlePickAudio} 
            style={styles.pickBtn}
          />
        </View>
      </SoftCard>

      <CustomButton 
        title={loading ? "PROCESSING..." : "START LIP SYNC"} 
        onPress={handleGenerate}
        disabled={loading || !video || !audio}
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
    paddingVertical: 10,
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
    backgroundColor: '#EC4899',
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
