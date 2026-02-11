export type RootTabParamList = {
  Home: undefined;
  StoreFinder: undefined;
  Profile: undefined;
  DeviceDashboard: {
    deviceId: string;
  };
  RepairFlow: undefined;
  RepairRequest: {
    intake: string;
    symptoms: string;
  };
  MaintenanceHistory:
    | {
        deviceId?: string;
      }
    | undefined;
  MaintenanceDetail: {
    historyId: string;
  };
  RepairStatus: undefined;
};
