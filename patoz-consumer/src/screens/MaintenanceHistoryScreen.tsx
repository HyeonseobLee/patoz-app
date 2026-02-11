import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { HistoryItem } from '../data/mock';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = BottomTabScreenProps<RootTabParamList, 'MaintenanceHistory'>;

const toTimestamp = (date: string) => new Date(date).getTime();

export default function MaintenanceHistoryScreen({ navigation }: Props) {
  const { history } = useAppContext();
  const [, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      return () => {};
    }, [])
  );

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      const aIncomplete = !a.completedDate;
      const bIncomplete = !b.completedDate;

      if (aIncomplete !== bIncomplete) {
        return aIncomplete ? -1 : 1;
      }

      return toTimestamp(b.receivedDate) - toTimestamp(a.receivedDate);
    });
  }, [history]);

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const isIncomplete = !item.completedDate;

    return (
      <Pressable
        onPress={() => navigation.navigate('MaintenanceDetail', { historyId: item.id })}
        style={[ui.card, styles.card, isIncomplete && styles.incompleteCard]}
      >
        <View style={styles.topRow}>
          <Text style={styles.itemTitle}>정비 내역</Text>
          <View style={[styles.statusBadge, isIncomplete ? styles.statusBadgeActive : styles.statusBadgeNeutral]}>
            <Text style={[styles.statusText, isIncomplete ? styles.statusTextActive : styles.statusTextNeutral]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>접수 일자</Text>
          <Text style={styles.metaValue}>{item.receivedDate}</Text>
        </View>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>정비 완료 일자</Text>
          <Text style={styles.metaValue}>{item.completedDate ?? '진행 중'}</Text>
        </View>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>정비 진행 상태</Text>
          <Text style={styles.metaValue}>{item.status}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>정비 이력</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={sortedHistory}
        keyExtractor={(item) => item.id}
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
    gap: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  incompleteCard: {
    backgroundColor: '#F8FAFF',
    borderColor: colors.brand,
    borderWidth: 1.5,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#DBEAFE',
  },
  statusBadgeNeutral: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextActive: {
    color: colors.brand,
  },
  statusTextNeutral: {
    color: '#475569',
  },
  metaBlock: {
    marginTop: spacing.xs,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
});
