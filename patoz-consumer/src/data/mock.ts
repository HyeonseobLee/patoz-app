import { Device } from '../types';

export type HistoryItem = {
  id: string;
  deviceId: string;
  receivedDate: string;
  completedDate?: string | null;
  status: string;
  description: string;
  notes?: string;
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
