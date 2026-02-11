import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RepairStatus'>;

const timelineSteps = ['접수 완료', '점검 중', '부품 준비', '수리 진행 중', '완료 예정'] as const;
const currentStep = '수리 진행 중';

export default function RepairStatusScreen({ navigation }: Props) {
  const [, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <Text style={styles.pageTitle}>수리 진행 현황</Text>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>서비스 센터</Text>
          <Text style={styles.sectionTitle}>PATOZ Service Seoul</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>담당 기사</Text>
            <Text style={styles.metaValue}>홍길동 기사</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>연락처</Text>
            <Text style={styles.metaValue}>02-1234-5678</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{currentStep}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>수리 타임라인</Text>
          <View style={styles.timelineList}>
            {timelineSteps.map((step, index) => {
              const isActive = step === currentStep;

              return (
                <View key={step} style={styles.timelineRow}>
                  <View style={[styles.timelineDot, isActive && styles.timelineDotActive]} />
                  <Text style={[styles.timelineText, isActive && styles.timelineTextActive]}>
                    {index + 1}. {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>예상 수리 정보</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>예상 수리 항목</Text>
            <Text style={styles.metaValue}>후륜 브레이크 패드 교체</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>예상 완료 시간</Text>
            <Text style={styles.metaValue}>오늘 18:00</Text>
          </View>
        </View>

        <Pressable onPress={() => navigation.goBack()} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </Pressable>
      </ScrollView>
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
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  metaRow: {
    marginTop: spacing.xs,
  },
  metaLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
  },
  timelineList: {
    gap: spacing.sm,
  },
  timelineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timelineDot: {
    backgroundColor: '#CBD5E1',
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  timelineDotActive: {
    backgroundColor: colors.brand,
    height: 12,
    width: 12,
  },
  timelineText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  timelineTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
