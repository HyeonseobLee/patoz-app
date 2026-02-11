import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import AppHeader from '../components/AppHeader';
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
      <AppHeader title="정비 이력" showDivider />

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
  },
  list: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  date: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  center: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
});
