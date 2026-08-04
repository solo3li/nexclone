import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';
import CustomSelect, { SelectOption } from '@/components/CustomSelect';
import ConfirmCostModal from '@/components/ConfirmCostModal';
import api from '@/services/api';
import { useNotification } from '@/context/NotificationContext';
import { SymbolView } from 'expo-symbols';

interface OptionProfile {
  name: string;
  value: string;
}

export default function TextToSpeechScreen() {
  const [text, setText] = useState('');
  const [languageMode, setLanguageMode] = useState('arabic'); // 'arabic' or 'other'
  const [selectedQuality, setSelectedQuality] = useState('Standard');
  const [maxChars, setMaxChars] = useState(150);
  const [customInstructionsEnabled, setCustomInstructionsEnabled] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");

  const [voices, setVoices] = useState<any[]>([]);
  const [dialects, setDialects] = useState<OptionProfile[]>([]);
  const [emotions, setEmotions] = useState<OptionProfile[]>([]);
  const [styles, setStyles] = useState<OptionProfile[]>([]);

  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedDialect, setSelectedDialect] = useState<string>('');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedOtherLanguage, setSelectedOtherLanguage] = useState<string>('English');

  const [loading, setLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [chargedWallet, setChargedWallet] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isConnected } = useNotification();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [voicesRes, dialectsRes, emotionsRes, stylesRes, configRes] = await Promise.all([
          api.get("/platform/voices"),
          api.get("/platform/dialects"),
          api.get("/platform/emotions"),
          api.get("/platform/styles"),
          api.get("/platform/tts-config").catch(() => ({ data: { maxChars: 150, customInstructionsEnabled: false } }))
        ]);
        
        setVoices(voicesRes.data);
        if (voicesRes.data.length > 0) {
          setSelectedVoice(voicesRes.data[0].voiceName);
        }
        
        setDialects(dialectsRes.data);
        setEmotions(emotionsRes.data);
        setStyles(stylesRes.data);
        setMaxChars(configRes.data.maxChars || 150);
        setCustomInstructionsEnabled(configRes.data.customInstructionsEnabled || false);
      } catch (error) {
        console.error("Failed to load TTS config:", error);
      }
    };
    fetchConfig();
  }, []);

  const handleEstimateCost = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text first.');
      return;
    }
    if (text.length > maxChars) {
      Alert.alert('Error', `Exceeded maximum characters (${maxChars}). Please reduce text or upgrade your plan.`);
      return;
    }
    if (!selectedVoice) {
      Alert.alert('Error', 'Please select a voice.');
      return;
    }

    setIsEstimating(true);
    try {
      const response = await api.post("/ai/text-to-voice/estimate", { 
        text,
        language: languageMode,
        voiceName: selectedVoice,
        styleInstruction: customInstruction,
        quality: selectedQuality
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

  const handleGenerate = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const payload: any = {
        text,
        language: languageMode,
        voiceName: selectedVoice,
        quality: selectedQuality,
      };

      if (languageMode === 'other') {
        payload.targetLanguage = selectedOtherLanguage;
      } else {
        payload.dialect = selectedDialect;
        payload.emotion = selectedEmotion;
        payload.performanceStyle = selectedStyle;
        if (customInstructionsEnabled && customInstruction) {
          payload.styleInstruction = customInstruction;
        }
      }

      await api.post('/ai/text-to-voice/generate', payload);
      
      Alert.alert('Success', 'Your request has been submitted. You will receive a notification once the audio is ready.');
      setText('');
      setCustomInstruction('');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to generate audio';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const getVoiceOptions = (): SelectOption[] => {
    let filtered = voices;
    return filtered.map(v => ({
      label: `${v.displayName} (${v.gender})`,
      value: v.voiceName,
      isPremium: v.isPremium
    }));
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ title: 'Speech AI', headerStyle: { backgroundColor: '#13131A' }, headerTintColor: '#F0F0FF' }} />
        
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
            maxLength={maxChars}
          />
          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>{text.length} / {maxChars}</Text>
          </View>
        </SoftCard>

        <Text style={styles.sectionTitle}>VOICE SETTINGS</Text>
        <SoftCard style={styles.settingsCard}>
          
          <View style={styles.modeTabs}>
            <TouchableOpacity 
              style={[styles.modeTab, languageMode === 'arabic' && styles.modeTabActive]}
              onPress={() => setLanguageMode('arabic')}
            >
              <Text style={[styles.modeTabText, languageMode === 'arabic' && styles.modeTabTextActive]}>🇸🇦 Arabic</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeTab, languageMode === 'other' && styles.modeTabActive]}
              onPress={() => setLanguageMode('other')}
            >
              <Text style={[styles.modeTabText, languageMode === 'other' && styles.modeTabTextActive]}>🌐 Other Languages</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            <CustomSelect 
              label="Quality"
              options={[
                { label: 'Standard', value: 'Standard' },
                { label: 'High (HQ)', value: 'High', isPremium: true }
              ]}
              selectedValue={selectedQuality}
              onSelect={setSelectedQuality}
              iconName="star.fill"
            />

            <CustomSelect 
              label="Voice"
              options={getVoiceOptions()}
              selectedValue={selectedVoice}
              onSelect={setSelectedVoice}
              placeholder="Select a voice"
              iconName="person.fill"
            />

            {languageMode === 'other' ? (
              <CustomSelect 
                label="Target Language"
                options={[
                  { label: 'English', value: 'English' },
                  { label: 'French', value: 'French' },
                  { label: 'Spanish', value: 'Spanish' },
                  { label: 'German', value: 'German' },
                  { label: 'Chinese', value: 'Chinese' },
                  { label: 'Japanese', value: 'Japanese' },
                ]}
                selectedValue={selectedOtherLanguage}
                onSelect={setSelectedOtherLanguage}
                iconName="globe"
              />
            ) : (
              <>
                <CustomSelect 
                  label="Dialect"
                  options={[{ label: 'Auto (Default)', value: '' }, ...dialects.map(d => ({ label: d.name, value: d.value }))]}
                  selectedValue={selectedDialect}
                  onSelect={setSelectedDialect}
                  iconName="map.fill"
                />
                
                <CustomSelect 
                  label="Emotion"
                  options={[{ label: 'Neutral (Default)', value: '' }, ...emotions.map(e => ({ label: e.name, value: e.value }))]}
                  selectedValue={selectedEmotion}
                  onSelect={setSelectedEmotion}
                  iconName="heart.fill"
                />

                <CustomSelect 
                  label="Style"
                  options={[{ label: 'Default', value: '' }, ...styles.map(s => ({ label: s.name, value: s.value }))]}
                  selectedValue={selectedStyle}
                  onSelect={setSelectedStyle}
                  iconName="sparkles"
                />

                {customInstructionsEnabled && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Custom Instructions</Text>
                    <TextInput
                      style={styles.customInstructionInput}
                      placeholder="e.g. Speak slowly and enthusiastically..."
                      placeholderTextColor="#555570"
                      value={customInstruction}
                      onChangeText={setCustomInstruction}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        </SoftCard>

        <CustomButton 
          title={isEstimating ? "ESTIMATING..." : loading ? "GENERATING..." : "GENERATE SPEECH"} 
          onPress={handleEstimateCost}
          disabled={loading || isEstimating || !text.trim() || !selectedVoice}
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
    color: '#F0F0FF',
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  charCount: {
    fontSize: 12,
    color: '#8888AA',
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  modeTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modeTabActive: {
    backgroundColor: '#13131A',
    borderBottomWidth: 2,
    borderBottomColor: '#9B51E0',
  },
  modeTabText: {
    color: '#8888AA',
    fontWeight: '600',
    fontSize: 14,
  },
  modeTabTextActive: {
    color: '#9B51E0',
  },
  settingsContent: {
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8888AA',
    marginBottom: 6,
    marginLeft: 4,
  },
  customInstructionInput: {
    backgroundColor: '#1C1C28',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#F0F0FF',
  },
  generateBtn: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#9B51E0',
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },
});
