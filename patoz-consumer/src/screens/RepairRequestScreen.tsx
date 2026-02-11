import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = BottomTabScreenProps<RootTabParamList, 'RepairRequest'>;

export default function RepairRequestScreen({ navigation, route }: Props) {
  const { addInquiry } = useAppContext();
  const { intake, symptoms } = route.params;

  const handleConfirm = () => {
    addInquiry({ intake, symptoms });
    Alert.alert('수리 접수가 완료되었습니다.');
    navigation.navigate('MaintenanceHistory');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>수리 접수</Text>

      <View style={[ui.card, styles.summaryCard]}>
        <Text style={styles.sectionTitle}>간단 점검 요약</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>점검 항목</Text>
          <Text style={styles.fieldValue}>{intake.trim() || '-'}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>기타 상세</Text>
          <Text style={styles.fieldValue}>{symptoms.trim() || '-'}</Text>
        </View>

        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>수리 접수 완료</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.lg,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  summaryCard: {
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    height: 56,
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});
