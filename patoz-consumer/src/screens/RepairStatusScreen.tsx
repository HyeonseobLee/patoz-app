import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { EstimateDetail, RepairStage } from '../data/mock';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import EstimateCard from '../components/EstimateCard';

type Props = BottomTabScreenProps<RootTabParamList, 'RepairStatus'>;

type RepairStatus = '접수 완료' | '수리 중' | '수리 완료' | '수령 완료';

const timelineSteps: RepairStatus[] = ['접수 완료', '수리 중', '수리 완료', '수령 완료'];
const stageToStatusLabel: Record<RepairStage, RepairStatus> = {
  REGISTERED: '접수 완료',
  REPAIRING: '수리 중',
  REPAIR_COMPLETED: '수리 완료',
  PICKED_UP: '수령 완료',
};


const finalStep: RepairStatus = '수령 완료';

const registeredIncomingEstimates: EstimateDetail[] = [
  {
    id: 'registered-est-1',
    vendorName: 'PATOZ 서초 스마트케어',
    expectedCost: '₩172,000',
    expectedDuration: '당일 4시간',
    rating: 4.7,
    isNew: true,
    repairItems: ['후륜 브레이크 패드 교체', '브레이크 캘리퍼 정렬', '구동부 소음 점검'],
    engineerName: '이준호 기사',
    phoneNumber: '02-2345-8899',
  },
  {
    id: 'registered-est-2',
    vendorName: 'PATOZ 송파 파트너랩',
    expectedCost: '₩189,000',
    expectedDuration: '1일',
    rating: 4.9,
    repairItems: ['후륜 브레이크 패드 교체', '디스크 로터 편마모 교정', '제동 센서 캘리브레이션'],
    engineerName: '정유진 기사',
    phoneNumber: '02-7766-1020',
  },
];

function IncomingEstimateSection({
  estimates,
  onSelectEstimate,
}: {
  estimates: EstimateDetail[];
  onSelectEstimate: (estimate: EstimateDetail) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.estimateHeaderRow}>
        <Text style={styles.sectionTitle}>도착한 견적서</Text>
        <View style={styles.estimateCountBadge}>
          <Text style={styles.estimateCountText}>{estimates.length}건</Text>
        </View>
      </View>

      <View style={styles.estimateList}>
        {estimates.map((estimate) => (
          <EstimateCard estimate={estimate} key={estimate.id} onPress={() => onSelectEstimate(estimate)} />
        ))}
      </View>
    </View>
  );
}

