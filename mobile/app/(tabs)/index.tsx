import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Link } from 'expo-router';

type ToolCard = {
  title: string;
  subtitle: string;
  href: string;
  iconBg: string;
  iconTint: string;
  symbolName: string;
};

type ActivityItem = {
  id: string;
  label: string;
  time: string;
  dotColor: string;
};

const TOOLS: ToolCard[] = [
  {
    title: 'Text to Speech',
    subtitle: 'Convert text to natural voices',
    href: '/tools/text-to-speech',
    iconBg: 'rgba(155,81,224,0.15)',
    iconTint: '#9B51E0',
    symbolName: 'mic.fill',
  },
  {
    title: 'Image to Video',
    subtitle: 'Animate images with AI motion',
    href: '/tools/image-to-video',
    iconBg: 'rgba(79,70,229,0.15)',
    iconTint: '#4F46E5',
    symbolName: 'film.fill',
  },
  {
    title: 'Lip Sync',
    subtitle: 'Sync audio to video seamlessly',
    href: '/tools/advanced-lip-sync',
    iconBg: 'rgba(236,72,153,0.15)',
    iconTint: '#EC4899',
    symbolName: 'waveform',
  },
  {
    title: 'Voice to Text',
    subtitle: 'Accurate AI transcription',
    href: '/tools/voice-to-text',
    iconBg: 'rgba(34,197,94,0.15)',
    iconTint: '#22C55E',
    symbolName: 'doc.text.viewfinder',
  },
];

const ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    label: 'Text to Speech — "Product Launch Script"',
    time: '2 min ago',
    dotColor: '#9B51E0',
  },
  {
    id: '2',
    label: 'Image to Video — "Hero Banner Render"',
    time: '1 hr ago',
    dotColor: '#4F46E5',
  },
];

export default function DashboardScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Good Morning 👋</Text>
          <Text style={styles.headerSubtitle}>Your AI workspace is ready</Text>
        </View>
        <View style={styles.bellButton}>
          <SymbolView name={'bell.fill' as any} size={18} tintColor="#8888AA" />
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { marginRight: 10 }]}>
          <View style={[styles.statIconCircle, { backgroundColor: 'rgba(155,81,224,0.15)' }]}>
            <SymbolView name={'folder.fill' as any} size={18} tintColor="#9B51E0" />
          </View>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
        <View style={[styles.statCard, { marginLeft: 10 }]}>
          <View style={[styles.statIconCircle, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
            <SymbolView name={'bolt.fill' as any} size={18} tintColor="#22C55E" />
          </View>
          <Text style={styles.statNumber}>4,200</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </View>
      </View>

      {/* AI Tools section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AI Tools</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href as any} asChild>
            <TouchableOpacity style={styles.toolCard} activeOpacity={0.75}>
              <View style={[styles.toolIconCircle, { backgroundColor: tool.iconBg }]}>
                <SymbolView name={tool.symbolName as any} size={22} tintColor={tool.iconTint} />
              </View>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
              <View style={[styles.accentDot, { backgroundColor: tool.iconTint }]} />
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
      </View>
      <View style={styles.activityList}>
        {ACTIVITY.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.activityItem,
              index === ACTIVITY.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={[styles.activityDot, { backgroundColor: item.dotColor }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityLabel} numberOfLines={1}>
                {item.label}
              </Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
            <SymbolView name={'chevron.right' as any} size={12} tintColor="#3C3C58" />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131A',
  },
  contentContainer: {
    paddingBottom: 48,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F0F0FF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8888AA',
    marginTop: 4,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C28',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1C1C28',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F0F0FF',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8888AA',
    marginTop: 2,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F0F0FF',
    letterSpacing: -0.2,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9B51E0',
  },

  // Tools grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  toolCard: {
    width: '48%',
    height: 160,
    backgroundColor: '#1C1C28',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  toolIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F0FF',
    marginTop: 14,
    letterSpacing: -0.2,
  },
  toolSubtitle: {
    fontSize: 11,
    color: '#8888AA',
    marginTop: 4,
    lineHeight: 16,
  },
  accentDot: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.12,
  },

  // Activity
  activityList: {
    marginHorizontal: 24,
    backgroundColor: '#1C1C28',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    marginRight: 8,
  },
  activityLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#D0D0EE',
  },
  activityTime: {
    fontSize: 11,
    color: '#5C5C7A',
    marginTop: 3,
  },
});
