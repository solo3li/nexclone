import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Image, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';

export default function ImageToVideoScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('The speaker talks naturally to camera');
  const [loading, setLoading] = useState(false);
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

  const handleGenerate = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg'
      } as any);
      formData.append('prompt', prompt);

      await api.post('/Video/start-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      Alert.alert('Success', 'Your video is generating. We will notify you when it is ready.');
      setImage(null);
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to generate video';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <Text style={styles.sectionTitle}>ANIMATION PROMPT</Text>
      <SoftCard style={styles.card}>
        <TextInput
          style={styles.textArea}
          placeholder="Describe how the avatar should act..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
      </SoftCard>

      <CustomButton 
        title={loading ? "GENERATING..." : "START GENERATION"} 
        onPress={handleGenerate}
        disabled={loading || !image}
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
    backgroundColor: '#4F46E5',
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