function ConfirmedVendorSection({ confirmedEstimate }: { confirmedEstimate: EstimateDetail }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>서비스 센터</Text>
      <Text style={styles.sectionTitle}>{confirmedEstimate.vendorName}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>담당 기사</Text>
        <Text style={styles.metaValue}>{confirmedEstimate.engineerName}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>연락처</Text>
        <Text style={styles.metaValue}>{confirmedEstimate.phoneNumber}</Text>
      </View>

      <Text style={[styles.sectionTitle, styles.confirmedSectionTitle]}>확정된 견적 내용</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>확정 수리 비용</Text>
        <Text style={styles.metaValue}>{confirmedEstimate.expectedCost}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>예상 소요 기간</Text>
        <Text style={styles.metaValue}>{confirmedEstimate.expectedDuration}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaLabel}>확정 수리 항목</Text>
        {confirmedEstimate.repairItems.map((item) => (
          <Text key={item} style={styles.confirmedListItem}>
            • {item}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function RepairStatusScreen({ navigation }: Props) {
  const { selectedDevice, selectedDeviceId, updateDeviceServiceStatus } = useAppContext();
  const [, setRefreshKey] = useState(0);
  const [repairStage, setRepairStage] = useState<RepairStage>('REGISTERED');
  const [selectedEstimate, setSelectedEstimate] = useState<EstimateDetail | null>(null);
  const [confirmedEstimate, setConfirmedEstimate] = useState<EstimateDetail | null>(null);
  const defaultConfirmedEstimate = registeredIncomingEstimates[0];
  const activeConfirmedEstimate = confirmedEstimate ?? defaultConfirmedEstimate;

  const repairStatus = stageToStatusLabel[repairStage];

  const currentStepIndex = timelineSteps.indexOf(repairStatus);
  const isFinalState = repairStatus === finalStep;
  const isEstimateSectionVisible = repairStage === 'REGISTERED';
  const isConfirmedSectionVisible = repairStage === 'REPAIRING';

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);

      if (selectedDevice?.serviceStatus === 'Registered') {
        setRepairStage('REGISTERED');
      } else if (selectedDevice?.serviceStatus === 'In-Repair') {
        setRepairStage('REPAIRING');
      } else if (selectedDevice?.serviceStatus === 'Repair-Finished') {
        setRepairStage('REPAIR_COMPLETED');
      } else if (selectedDevice?.serviceStatus === 'Received') {
        setRepairStage('PICKED_UP');
      } else {
        setRepairStage('REGISTERED');
      }

      return () => {};
    }, [selectedDevice?.serviceStatus])
  );

  const handleSelectEstimate = () => {
    if (!selectedEstimate) {
      return;
    }

    Alert.alert('수리 업체 선정', '수리 업체가 선정되었습니다. 수리를 시작할까요?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '시작하기',
        onPress: () => {
          setRepairStage('REPAIRING');
          setConfirmedEstimate(selectedEstimate);

          if (selectedDeviceId) {
            updateDeviceServiceStatus(selectedDeviceId, 'In-Repair');
          }

          setSelectedEstimate(null);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} style={styles.container}>
        <Text style={styles.pageTitle}>수리 진행 현황</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>진행 상태</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{isFinalState ? `${repairStatus} (최종 완료)` : repairStatus}</Text>
          </View>
        </View>

        {isEstimateSectionVisible ? (
          <IncomingEstimateSection estimates={registeredIncomingEstimates} onSelectEstimate={setSelectedEstimate} />
        ) : null}

        {isConfirmedSectionVisible ? <ConfirmedVendorSection confirmedEstimate={activeConfirmedEstimate} /> : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>수리 타임라인</Text>
          <View style={styles.timelineList}>
            {timelineSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <View key={step} style={styles.timelineRow}>
                  <View
                    style={[
                      styles.timelineDot,
                      isCompleted && styles.timelineDotCompleted,
                      isActive && styles.timelineDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.timelineText,
                      isCompleted && styles.timelineTextCompleted,
                      isActive && styles.timelineTextActive,
                    ]}
                  >
                    {index + 1}. {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>예상 수리 정보</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>예상 수리 항목</Text>
            <Text style={styles.metaValue}>
              {repairStage === 'REPAIRING'
                ? activeConfirmedEstimate.repairItems.join(', ')
                : '견적 확정 후 상세 항목이 표시됩니다.'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>확정 금액</Text>
            <Text style={styles.metaValue}>{repairStage === 'REPAIRING' ? activeConfirmedEstimate.expectedCost : '-'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>예상 완료 시간</Text>
            <Text style={styles.metaValue}>
              {repairStage === 'REPAIRING' ? activeConfirmedEstimate.expectedDuration : '견적 확정 후 안내됩니다.'}
            </Text>
          </View>
        </View>

        <Pressable onPress={() => navigation.goBack()} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </Pressable>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setSelectedEstimate(null)}
        transparent
        visible={Boolean(selectedEstimate)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedEstimate?.vendorName}</Text>

            <Text style={styles.modalMeta}>예상 수리 비용: {selectedEstimate?.expectedCost}</Text>
            <Text style={styles.modalMeta}>예상 소요 기간: {selectedEstimate?.expectedDuration}</Text>
            <Text style={styles.modalMeta}>별점: ⭐ {selectedEstimate?.rating.toFixed(1)}</Text>

            <Text style={styles.modalSectionLabel}>상세 수리 항목</Text>
            {selectedEstimate?.repairItems.map((item) => (
              <Text key={item} style={styles.modalListItem}>
                • {item}
              </Text>
            ))}

            <Pressable onPress={handleSelectEstimate} style={styles.startButton}>
              <Text style={styles.startButtonText}>이 업체로 수리 진행하기</Text>
            </Pressable>

            <Pressable onPress={() => setSelectedEstimate(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingTop: spacing.sm,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  confirmedSectionTitle: {
    marginTop: spacing.md,
  },
  metaRow: {
    marginTop: spacing.xs,
  },
  metaLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  confirmedListItem: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
  },
  estimateHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  estimateCountBadge: {
    backgroundColor: colors.navyCard,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  estimateCountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  estimateList: {
    gap: spacing.sm,
  },
  timelineList: {
    gap: spacing.sm,
  },
  timelineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timelineDot: {
    backgroundColor: '#CBD5E1',
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  timelineDotCompleted: {
    backgroundColor: '#93C5FD',
  },
  timelineDotActive: {
    backgroundColor: colors.brand,
    height: 12,
    width: 12,
  },
  timelineText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  timelineTextCompleted: {
    color: '#334155',
    fontWeight: '600',
  },
  timelineTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  modalMeta: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  modalSectionLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  modalListItem: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  startButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  startButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  closeButtonText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
