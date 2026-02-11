export type Device = {
  id: string;
  brand: string;
  modelName: string;
  serialNumber: string;
  color: string;
  registeredYear: number;
  imageUri?: string;
};

export type HistoryItem = {
  id: string;
  date: string;
  title: string;
  center: string;
};

export const initialDevices: Device[] = [
  {
    id: '1',
    brand: 'PATOZ',
    modelName: 'EZ-BIKE S1',
    serialNumber: 'ST12345678',
    color: 'Midnight Navy',
    registeredYear: 2024,
    imageUri:
      'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&w=900&q=80',
  },
];

export const tabLabels = {
  home: '홈',
  repair: '수리 접수',
  history: '정비 이력',
};

export const homeActions = ['AI 간편 점검', '수리 진행 현황', '정비 이력', '도난 신고'] as const;

export const initialHistory: HistoryItem[] = [
  {
    id: '1',
    date: '2025-01-19',
    title: '필터 교체',
    center: 'PATOZ Service Seoul',
  },
  {
    id: '2',
    date: '2025-04-02',
    title: '모터 점검',
    center: 'PATOZ Service Busan',
  },
];
