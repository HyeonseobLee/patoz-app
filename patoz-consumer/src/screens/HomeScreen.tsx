import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import AppHeader from '../components/AppHeader';
import { useAppContext } from '../context/AppContext';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { devices, selectedDeviceId, addDevice, setSelectedDeviceId, moveDeviceUp, moveDeviceDown } = useAppContext();
  const [serialNumber, setSerialNumber] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleRegister = () => {
    const trimmedSerial = serialNumber.trim();

    if (trimmedSerial.length < 4) {
      Alert.alert('등록 안내', '시리얼 넘버를 4자 이상 입력해주세요.');
      return;
    }

    addDevice(trimmedSerial);
    setSerialNumber('');
  };

  const handleCardPress = (deviceId: string) => {
    setSelectedDeviceId(deviceId);

    if (isEditMode) {
      return;
    }

    navigation.navigate('DeviceDashboard', { deviceId });
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <AppHeader title="PATOZ" showDivider />

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>등록 기기 목록</Text>
        <Pressable onPress={() => setIsEditMode((prev) => !prev)} style={styles.editToggleButton}>
          <Text style={styles.editToggleText}>{isEditMode ? '편집 완료' : '순서 편집'}</Text>
        </Pressable>
      </View>

      <View style={styles.registerCard}>
        <TextInput
          autoCapitalize="characters"
          onChangeText={setSerialNumber}
          placeholder="시리얼 넘버를 입력하세요"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={serialNumber}
        />
        <Pressable onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>등록</Text>
        </Pressable>
        <Text style={styles.microcopy}>여러 대의 기기를 등록해 관리할 수 있어요.</Text>
      </View>

      {isEditMode ? <Text style={styles.editHint}>드래그 대신 버튼으로 순서를 변경할 수 있어요.</Text> : null}

      {devices.length === 0 ? (
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyTitle}>등록된 PM 기기가 없습니다.</Text>
          <Text style={styles.emptyDescription}>시리얼 넘버를 입력하고 첫 기기를 등록해보세요.</Text>
        </View>
      ) : (
        <View style={styles.deviceList}>
          {devices.map((device, index) => (
            <Pressable key={device.id} onPress={() => handleCardPress(device.id)} style={styles.deviceCard}>
              <View style={styles.imagePlaceholder} />
              <View style={styles.cardBody}>
                <Text style={styles.modelName}>{device.modelName}</Text>
                <Text style={styles.infoText}>시리얼 넘버: {device.serialNumber}</Text>
                <Text style={styles.infoText}>등록 연도: {device.registeredYear}</Text>
                {selectedDeviceId === device.id ? <Text style={styles.selectedTag}>선택된 기기</Text> : null}
              </View>

              {isEditMode ? (
                <View style={styles.orderButtons}>
                  <Pressable
                    disabled={index === 0}
                    onPress={() => moveDeviceUp(device.id)}
                    style={[styles.orderButton, index === 0 && styles.disabledOrderButton]}
                  >
                    <Text style={styles.orderButtonText}>위로</Text>
                  </Pressable>
                  <Pressable
                    disabled={index === devices.length - 1}
                    onPress={() => moveDeviceDown(device.id)}
                    style={[styles.orderButton, index === devices.length - 1 && styles.disabledOrderButton]}
                  >
                    <Text style={styles.orderButtonText}>아래로</Text>
                  </Pressable>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  editToggleButton: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  editToggleText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '700',
  },
  registerCard: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 15,
    padding: spacing.md,
  },
  registerButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  microcopy: {
    color: colors.textMuted,
    fontSize: 13,
  },
  editHint: {
    color: '#64748B',
    fontSize: 12,
    marginHorizontal: spacing.lg,
  },
  emptyStateCard: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyDescription: {
    color: colors.textMuted,
    fontSize: 14,
  },
  deviceList: {
    gap: spacing.md,
    marginHorizontal: spacing.lg,
  },
  deviceCard: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imagePlaceholder: {
    backgroundColor: '#E2E8F0',
    borderRadius: radius.md,
    height: 72,
    width: 72,
  },
  cardBody: {
    flex: 1,
    gap: spacing.xs,
  },
  modelName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTag: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  orderButtons: {
    gap: spacing.xs,
    justifyContent: 'center',
  },
  orderButton: {
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  disabledOrderButton: {
    opacity: 0.5,
  },
  orderButtonText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
});
