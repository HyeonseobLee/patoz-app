import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { HistoryItem } from '../data/mock';
import { colors, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

export default function MaintenanceHistoryScreen() {
  const { history } = useAppContext();

  const renderItem = ({ item }: { item: HistoryItem }) => {
    return (
      <View style={ui.card}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.center}>{item.center}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>정비 이력</Text>

      <FlatList
        contentContainerStyle={styles.list}
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  date: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  center: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
});
