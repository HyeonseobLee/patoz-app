import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { HistoryItem, initialDevices, initialHistory } from '../data/mock';
import { Device, ServiceStatus } from '../types';

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
  reorderDevices: (nextDevices: Device[]) => void;
  updateDeviceServiceStatus: (id: string, status: ServiceStatus | null) => void;
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

    const targetDeviceId = selectedDeviceId ?? devices[0]?.id;

    if (!targetDeviceId) {
      return;
    }

    updateDeviceServiceStatus(targetDeviceId, 'Registered');

    const newItem: HistoryItem = {
      id: `${Date.now()}`,
      deviceId: targetDeviceId,
      receivedDate: toIsoDate(new Date()),
      completedDate: null,
      status: '접수 완료',
      description: intake.trim() || '정비 접수',
      notes: symptoms.trim() || '기타 메모 없음',
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
      brand: 'PATOZ',
      modelName: 'EZ-BIKE S1',
      serialNumber: trimmedSerialNumber,
      color: 'Midnight Navy',
      registeredYear: 2024,
      serviceStatus: null,
    };

    setDevices((prev) => [...prev, newDevice]);
    setSelectedDeviceIdState(newDevice.id);
  };


  const updateDeviceServiceStatus = (id: string, status: ServiceStatus | null) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id !== id) {
          return device;
        }

        return {
          ...device,
          serviceStatus: status,
        };
      })
    );
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

  const reorderDevices = (nextDevices: Device[]) => {
    setDevices(nextDevices);
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
      reorderDevices,
      updateDeviceServiceStatus,
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
