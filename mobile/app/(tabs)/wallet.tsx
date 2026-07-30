import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { SymbolView } from 'expo-symbols';
import Colors from '@/constants/Colors';
import SoftCard from '@/components/SoftCard';

export default function WalletScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image source={require('@/assets/images/favicon.png')} style={styles.avatar} />
          <View style={styles.badge}>
            <SymbolView name={{ ios: 'person.fill', android: 'person', web: 'person' } as any} size={14} tintColor="#fff" />
          </View>
        </View>
        <Text style={styles.profileName}>Liam Roberts</Text>
        <Text style={styles.profileHandle}>@liamroberts</Text>
      </View>

      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balanceAmount}>$3,840.50</Text>
        <View style={styles.balanceUnderline} />
        
        <View style={styles.actionButtons}>
          <SoftCard style={styles.actionBtn}>
            <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' } as any} size={18} tintColor={Colors.light.tint} />
            <Text style={styles.actionBtnText}>Deposit</Text>
          </SoftCard>
          <SoftCard style={styles.actionBtn}>
            <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' } as any} size={18} tintColor={Colors.light.text} />
            <Text style={styles.actionBtnTextDark}>Withdraw</Text>
          </SoftCard>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transaction History</Text>
      <View style={styles.historyList}>
        <SoftCard style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={[styles.historyIcon, { backgroundColor: '#dcfce7' }]}>
               <SymbolView name={{ ios: 'cup.and.saucer.fill', android: 'local_cafe', web: 'local_cafe' } as any} size={20} tintColor="#16a34a" />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyTitle}>Starbucks Coffee</Text>
              <Text style={styles.historyDate}>14 Oct, 08:30 AM</Text>
            </View>
            <Text style={styles.historyAmountNegative}>- $8.20</Text>
          </View>
        </SoftCard>
        
        <SoftCard style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={[styles.historyIcon, { backgroundColor: '#f1f5f9' }]}>
               <SymbolView name={{ ios: 'applelogo', android: 'apple', web: 'apple' } as any} size={20} tintColor="#000" />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyTitle}>Apple Subscription</Text>
              <Text style={styles.historyDate}>13 Oct, 11:15 AM</Text>
            </View>
            <Text style={styles.historyAmountNegative}>- $10.50</Text>
          </View>
        </SoftCard>

        <SoftCard style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={[styles.historyIcon, { backgroundColor: '#fef3c7' }]}>
               <SymbolView name={{ ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' } as any} size={20} tintColor="#d97706" />
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyTitle}>Refund: Zara</Text>
              <Text style={styles.historyDate}>13 Oct, 11:15 AM</Text>
            </View>
            <Text style={styles.historyAmountPositive}>+ $12.50</Text>
          </View>
        </SoftCard>
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
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.tint,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  profileHandle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.light.text,
  },
  balanceUnderline: {
    width: 100,
    height: 4,
    backgroundColor: Colors.light.tint,
    borderRadius: 2,
    marginTop: 8,
    opacity: 0.3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginVertical: 0,
  },
  actionBtnText: {
    color: Colors.light.tint,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  actionBtnTextDark: {
    color: Colors.light.text,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    padding: 16,
    marginVertical: 0,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  historyAmountNegative: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  historyAmountPositive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
});
