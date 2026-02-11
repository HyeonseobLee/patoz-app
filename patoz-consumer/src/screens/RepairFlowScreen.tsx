import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import AppHeader from '../components/AppHeader';
import { useAppContext } from '../context/AppContext';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = BottomTabScreenProps<RootTabParamList, 'RepairFlow'>;

export default function RepairFlowScreen({ navigation }: Props) {
  const { addInquiry } = useAppContext();
  const [intake, setIntake] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = () => {
    addInquiry({ intake, symptoms });
    setIntake('');
    setSymptoms('');
    navigation.navigate('MaintenanceHistory');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="정비 접수" showDivider />

      <View style={[ui.card, styles.formCard]}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>접수 내용</Text>
          <TextInput
            onChangeText={setIntake}
            placeholder="접수 내용"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={intake}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>증상 설명</Text>
          <TextInput
            multiline
            numberOfLines={4}
            onChangeText={setSymptoms}
            placeholder="증상 설명"
            placeholderTextColor="#94A3B8"
            style={[styles.input, styles.textArea]}
            textAlignVertical="top"
            value={symptoms}
          />
        </View>

        <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>제출</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.lg,
  },
  formCard: {
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
  },
  formGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 16,
    padding: spacing.md,
  },
  textArea: {
    minHeight: 120,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    height: 56,
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
