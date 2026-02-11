import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '../components/AppHeader';
import { useAppContext } from '../context/AppContext';
import { homeActions } from '../data/mock';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

const actionIcons: Record<(typeof homeActions)[number], keyof typeof Ionicons.glyphMap> = {
  '정비 진단': 'construct-outline',
  '정비 이력': 'document-text-outline',
  '도난 신고': 'alert-circle-outline',
  '안전 가이드': 'shield-checkmark-outline',
};

export default function HomeScreen({ navigation }: Props) {
  const { device } = useAppContext();

  const onActionPress = (action: (typeof homeActions)[number]) => {
    if (action === '정비 진단') {
      navigation.navigate('RepairFlow');
      return;
    }

    if (action === '정비 이력') {
      navigation.navigate('MaintenanceHistory');
      return;
    }

    Alert.alert(action, '데모 화면입니다. 추후 기능이 연결됩니다.');
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader title="PATOZ" showDivider />

      <View style={styles.deviceCard}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <View style={styles.deviceRow}>
          <Text style={styles.deviceLabel}>Serial Number</Text>
          <Text style={styles.deviceValue}>{device.serial}</Text>
        </View>
        <View style={styles.deviceRow}>
          <Text style={styles.deviceLabel}>Registered Year</Text>
          <Text style={styles.deviceValue}>{device.year}</Text>
        </View>
      </View>

      <View style={styles.actionList}>
        {homeActions.map((action) => (
          <Pressable key={action} onPress={() => onActionPress(action)} style={styles.actionButton}>
            <Ionicons color={colors.brand} name={actionIcons[action]} size={22} style={styles.actionIcon} />
            <Text style={styles.actionButtonText}>{action}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  deviceCard: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.xl,
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  deviceName: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  deviceRow: {
    gap: spacing.xs,
  },
  deviceLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  deviceValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  actionList: {
    gap: spacing.md,
    marginHorizontal: spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  actionIcon: {
    marginRight: spacing.md,
  },
  actionButtonText: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
});
