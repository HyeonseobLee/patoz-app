import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { Device, HistoryItem, initialDevices, initialHistory } from '../data/mock';

type InquiryInput = {
  intake: string;
  symptoms: string;
};

type AppContextValue = {
  devices: Device[];
  selectedDeviceId: string | null;
  selectedDevice: Device | null;
  history: HistoryItem[];
  addInquiry: (input: InquiryInput) => void;
  addDevice: (serialNumber: string) => void;
  setSelectedDeviceId: (id: string) => void;
  moveDeviceUp: (id: string) => void;
  moveDeviceDown: (id: string) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: ReactNode;
};

const toIsoDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const moveDevice = (items: Device[], from: number, to: number) => {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }

  const updated = [...items];
  const [target] = updated.splice(from, 1);
  updated.splice(to, 0, target);

  return updated;
};

export function AppProvider({ children }: AppProviderProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState<string | null>(initialDevices[0]?.id ?? null);
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

  const addDevice = (serialNumber: string) => {
    const trimmedSerialNumber = serialNumber.trim();

    if (!trimmedSerialNumber) {
      return;
    }

    const newDevice: Device = {
      id: Date.now().toString(),
      modelName: 'EZ-BIKE S1',
      serialNumber: trimmedSerialNumber,
      registeredYear: 2024,
    };

    setDevices((prev) => [...prev, newDevice]);
    setSelectedDeviceIdState(newDevice.id);
  };

  const setSelectedDeviceId = (id: string) => {
    setSelectedDeviceIdState(id);
  };

  const moveDeviceUp = (id: string) => {
    setDevices((prev) => {
      const index = prev.findIndex((device) => device.id === id);
      return moveDevice(prev, index, index - 1);
    });
  };

  const moveDeviceDown = (id: string) => {
    setDevices((prev) => {
      const index = prev.findIndex((device) => device.id === id);
      return moveDevice(prev, index, index + 1);
    });
  };

  const selectedDevice = useMemo(() => {
    return devices.find((device) => device.id === selectedDeviceId) ?? null;
  }, [devices, selectedDeviceId]);

  const value = useMemo(
    () => ({
      devices,
      selectedDeviceId,
      selectedDevice,
      history,
      addInquiry,
      addDevice,
      setSelectedDeviceId,
      moveDeviceUp,
      moveDeviceDown,
    }),
    [devices, selectedDeviceId, selectedDevice, history]
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
