import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { RootTabParamList } from '../navigation/types';
import { colors, spacing } from '../styles/theme';
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
      <Text style={styles.title}>정비 접수</Text>

      <View style={ui.card}>
        <Text style={styles.label}>접수 내용</Text>
        <TextInput onChangeText={setIntake} placeholder="접수 내용" style={ui.input} value={intake} />

        <Text style={styles.label}>증상 설명</Text>
        <TextInput
          multiline
          numberOfLines={4}
          onChangeText={setSymptoms}
          placeholder="증상 설명"
          style={[ui.input, styles.textArea]}
          textAlignVertical="top"
          value={symptoms}
        />

        <Pressable onPress={handleSubmit} style={[ui.primaryButton, styles.submitButton]}>
          <Text style={ui.primaryButtonText}>제출</Text>
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
    padding: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  textArea: {
    minHeight: 120,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
});
