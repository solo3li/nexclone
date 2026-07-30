import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface ConfirmCostModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  estimatedCost: number | null;
  chargedWallet?: string | null;
}

export default function ConfirmCostModal({ visible, onClose, onConfirm, estimatedCost, chargedWallet }: ConfirmCostModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <SymbolView name="bolt.fill" size={20} tintColor="#E879F9" />
            </View>
            <View>
              <Text style={styles.title}>Confirm Action</Text>
              <Text style={styles.subtitle}>Credits will be deducted</Text>
            </View>
          </View>
          
          <View style={styles.costBox}>
            <Text style={styles.costLabel}>Estimated Cost:</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.costValue}>{estimatedCost ?? '?'} Credits</Text>
              {chargedWallet && (
                <Text style={styles.walletText}>(Will be deducted from: {chargedWallet})</Text>
              )}
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: '#0F0024',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(232, 121, 249, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  costBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  costLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  costValue: {
    color: '#E879F9',
    fontSize: 20,
    fontWeight: '700',
  },
  walletText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFF',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#D946EF', // Using a solid pinkish purple
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
