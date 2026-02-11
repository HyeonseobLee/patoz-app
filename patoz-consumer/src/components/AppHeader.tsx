import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../styles/theme';

type AppHeaderProps = {
  title: string;
  showDivider?: boolean;
};

export default function AppHeader({ title, showDivider = false }: AppHeaderProps) {
  return (
    <View style={[styles.container, showDivider && styles.withDivider]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  withDivider: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  title: {
    color: colors.brand,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
