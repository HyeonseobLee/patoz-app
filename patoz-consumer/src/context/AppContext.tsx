import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { device, HistoryItem, initialHistory } from '../data/mock';

type InquiryInput = {
  intake: string;
  symptoms: string;
};

type AppContextValue = {
  device: typeof device;
  history: HistoryItem[];
  addInquiry: (input: InquiryInput) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

const toIsoDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export function AppProvider({ children }: AppProviderProps) {
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);

  const addInquiry = ({ intake, symptoms }: InquiryInput) => {
    const hasIntake = intake.trim().length > 0;
    const hasSymptoms = symptoms.trim().length > 0;

    if (!hasIntake && !hasSymptoms) {
      return;
    }

    const newItem: HistoryItem = {
      id: `${Date.now()}`,
      date: toIsoDate(new Date()),
      title: '정비 접수',
      center: 'PATOZ Service (Auto)',
    };

    setHistory((prev) => [newItem, ...prev]);
  };

  const value = useMemo(
    () => ({
      device,
      history,
      addInquiry,
    }),
    [history]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
