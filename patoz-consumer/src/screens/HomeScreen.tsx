import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
  const { devices, selectedDeviceId, addDevice } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');

  const selectedDevice = useMemo(() => {
    return devices.find((device) => device.id === selectedDeviceId) ?? null;
  }, [devices, selectedDeviceId]);

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

  const onRegisterPress = () => {
    const trimmedSerial = serialNumber.trim();

    if (!trimmedSerial) {
      Alert.alert('알림', 'Serial Number를 입력해주세요.');
      return;
    }

    addDevice(trimmedSerial);
    setSerialNumber('');
    setIsModalVisible(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <AppHeader title="PATOZ" showDivider />

        {selectedDevice ? (
          <View style={styles.deviceSection}>
            <View style={styles.deviceCard}>
              <Text style={styles.deviceName}>{selectedDevice.modelName}</Text>
              <View style={styles.deviceRow}>
                <Text style={styles.deviceLabel}>Serial Number</Text>
                <Text style={styles.deviceValue}>{selectedDevice.serialNumber}</Text>
              </View>
              <View style={styles.deviceRow}>
                <Text style={styles.deviceLabel}>Registered Year</Text>
                <Text style={styles.deviceValue}>{selectedDevice.registeredYear}</Text>
              </View>
            </View>

            <Pressable onPress={() => setIsModalVisible(true)} style={styles.registerButton}>
              <Ionicons color={colors.brand} name="add-circle-outline" size={20} style={styles.registerIcon} />
              <Text style={styles.registerButtonText}>+ 제품 등록</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons color={colors.brand} name="bicycle-outline" size={32} />
            <Text style={styles.emptyTitle}>등록된 PM 제품이 없습니다.</Text>
            <Pressable onPress={() => setIsModalVisible(true)} style={styles.emptyRegisterButton}>
              <Text style={styles.emptyRegisterButtonText}>+ 제품 등록</Text>
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

      <Modal animationType="fade" transparent visible={isModalVisible}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>제품 등록</Text>
            <TextInput
              autoCapitalize="characters"
              onChangeText={setSerialNumber}
              placeholder="Serial Number"
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
              value={serialNumber}
            />
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => {
                  setIsModalVisible(false);
                  setSerialNumber('');
                }}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>
              <Pressable onPress={onRegisterPress} style={[styles.modalButton, styles.confirmButton]}>
                <Text style={styles.confirmButtonText}>등록</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    gap: spacing.md,
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
  registerButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  registerIcon: {
    marginRight: spacing.xs,
  },
  registerButtonText: {
    color: colors.brand,
    fontSize: 15,
    fontWeight: '700',
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
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyRegisterButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  emptyRegisterButtonText: {
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
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    gap: spacing.md,
    padding: spacing.xl,
    width: '100%',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 16,
    padding: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  modalButton: {
    borderRadius: radius.md,
    minWidth: 84,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: colors.brand,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
