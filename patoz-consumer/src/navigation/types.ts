import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  StoreFinder: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
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
