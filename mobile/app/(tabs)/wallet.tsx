import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

const TRANSACTIONS = [
  {
    id: '1',
    title: 'Starbucks Coffee',
    date: 'Today, 9:41 AM',
    amount: '-$8.20',
    positive: false,
    iconName: 'cup.and.saucer.fill' as const,
    iconBg: '#16A34A',
    iconColor: '#FFFFFF',
  },
  {
    id: '2',
    title: 'Apple Subscription',
    date: 'Yesterday, 11:00 AM',
    amount: '-$10.50',
    positive: false,
    iconName: 'apple.logo' as const,
    iconBg: '#3A3A4A',
    iconColor: '#CCCCDD',
  },
  {
    id: '3',
    title: 'Refund: Zara',
    date: 'Jul 28, 3:15 PM',
    amount: '+$12.50',
    positive: true,
    iconName: 'arrow.uturn.left.circle.fill' as const,
    iconBg: '#92400E',
    iconColor: '#FCD34D',
  },
];

export default function WalletScreen() {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitials}>LR</Text>
              </View>
            </View>
          </View>
          <Text style={styles.profileName}>Liam Roberts</Text>
          <Text style={styles.profileHandle}>@liamroberts</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>Pro Member</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$3,840.50</Text>

          <View style={styles.trendRow}>
            <View style={styles.trendBadge}>
              <SymbolView
                name={'arrow.up.right' as any}
                size={11}
                tintColor="#22C55E"
                style={styles.trendIcon}
              />
              <Text style={styles.trendText}>+2.4% this month</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.depositButton]} activeOpacity={0.82}>
              <SymbolView name={'plus.circle.fill' as any} size={18} tintColor="#FFFFFF" style={styles.actionIcon} />
              <Text style={[styles.actionText, styles.depositText]}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]} activeOpacity={0.82}>
              <SymbolView name={'minus.circle.fill' as any} size={18} tintColor="#F0F0FF" style={styles.actionIcon} />
              <Text style={[styles.actionText, styles.withdrawText]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Transactions</Text>
        <View style={styles.transactionList}>
          {TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={[styles.txIconCircle, { backgroundColor: tx.iconBg }]}>
                <SymbolView name={tx.iconName as any} size={20} tintColor={tx.iconColor} />
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, tx.positive ? styles.txAmountPositive : styles.txAmountNegative]}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#13131A',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },

  // Profile
  profileSection: {
    alignItems: 'center',
    paddingTop: 50,
  },
  avatarRing: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2,
    borderColor: 'rgba(155,81,224,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOuter: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(155,81,224,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '800',
    color: '#9B51E0',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F0F0FF',
    marginTop: 14,
  },
  profileHandle: {
    fontSize: 14,
    color: '#8888AA',
    marginTop: 4,
  },
  badgeContainer: {
    backgroundColor: 'rgba(155,81,224,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#9B51E0',
    fontWeight: '600',
  },

  // Balance Card
  balanceCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#1C1C28',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(155,81,224,0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#9B51E0',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
      web: { boxShadow: '0px 12px 40px rgba(155,81,224,0.2)' },
    }),
  },
  balanceLabel: {
    fontSize: 13,
    color: '#8888AA',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#F0F0FF',
    marginTop: 6,
    letterSpacing: -1,
  },

  // Trend
  trendRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendIcon: { marginRight: 4 },
  trendText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
  },
  depositButton: { backgroundColor: '#9B51E0' },
  withdrawButton: {
    backgroundColor: '#252535',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionIcon: { marginRight: 7 },
  actionText: { fontSize: 15, fontWeight: '700' },
  depositText: { color: '#FFFFFF' },
  withdrawText: { color: '#F0F0FF' },

  // Transactions
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F0FF',
    marginTop: 32,
    paddingHorizontal: 24,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  transactionList: {
    marginHorizontal: 24,
    marginTop: 12,
    gap: 12,
  },
  txCard: {
    backgroundColor: '#1C1C28',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  txDetails: { flex: 1 },
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F0FF',
  },
  txDate: {
    fontSize: 12,
    color: '#8888AA',
    marginTop: 3,
  },
  txAmount: { fontSize: 16, fontWeight: '700' },
  txAmountPositive: { color: '#22C55E' },
  txAmountNegative: { color: '#F0F0FF' },
});
