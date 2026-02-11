import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '../components/AppHeader';
import { useAppContext } from '../context/AppContext';
import { homeActions } from '../data/mock';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';

type Props = BottomTabScreenProps<RootTabParamList, 'DeviceDashboard'>;

const actionIcons: Record<(typeof homeActions)[number], keyof typeof Ionicons.glyphMap> = {
  'AI 간편 점검': 'sparkles-outline',
  '수리 진행 현황': 'build-outline',
  '정비 이력': 'document-text-outline',
  '도난 신고': 'alert-circle-outline',
};

export default function DeviceDashboardScreen({ navigation, route }: Props) {
  const { devices, selectedDevice, setSelectedDeviceId } = useAppContext();

  useEffect(() => {
    setSelectedDeviceId(route.params.deviceId);
  }, [route.params.deviceId, setSelectedDeviceId]);

  const onActionPress = (action: (typeof homeActions)[number]) => {
    if (action === 'AI 간편 점검') {
      navigation.navigate('RepairFlow');
      return;
    }

    if (action === '수리 진행 현황') {
      navigation.navigate('RepairStatus');
      return;
    }

    if (action === '정비 이력') {
      navigation.navigate('MaintenanceHistory');
      return;
    }

    Alert.alert(action, '데모 화면입니다. 추후 기능이 연결됩니다.');
  };

  const fallbackDevice = devices.find((device) => device.id === route.params.deviceId) ?? selectedDevice;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader title="PATOZ" showDivider />

      {fallbackDevice ? (
        <View style={styles.deviceSection}>
          <View style={styles.deviceCard}>
            {fallbackDevice.imageUri ? (
              <Image source={{ uri: fallbackDevice.imageUri }} style={styles.deviceImage} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}

            <Text style={styles.brandText}>{fallbackDevice.brand}</Text>
            <Text style={styles.modelName}>{fallbackDevice.modelName}</Text>

            <View style={styles.deviceRow}>
              <Text style={styles.deviceLabel}>색상</Text>
              <Text style={styles.deviceValue}>{fallbackDevice.color}</Text>
            </View>
            <View style={styles.deviceRow}>
              <Text style={styles.deviceLabel}>시리얼 넘버</Text>
              <Text style={styles.deviceValue}>{fallbackDevice.serialNumber}</Text>
            </View>
            <View style={styles.deviceRow}>
              <Text style={styles.deviceLabel}>등록 연도</Text>
              <Text style={styles.deviceValue}>{fallbackDevice.registeredYear}</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyTitle}>선택된 기기를 찾을 수 없습니다.</Text>
          <Pressable onPress={() => navigation.navigate('Home')} style={styles.backButton}>
            <Text style={styles.backButtonText}>목록으로 돌아가기</Text>
          </Pressable>
        </View>
      )}

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
  deviceSection: {
    marginHorizontal: spacing.lg,
  },
  deviceCard: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.xl,
    gap: spacing.sm,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  deviceImage: {
    borderRadius: radius.lg,
    height: 170,
    marginBottom: spacing.sm,
    width: '100%',
  },
  imagePlaceholder: {
    backgroundColor: '#1E293B',
    borderRadius: radius.lg,
    height: 170,
    marginBottom: spacing.sm,
    width: '100%',
  },
  brandText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  modelName: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.xs,
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
    fontSize: 17,
    fontWeight: '600',
  },
  emptyStateCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
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
