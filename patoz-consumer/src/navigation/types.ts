export type RootTabParamList = {
  Home: undefined;
  DeviceDashboard: {
    deviceId: string;
  };
  RepairFlow: undefined;
  RepairRequest: {
    intake: string;
    symptoms: string;
  };
  MaintenanceHistory: undefined;
};
