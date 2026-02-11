import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'MaintenanceDetail'>;

export default function MaintenanceDetailScreen({ route }: Props) {
  const { history, devices } = useAppContext();
  const [, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      return () => {};
    }, [])
  );

  const targetHistory = useMemo(() => {
    return history.find((item) => item.id === route.params.historyId) ?? null;
  }, [history, route.params.historyId]);

  const targetDevice = useMemo(() => {
    if (!targetHistory) {
      return null;
    }

    return devices.find((device) => device.id === targetHistory.deviceId) ?? null;
  }, [devices, targetHistory]);

  const completedText = targetHistory?.completedDate ?? '진행 중';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <Text style={styles.pageTitle}>정비 상세</Text>

        {targetHistory ? (
          <>
            <View style={[ui.card, styles.card]}>
              <Text style={styles.sectionTitle}>기기 정보</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>모델</Text>
                <Text style={styles.fieldValue}>{targetDevice?.modelName ?? '등록되지 않은 기기'}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>시리얼 번호</Text>
                <Text style={styles.fieldValue}>{targetDevice?.serialNumber ?? '-'}</Text>
              </View>
            </View>

            <View style={[ui.card, styles.card]}>
              <Text style={styles.sectionTitle}>정비 일정</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>접수 일자</Text>
                <Text style={styles.fieldValue}>{targetHistory.receivedDate}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>완료 일자</Text>
                <Text style={styles.fieldValue}>{completedText}</Text>
              </View>
              <View style={[styles.statusBadge, !targetHistory.completedDate && styles.statusBadgeActive]}>
                <Text style={[styles.statusText, !targetHistory.completedDate && styles.statusTextActive]}>{targetHistory.status}</Text>
              </View>
            </View>

            <View style={[ui.card, styles.card]}>
              <Text style={styles.sectionTitle}>정비 내용 / 수리 항목</Text>
              <Text style={styles.bodyText}>{targetHistory.description}</Text>
            </View>

            <View style={[ui.card, styles.card]}>
              <Text style={styles.sectionTitle}>기타 메모</Text>
              <Text style={styles.bodyText}>{targetHistory.notes ?? '추가 메모가 없습니다.'}</Text>
            </View>
          </>
        ) : (
          <View style={[ui.card, styles.card]}>
            <Text style={styles.sectionTitle}>정비 내역을 찾을 수 없습니다.</Text>
          </View>
        )}
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
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  fieldGroup: {
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  fieldValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusBadgeActive: {
    backgroundColor: '#DBEAFE',
  },
  statusText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextActive: {
    color: colors.brand,
  },
  bodyText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
});
