import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../context/AppContext';
import { RootTabParamList } from '../navigation/types';
import { colors, radius, spacing } from '../styles/theme';
import { ui } from '../styles/ui';

type Props = BottomTabScreenProps<RootTabParamList, 'RepairRequest'>;

export default function RepairRequestScreen({ navigation, route }: Props) {
  const { addInquiry } = useAppContext();
  const [, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((prev) => prev + 1);
      return () => {};
    }, [])
  );

  const { intake, symptoms } = route.params;

  const predictedCause = useMemo(() => {
    if (intake.includes('브레이크')) {
      return '브레이크 패드 마모 또는 디스크 정렬 불량이 의심됩니다.';
    }

    if (intake.includes('타이어')) {
      return '타이어 공기압 저하 또는 마모 진행이 의심됩니다.';
    }

    if (intake.includes('배터리')) {
      return '배터리 셀 노후화 또는 전원 제어 모듈 이슈가 의심됩니다.';
    }

    return '주행계통 전반 점검이 필요하며, 센서/부품 상태 확인이 필요합니다.';
  }, [intake]);

  const handleConfirm = () => {
    addInquiry({ intake, symptoms });
    Alert.alert(
      '접수 완료',
      '수리 접수가 완료되었습니다. 업체들의 견적을 기다려주세요.',
      [
        {
          text: '확인',
          onPress: () => navigation.navigate('RepairStatus'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>AI 진단 결과</Text>

      <View style={[ui.card, styles.resultCard]}>
        <Text style={styles.sectionTitle}>예상 사유</Text>
        <Text style={styles.bodyText}>{predictedCause}</Text>

        <View style={styles.summaryGroup}>
          <Text style={styles.fieldLabel}>선택한 진단 항목</Text>
          <Text style={styles.fieldValue}>{intake.trim() || '-'}</Text>
        </View>

        <View style={styles.summaryGroup}>
          <Text style={styles.fieldLabel}>추가 메모</Text>
          <Text style={styles.fieldValue}>{symptoms.trim() || '-'}</Text>
        </View>

        <Text style={styles.questionText}>수리 접수가 필요하신가요?</Text>

        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>접수하기</Text>
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
  resultCard: {
    gap: spacing.lg,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  bodyText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  summaryGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  questionText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    height: 64,
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
    fontSize: 18,
    fontWeight: '800',
  },
});
