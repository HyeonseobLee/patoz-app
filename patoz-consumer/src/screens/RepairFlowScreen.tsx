import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = BottomTabScreenProps<RootTabParamList, 'RepairFlow'>;

const issueOptions = ['브레이크', '타이어', '배터리', '기타'] as const;
type IssueOption = (typeof issueOptions)[number];

export default function RepairFlowScreen({ navigation }: Props) {
  const [selectedIssues, setSelectedIssues] = useState<IssueOption[]>([]);
  const [etcDetail, setEtcDetail] = useState('');
  const [, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      return () => {};
    }, [])
  );

  const hasEtcSelected = useMemo(() => selectedIssues.includes('기타'), [selectedIssues]);

  const toggleIssue = (issue: IssueOption) => {
    setSelectedIssues((prev) => {
      if (prev.includes(issue)) {
        return prev.filter((item) => item !== issue);
      }

      return [...prev, issue];
    });
  };

  const handleSubmit = () => {
    if (selectedIssues.length === 0) {
      Alert.alert('알림', '진단 항목을 1개 이상 선택해주세요.');
      return;
    }

    const intake = selectedIssues
      .map((issue) => (issue === '기타' && etcDetail.trim() ? `기타(${etcDetail.trim()})` : issue))
      .join(', ');

    navigation.navigate('RepairRequest', {
      intake,
      symptoms: etcDetail.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>AI 간편 진단</Text>

        <View style={[ui.card, styles.formCard]}>
          <Text style={styles.formTitle}>진단 항목 선택</Text>
          <Text style={styles.helperText}>해당되는 항목을 모두 선택해주세요.</Text>

          <View style={styles.checkboxList}>
            {issueOptions.map((issue) => {
              const isSelected = selectedIssues.includes(issue);

              return (
                <TouchableOpacity key={issue} activeOpacity={0.8} onPress={() => toggleIssue(issue)} style={styles.checkboxRow}>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>{isSelected ? <View style={styles.checkboxInner} /> : null}</View>
                  <Text style={styles.checkboxLabel}>{issue}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {hasEtcSelected ? (
            <TextInput
              multiline
              numberOfLines={6}
              onChangeText={setEtcDetail}
              placeholder="기타 진단 내용을 입력해주세요"
              placeholderTextColor="#94A3B8"
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
              value={etcDetail}
            />
          ) : null}

          <Pressable onPress={handleSubmit} style={styles.submitButton}>
            <Ionicons color={colors.white} name="sparkles" size={18} style={styles.submitButtonIcon} />
            <Text style={styles.submitButtonText}>AI 진단 시작</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  formCard: {
    gap: spacing.md,
    padding: spacing.xl,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  checkboxList: {
    gap: spacing.sm,
  },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
    borderRadius: 6,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  checkboxSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: colors.brand,
  },
  checkboxInner: {
    backgroundColor: colors.brand,
    borderRadius: 2,
    height: 10,
    width: 10,
  },
  checkboxLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: spacing.md,
  },
  textArea: {
    minHeight: 230,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  submitButtonIcon: {
    marginRight: spacing.xs,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
