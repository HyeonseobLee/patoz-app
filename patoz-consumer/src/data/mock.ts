import { Device } from '../types';
import { Estimate } from '../components/EstimateCard';

export type HistoryItem = {
  id: string;
  deviceId: string;
  receivedDate: string;
  completedDate?: string | null;
  status: string;
  description: string;
  notes?: string;
};

export type RepairStage = 'REGISTERED' | 'REPAIRING' | 'REPAIR_COMPLETED' | 'PICKED_UP';

export type EstimateDetail = Estimate & {
  repairItems: string[];
  engineerName: string;
  phoneNumber: string;
};

export const estimateMockData: EstimateDetail[] = [
  {
    id: 'est-1',
    vendorName: 'PATOZ 강남 파트너센터',
    expectedCost: '₩180,000',
    expectedDuration: '당일 5시간',
    rating: 4.8,
    isNew: true,
    repairItems: ['후륜 브레이크 패드 교체', '브레이크 오일 점검', '휠 정렬 보정'],
    engineerName: '홍길동 기사',
    phoneNumber: '02-1234-5678',
  },
  {
    id: 'est-2',
    vendorName: '스피드 모빌리티 수리소',
    expectedCost: '₩165,000',
    expectedDuration: '1일',
    rating: 4.6,
    repairItems: ['후륜 브레이크 패드 교체', '모터 하우징 진동 점검'],
    engineerName: '김태영 기사',
    phoneNumber: '02-9876-1111',
  },
  {
    id: 'est-3',
    vendorName: '프리미엄 이바이크 케어',
    expectedCost: '₩210,000',
    expectedDuration: '당일 3시간',
    rating: 4.9,
    isNew: true,
    repairItems: ['후륜 브레이크 패드 교체', '디스크 로터 연마', '구동계 정밀 세척'],
    engineerName: '박하늘 기사',
    phoneNumber: '031-888-2222',
  },
];

export const repairStatusMockSamples: Record<RepairStage, { title: string; confirmedEstimate: EstimateDetail | null }> = {
  REGISTERED: {
    title: '접수 완료 상태 샘플',
    confirmedEstimate: null,
  },
  REPAIRING: {
    title: '수리 중 상태 샘플',
    confirmedEstimate: estimateMockData[0],
  },
  REPAIR_COMPLETED: {
    title: '수리 완료 상태 샘플',
    confirmedEstimate: estimateMockData[0],
  },
  PICKED_UP: {
    title: '수령 완료 상태 샘플',
    confirmedEstimate: estimateMockData[0],
  },
};

export const initialDevices: Device[] = [
  {
    id: '1',
    brand: 'PATOZ',
    modelName: 'EZ-BIKE S1',
    serialNumber: 'ST12345678',
    color: 'Midnight Navy',
    registeredYear: 2024,
    serviceStatus: 'In-Repair',
    imageUri:
      'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&w=900&q=80',
  },
];

export const tabLabels = {
  home: '내 기기',
  storeFinder: '매장 찾기',
  profile: '내 정보',
};

export const homeActions = ['AI 간편 진단', '수리 진행 현황', '정비 이력', '도난 신고'] as const;

export const initialHistory: HistoryItem[] = [
  {
    id: '1',
    deviceId: '1',
    receivedDate: '2025-04-02',
    completedDate: null,
    status: '수리 진행 중',
    description: '모터 점검 및 구동부 진동 원인 확인',
    notes: '주요 부품 수급 후 재조립 예정',
  },
  {
    id: '2',
    deviceId: '1',
    receivedDate: '2025-03-12',
    completedDate: null,
    status: '점검 중',
    description: '전륜 브레이크 소음 진단',
    notes: '점검 결과에 따라 브레이크 패드 교체 여부 결정',
  },
  {
    id: '3',
    deviceId: '1',
    receivedDate: '2025-01-19',
    completedDate: '2025-01-22',
    status: '완료',
    description: '필터 교체 및 기본 정비',
    notes: '정상 출고 완료',
  },
];
