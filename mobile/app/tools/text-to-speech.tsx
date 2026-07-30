import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';
import CustomButton from '@/components/CustomButton';

export default function TextToSpeechScreen() {
  const [text, setText] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Speech AI' }} />
      
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
          <SymbolView name={{ ios: 'mic.fill', android: 'mic', web: 'mic' } as any} size={18} tintColor={Colors.light.textSecondary} />
        </View>
      </SoftCard>

      <Text style={styles.sectionTitle}>VOICE SETTINGS</Text>
      <SoftCard style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Voice</Text>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>Ava (Female, USA)</Text>
            <SymbolView name={{ ios: 'chevron.up.chevron.down', android: 'unfold_more', web: 'unfold_more' } as any} size={16} tintColor={Colors.light.textSecondary} />
          </View>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <SymbolView name={{ ios: 'speedometer', android: 'speed', web: 'speed' } as any} size={16} tintColor={Colors.light.text} />
               <Text style={styles.sliderLabel}>SPEED</Text>
            </View>
            <Text style={styles.sliderValue}>1.0x</Text>
          </View>
          {/* Mock Slider Track */}
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: '50%' }]} />
            <View style={styles.sliderThumb} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderScale}>0.5x</Text>
            <Text style={styles.sliderScale}>1.0x (Normal)</Text>
            <Text style={styles.sliderScale}>2.0x</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <SymbolView name={{ ios: 'slider.vertical.3', android: 'tune', web: 'tune' } as any} size={16} tintColor={Colors.light.text} />
               <Text style={styles.sliderLabel}>PITCH</Text>
            </View>
            <Text style={styles.sliderValue}>Neutral</Text>
          </View>
          {/* Mock Slider Track */}
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: '50%' }]} />
            <View style={styles.sliderThumb} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderScale}>Low</Text>
            <Text style={styles.sliderScale}>Neutral</Text>
            <Text style={styles.sliderScale}>High</Text>
          </View>
        </View>

      </SoftCard>

      <CustomButton 
        title="GENERATE SPEECH" 
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
    marginRight: 8,
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
    marginRight: 8,
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
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 6,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Colors.light.tint,
    position: 'absolute',
    left: '50%',
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderScale: {
    fontSize: 12,
    color: Colors.light.textSecondary,
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
