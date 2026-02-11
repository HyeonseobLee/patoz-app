import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tabLabels } from '../data/mock';
import DeviceDashboardScreen from '../screens/DeviceDashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import MaintenanceDetailScreen from '../screens/MaintenanceDetailScreen';
import MaintenanceHistoryScreen from '../screens/MaintenanceHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RepairFlowScreen from '../screens/RepairFlowScreen';
import RepairRequestScreen from '../screens/RepairRequestScreen';
import RepairStatusScreen from '../screens/RepairStatusScreen';
import StoreFinderScreen from '../screens/StoreFinderScreen';
import { colors } from '../styles/theme';
import { RootStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const iconByRoute: Partial<Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap>> = {
  Home: 'bicycle-outline',
  StoreFinder: 'map-outline',
  Profile: 'person-outline',
};

const TAB_BAR_BASE_STYLE = {
  borderTopColor: '#E2E8F0',
  borderTopWidth: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: 8,
};

const TAB_BAR_ITEM_STYLE = {
  flex: 1,
  minWidth: 0,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const ICON_SIZE = 24;

export default function AppNavigator() {
  const insets = useSafeAreaInsets();

  const baseTabBarHeight = Platform.select({
    ios: 56,
    default: 60,
  });

  const safeBottomPadding = Math.max(insets.bottom, 6);

  const commonScreenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: colors.brand,
      tabBarInactiveTintColor: '#94A3B8',
      tabBarHideOnKeyboard: true,
      tabBarShowLabel: false,
      tabBarItemStyle: TAB_BAR_ITEM_STYLE,
      tabBarIconStyle: undefined,
    }),
    [],
  );

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...commonScreenOptions,
        tabBarStyle: {
          ...TAB_BAR_BASE_STYLE,
          height: baseTabBarHeight + safeBottomPadding,
          paddingBottom: safeBottomPadding,
        },
        tabBarIcon: ({ color }) => {
          const iconName = iconByRoute[route.name as keyof RootTabParamList];
          return iconName ? <Ionicons color={color} name={iconName} size={ICON_SIZE} /> : null;
        },
      })}
    >
      <Tab.Screen component={HomeScreen} name="Home" options={{ title: tabLabels.home }} />
      <Tab.Screen component={StoreFinderScreen} name="StoreFinder" options={{ title: tabLabels.storeFinder }} />
      <Tab.Screen component={ProfileScreen} name="Profile" options={{ title: tabLabels.profile }} />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={MainTabs} name="MainTabs" />
        <Stack.Screen component={RepairFlowScreen} name="RepairFlow" options={{ title: 'AI 간편 점검' }} />
        <Stack.Screen component={MaintenanceHistoryScreen} name="MaintenanceHistory" options={{ title: '정비 이력' }} />
        <Stack.Screen component={MaintenanceDetailScreen} name="MaintenanceDetail" options={{ title: '정비 상세' }} />
        <Stack.Screen component={RepairRequestScreen} name="RepairRequest" options={{ title: '수리 접수' }} />
        <Stack.Screen component={DeviceDashboardScreen} name="DeviceDashboard" options={{ title: '기기 대시보드' }} />
        <Stack.Screen component={RepairStatusScreen} name="RepairStatus" options={{ title: '수리 진행 현황' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
