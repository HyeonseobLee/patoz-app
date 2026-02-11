import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

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
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const iconByRoute: Partial<Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap>> = {
  Home: 'phone-portrait-outline',
  StoreFinder: 'map-outline',
  Profile: 'person-outline',
};

const hiddenRoutes: (keyof RootTabParamList)[] = [
  'RepairRequest',
  'DeviceDashboard',
  'RepairStatus',
  'MaintenanceDetail',
  'RepairFlow',
  'MaintenanceHistory',
];

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.brand,
          tabBarInactiveTintColor: '#94A3B8',
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 2,
          },
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 6,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
          tabBarStyle: {
            borderTopColor: '#E2E8F0',
            borderTopWidth: 1,
            display: hiddenRoutes.includes(route.name) ? 'none' : 'flex',
            height: 62,
            paddingBottom: 6,
            paddingTop: 6,
          },
          tabBarIcon: ({ color, size }) => {
            const iconName = iconByRoute[route.name as keyof RootTabParamList];
            return iconName ? <Ionicons color={color} name={iconName} size={size} /> : null;
          },
        })}
      >
        <Tab.Screen component={HomeScreen} name="Home" options={{ title: tabLabels.home }} />
        <Tab.Screen component={StoreFinderScreen} name="StoreFinder" options={{ title: tabLabels.storeFinder }} />
        <Tab.Screen component={ProfileScreen} name="Profile" options={{ title: tabLabels.profile }} />

        <Tab.Screen
          component={RepairFlowScreen}
          name="RepairFlow"
          options={{
            title: 'AI 간편 점검',
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          component={MaintenanceHistoryScreen}
          name="MaintenanceHistory"
          options={{
            title: '정비 이력',
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          component={MaintenanceDetailScreen}
          name="MaintenanceDetail"
          options={{
            title: '정비 상세',
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          component={RepairRequestScreen}
          name="RepairRequest"
          options={{
            title: '수리 접수',
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          component={DeviceDashboardScreen}
          name="DeviceDashboard"
          options={{
            title: '기기 대시보드',
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          component={RepairStatusScreen}
          name="RepairStatus"
          options={{
            title: '수리 진행 현황',
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
