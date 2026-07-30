import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, Alex</Text>
        <Text style={styles.subtitle}>Explore your AI workspace</Text>
      </View>

      <Text style={styles.sectionTitle}>Popular AI Tools</Text>
      <View style={styles.grid}>
        <Link href="/tools/text-to-speech" asChild>
          <TouchableOpacity style={styles.gridItem} activeOpacity={0.7}>
            <SoftCard style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: '#f3e8ff' }]}>
                <SymbolView name={{ ios: 'mic.fill', android: 'mic', web: 'mic' } as any} size={24} tintColor={Colors.light.tint} />
              </View>
              <Text style={styles.cardTitle}>Text to Speech</Text>
              <Text style={styles.cardSubtitle}>Convert text to natural voices</Text>
            </SoftCard>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.gridItem} activeOpacity={0.7}>
          <SoftCard style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: '#e0e7ff' }]}>
              <SymbolView name={{ ios: 'photo.fill', android: 'image', web: 'image' } as any} size={24} tintColor="#4f46e5" />
            </View>
            <Text style={styles.cardTitle}>Image Generator</Text>
            <Text style={styles.cardSubtitle}>Generate visuals from text</Text>
          </SoftCard>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} activeOpacity={0.7}>
          <SoftCard style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: '#fce7f3' }]}>
              <SymbolView name={{ ios: 'waveform', android: 'graphic_eq', web: 'graphic_eq' } as any} size={24} tintColor="#db2777" />
            </View>
            <Text style={styles.cardTitle}>Lip Sync</Text>
            <Text style={styles.cardSubtitle}>Synchronize audio to video</Text>
          </SoftCard>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gridItem} activeOpacity={0.7}>
          <SoftCard style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: '#dcfce7' }]}>
              <SymbolView name={{ ios: 'scissors', android: 'content_cut', web: 'content_cut' } as any} size={24} tintColor="#16a34a" />
            </View>
            <Text style={styles.cardTitle}>Background Remover</Text>
            <Text style={styles.cardSubtitle}>Isolate subjects instantly</Text>
          </SoftCard>
        </TouchableOpacity>
      </View>
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
  header: {
    marginTop: 10,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    height: 170,
    justifyContent: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
});
