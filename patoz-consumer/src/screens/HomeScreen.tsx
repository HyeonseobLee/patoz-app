import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { Device, ServiceStatus } from '../types';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

const DRAG_STEP = 156;

const moveDevice = (items: Device[], fromIndex: number, toIndex: number) => {
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [target] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, target);

  return nextItems;
};

export default function HomeScreen({ navigation }: Props) {
  const { devices, addDevice, setSelectedDeviceId, reorderDevices } = useAppContext();
  const [serialNumber, setSerialNumber] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableDevices, setEditableDevices] = useState<Device[]>(devices);
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
  const [, setRefreshKey] = useState(0);

  const dragTranslateY = useRef(new Animated.Value(0)).current;
  const editableDevicesRef = useRef<Device[]>(devices);
  const dragOriginIndexRef = useRef(0);

  useEffect(() => {
    editableDevicesRef.current = editableDevices;
  }, [editableDevices]);

  useEffect(() => {
    if (!isEditMode) {
      setEditableDevices(devices);
      editableDevicesRef.current = devices;
    }
  }, [devices, isEditMode]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      return () => {};
    }, [])
  );

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

  const toggleEditMode = () => {
    if (isEditMode) {
      reorderDevices(editableDevicesRef.current);
      setDraggingDeviceId(null);
      setIsEditMode(false);
      return;
    }

    setEditableDevices(devices);
    editableDevicesRef.current = devices;
    setIsEditMode(true);
  };

  const isRepairHighlighted = (status?: ServiceStatus | null) => {
    return status === 'In-Repair' || status === 'Repair-Finished';
  };

  const getRepairBadgeLabel = (status?: ServiceStatus | null) => {
    if (status === 'In-Repair') {
      return '수리 중';
    }

    if (status === 'Repair-Finished') {
      return '수리 완료 · 수령 대기';
    }

    return null;
  };

  const devicesToRender = isEditMode ? editableDevices : devices;

  const createPanResponder = useCallback(
    (deviceId: string) => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => isEditMode,
        onMoveShouldSetPanResponder: (_, gestureState) => isEditMode && Math.abs(gestureState.dy) > 4,
        onPanResponderGrant: () => {
          const index = editableDevicesRef.current.findIndex((device) => device.id === deviceId);
          setDraggingDeviceId(deviceId);
          dragOriginIndexRef.current = index;
          dragTranslateY.setValue(0);
        },
        onPanResponderMove: (_, gestureState) => {
          if (!isEditMode) {
            return;
          }

          dragTranslateY.setValue(gestureState.dy);

          const movingIndex = editableDevicesRef.current.findIndex((device) => device.id === deviceId);

          if (movingIndex < 0) {
            return;
          }

          const nextIndex = Math.max(
            0,
            Math.min(
              editableDevicesRef.current.length - 1,
              dragOriginIndexRef.current + Math.round(gestureState.dy / DRAG_STEP)
            )
          );

          if (nextIndex === movingIndex) {
            return;
          }

          const reordered = moveDevice(editableDevicesRef.current, movingIndex, nextIndex);
          editableDevicesRef.current = reordered;
          setEditableDevices(reordered);
        },
        onPanResponderRelease: () => {
          Animated.spring(dragTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setDraggingDeviceId(null);
          reorderDevices(editableDevicesRef.current);
        },
        onPanResponderTerminate: () => {
          Animated.spring(dragTranslateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setDraggingDeviceId(null);
        },
      });
    },
    [dragTranslateY, isEditMode, reorderDevices]
  );

  const panResponders = useMemo(() => {
    const entries = devicesToRender.map((device) => [device.id, createPanResponder(device.id)] as const);
    return Object.fromEntries(entries);
  }, [createPanResponder, devicesToRender]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>내 기기</Text>
        </View>

        <View style={styles.registerCard}>
          <View style={styles.registerRow}>
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
          </View>
          <Text style={styles.microcopy}>여러 대의 기기를 등록해 관리할 수 있어요.</Text>
        </View>

        <View style={styles.listMetaRow}>
          <Text style={styles.deviceCountText}>총 {devices.length}대</Text>
          <Pressable onPress={toggleEditMode} style={styles.editToggleButton}>
            <Text style={styles.editToggleText}>{isEditMode ? '편집 완료' : '순서 편집'}</Text>
          </Pressable>
        </View>

        {isEditMode ? <Text style={styles.editHint}>카드를 길게 누른 뒤 위/아래로 드래그해 순서를 바꿔보세요.</Text> : null}

        {devicesToRender.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyTitle}>등록된 PM 기기가 없습니다.</Text>
            <Text style={styles.emptyDescription}>시리얼 넘버를 입력하고 첫 기기를 등록해보세요.</Text>
          </View>
        ) : (
          <View style={styles.deviceList}>
            {devicesToRender.map((device) => {
              const isHighlighted = isRepairHighlighted(device.serviceStatus);
              const repairBadgeLabel = getRepairBadgeLabel(device.serviceStatus);
              const isDragging = isEditMode && draggingDeviceId === device.id;

              return (
                <Animated.View
                  key={device.id}
                  style={[
                    isDragging && {
                      transform: [{ translateY: dragTranslateY }],
                      zIndex: 5,
                    },
                  ]}
                >
                  <Pressable
                    onPress={() => handleCardPress(device.id)}
                    style={[
                      styles.deviceCard,
                      isHighlighted && styles.repairHighlightedCard,
                      isDragging && styles.draggingCard,
                    ]}
                    {...(isEditMode ? panResponders[device.id]?.panHandlers : {})}
                  >
                    {device.imageUri ? (
                      <Image source={{ uri: device.imageUri }} style={styles.deviceImage} />
                    ) : (
                      <View style={styles.imagePlaceholder} />
                    )}
                    <View style={styles.cardBody}>
                      <Text style={styles.brandText}>{device.brand}</Text>
                      <Text style={styles.modelName}>{device.modelName}</Text>
                      {repairBadgeLabel ? (
                        <View style={styles.repairStatusBadge}>
                          <Text style={styles.repairStatusBadgeText}>{repairBadgeLabel}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.infoText}>색상: {device.color}</Text>
                      <Text style={styles.infoText}>시리얼 넘버: {device.serialNumber}</Text>
                      <Text style={styles.infoText}>등록 연도: {device.registeredYear}</Text>
                    </View>

                    {isEditMode ? (
                      <View style={styles.dragHandleBadge}>
                        <Text style={styles.dragHandleText}>≡</Text>
                      </View>
                    ) : null}
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  listMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
  },
  deviceCountText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  registerCard: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  registerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  registerButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  microcopy: {
    color: colors.textMuted,
    fontSize: 12,
  },
  editToggleButton: {
    alignSelf: 'flex-start',
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
  draggingCard: {
    borderColor: '#60A5FA',
    borderWidth: 2,
    shadowColor: '#2563EB',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  repairHighlightedCard: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  deviceImage: {
    borderRadius: radius.md,
    height: 72,
    width: 72,
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
  brandText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  modelName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  repairStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    marginTop: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  repairStatusBadgeText: {
    color: '#1E3A8A',
    fontSize: 11,
    fontWeight: '700',
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  dragHandleBadge: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: radius.md,
    minWidth: 26,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  dragHandleText: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '800',
  },
});
