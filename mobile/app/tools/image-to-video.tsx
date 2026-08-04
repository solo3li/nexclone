import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Image, TextInput, TouchableOpacity } from 'react-native';
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

export default function ImageToVideoScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<{ uri: string, name: string, mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState('The speaker talks naturally to camera');
  
  const [loading, setLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [chargedWallet, setChargedWallet] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isConnected } = useNotification();

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
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
      console.log('Error picking audio:', err);
    }
  };

  const handleEstimateCost = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsEstimating(true);
    try {
      const response = await api.get("/video/estimate-avatar");
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
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg'
      } as any);
      
      if (prompt) {
        formData.append('prompt', prompt);
      }
      
      if (audio) {
        formData.append('audio', {
          uri: audio.uri,
          name: audio.name,
          type: audio.mimeType
        } as any);
      }

      await api.post('/video/start-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      Alert.alert('Success', 'Your video is generating. We will notify you when it is ready.');
      setImage(null);
      setAudio(null);
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to generate video';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: 'Video AI', headerStyle: { backgroundColor: '#13131A' }, headerTintColor: '#F0F0FF' }} />
        
        <Text style={styles.title}>Image to Video</Text>
        <Text style={styles.subtitle}>
          Bring your photos to life with AI avatars.
          {isConnected ? ' (SignalR Connected)' : ' (Connecting...)'}
        </Text>

        <Text style={styles.sectionTitle}>UPLOAD IMAGE</Text>
        <SoftCard style={styles.card}>
          <View style={styles.uploadArea}>
            {image ? (
              <Image source={{ uri: image }} style={styles.preview} />
            ) : (
              <Text style={styles.uploadLabel}>Select a photo of a face</Text>
            )}
            <CustomButton 
              title={image ? "Change Photo" : "Choose Photo"} 
              onPress={handlePickImage} 
              style={styles.pickBtn}
            />
          </View>
        </SoftCard>

        <Text style={styles.sectionTitle}>AUDIO (OPTIONAL)</Text>
        <SoftCard style={styles.card}>
          <TouchableOpacity style={styles.audioRow} onPress={handlePickAudio} activeOpacity={0.7}>
            <View style={styles.audioIconBox}>
              <SymbolView name="music.note" size={24} tintColor="#E879F9" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.audioLabel}>Lip-Sync Audio</Text>
              <Text style={styles.audioValue} numberOfLines={1}>
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

        <Text style={styles.sectionTitle}>ANIMATION PROMPT</Text>
        <SoftCard style={styles.card}>
          <TextInput
            style={styles.textArea}
            placeholder="Describe how the avatar should act..."
            placeholderTextColor="#555570"
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />
        </SoftCard>

        <CustomButton 
          title={isEstimating ? "ESTIMATING..." : loading ? "GENERATING..." : "START GENERATION"} 
          onPress={handleEstimateCost}
          disabled={loading || isEstimating || !image}
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
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 16,
    color: '#8888AA',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickBtn: {
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(232, 121, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioLabel: {
    fontSize: 14,
    color: '#F0F0FF',
    fontWeight: '600',
    marginBottom: 4,
  },
  audioValue: {
    fontSize: 13,
    color: '#8888AA',
  },
  textArea: {
    fontSize: 16,
    color: '#F0F0FF',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  generateBtn: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#E879F9',
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
