export const serviceStatuses = ['In-Repair', 'Repair-Finished', 'Received'] as const;

export type ServiceStatus = (typeof serviceStatuses)[number];

export type Device = {
  id: string;
  brand: string;
  modelName: string;
  serialNumber: string;
  color: string;
  registeredYear: number;
  serviceStatus?: ServiceStatus | null;
  imageUri?: string;
};

