import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { HistoryItem } from '../data/mock';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'MaintenanceHistory'>;

type StatusStyle = {
  badgeBg: string;
  textColor: string;
};

const toTimestamp = (date: string) => new Date(date).getTime();

const statusStyleMap: Record<string, StatusStyle> = {
  '접수 완료': { badgeBg: '#E5E7EB', textColor: '#4B5563' },
  '점검 중': { badgeBg: '#DBEAFE', textColor: '#1D4ED8' },
  '수리 진행 중': { badgeBg: '#FFEDD5', textColor: '#C2410C' },
  완료: { badgeBg: '#DCFCE7', textColor: '#166534' },
};

const getStatusStyle = (status: string): StatusStyle => {
  return statusStyleMap[status] ?? { badgeBg: '#E2E8F0', textColor: '#334155' };
};

export default function MaintenanceHistoryScreen({ navigation, route }: Props) {
  const { history, selectedDeviceId } = useAppContext();
  const [, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      return () => {};
    }, [])
  );

  const targetDeviceId = route.params?.deviceId ?? selectedDeviceId;

  const sortedHistory = useMemo(() => {
    const filtered = targetDeviceId ? history.filter((item) => item.deviceId === targetDeviceId) : history;

    return [...filtered].sort((a, b) => {
      const aIncomplete = !a.completedDate;
      const bIncomplete = !b.completedDate;

      if (aIncomplete !== bIncomplete) {
        return aIncomplete ? -1 : 1;
      }

      return toTimestamp(b.receivedDate) - toTimestamp(a.receivedDate);
    });
  }, [history, targetDeviceId]);

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <Pressable
        onPress={() => navigation.navigate('MaintenanceDetail', { historyId: item.id })}
        style={[ui.card, styles.card]}
      >
        <View style={styles.topRow}>          <Text style={styles.itemTitle}>정비 내역</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.badgeBg }]}>            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>          <Text style={styles.metaLabel}>접수</Text>
          <Text style={styles.metaValue}>{item.receivedDate}</Text>
        </View>
        <View style={styles.metaRow}>          <Text style={styles.metaLabel}>완료</Text>
          <Text style={styles.metaValue}>{item.completedDate ?? '진행 중'}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>      <Text style={styles.pageTitle}>정비 이력</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={sortedHistory}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyStateCard}>            <Text style={styles.emptyTitle}>선택한 기기의 정비 이력이 없습니다.</Text>
            <Text style={styles.emptyDescription}>새 정비 접수를 진행하면 이곳에 표시됩니다.</Text>
          </View>
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  card: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
    minHeight: 84,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyStateCard: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyDescription: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
