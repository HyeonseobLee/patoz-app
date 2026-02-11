import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../styles/theme';

export type Estimate = {
  id: string;
  vendorName: string;
  expectedCost: string;
  expectedDuration: string;
  rating: number;
  isNew?: boolean;
};

type EstimateCardProps = {
  estimate: Estimate;
  onPress: () => void;
};

export default function EstimateCard({ estimate, onPress }: EstimateCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.leftSection}>
        <View style={styles.titleRow}>
          <Text style={styles.vendorName}>{estimate.vendorName}</Text>
          {estimate.isNew ? (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>신규 견적</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.metaText}>예상 비용: {estimate.expectedCost}</Text>
        <Text style={styles.metaText}>예상 기간: {estimate.expectedDuration}</Text>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>별점</Text>
        <Text style={styles.ratingValue}>⭐ {estimate.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  leftSection: {
    flex: 1,
    paddingRight: spacing.md,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  vendorName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  metaText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: colors.navyCard,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
