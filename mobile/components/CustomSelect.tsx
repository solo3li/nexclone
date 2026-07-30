import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';

export interface SelectOption {
  label: string;
  value: string;
  isPremium?: boolean;
}

interface CustomSelectProps {
  label: string;
  options: SelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  iconName?: any;
}

export default function CustomSelect({ label, options, selectedValue, onSelect, placeholder, iconName }: CustomSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(o => o.value === selectedValue);

  return (
    <>
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity 
          style={styles.selectBox} 
          activeOpacity={0.7} 
          onPress={() => setModalVisible(true)}
        >
          {iconName && (
            <View style={styles.iconContainer}>
              <SymbolView name={iconName} size={16} tintColor="#8888AA" />
            </View>
          )}
          <Text style={[styles.selectText, !selectedOption && styles.placeholderText]}>
            {selectedOption ? selectedOption.label : (placeholder || 'Select an option...')}
          </Text>
          <SymbolView name="chevron.down" size={16} tintColor="#555570" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder || label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <SymbolView name="xmark" size={20} tintColor="#8888AA" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList} contentContainerStyle={{ paddingBottom: 40 }}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionItem, selectedValue === opt.value && styles.optionItemSelected]}
                  onPress={() => {
                    onSelect(opt.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, selectedValue === opt.value && styles.optionTextSelected]}>
                    {opt.label}
                  </Text>
                  {opt.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumText}>⭐</Text>
                    </View>
                  )}
                  {selectedValue === opt.value && (
                    <SymbolView name="checkmark" size={16} tintColor="#9B51E0" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8888AA',
    marginBottom: 6,
    marginLeft: 4,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C28',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  iconContainer: {
    marginRight: 10,
  },
  selectText: {
    fontSize: 14,
    color: '#F0F0FF',
    flex: 1,
  },
  placeholderText: {
    color: '#555570',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#13131A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 300,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F0FF',
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(155,81,224,0.1)',
  },
  optionText: {
    fontSize: 15,
    color: '#F0F0FF',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#9B51E0',
  },
  premiumBadge: {
    marginLeft: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumText: {
    fontSize: 10,
  },
});
