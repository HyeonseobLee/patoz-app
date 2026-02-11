export type Device = {
  name: string;
  serial: string;
  year: string;
};

export type HistoryItem = {
  id: string;
  date: string;
  title: string;
  center: string;
};

export const device: Device = {
  name: 'EZ-BIKE S1',
  serial: 'ST12345678',
  year: '2024',
};

export const tabLabels = {
  home: '홈',
  repair: '수리 진행',
  history: '정비 이력',
};

export const homeActions = ['정비 진단', '정비 이력', '도난 신고', '안전 가이드'] as const;

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
