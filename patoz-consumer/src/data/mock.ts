export type Device = {
  id: string;
  modelName: string;
  serialNumber: string;
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
    modelName: 'EZ-BIKE S1',
    serialNumber: 'ST12345678',
    registeredYear: 2024,
  },
];

export const tabLabels = {
  home: '홈',
  repair: '수리 접수',
  history: '정비 이력',
};

export const homeActions = ['간단 점검', '정비 이력', '도난 신고', '안전 가이드'] as const;

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
