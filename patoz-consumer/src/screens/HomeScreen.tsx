import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAppContext } from '../context/AppContext';
import { homeActions } from '../data/mock';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

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
      <Text style={styles.brandText}>PATOZ</Text>

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
          <Pressable key={action} onPress={() => onActionPress(action)} style={ui.outlineButton}>
            <Text style={ui.outlineButtonText}>{action}</Text>
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
    padding: spacing.xl,
  },
  brandText: {
    color: colors.brand,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  deviceCard: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.xl,
    gap: spacing.sm,
    padding: spacing.xl,
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
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
  },
  deviceValue: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  actionList: {
    gap: spacing.md,
  },
});
