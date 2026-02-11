import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { tabLabels } from '../data/mock';
import DeviceDashboardScreen from '../screens/DeviceDashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import MaintenanceHistoryScreen from '../screens/MaintenanceHistoryScreen';
import RepairFlowScreen from '../screens/RepairFlowScreen';
import RepairRequestScreen from '../screens/RepairRequestScreen';
import { colors } from '../styles/theme';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const iconByRoute: Partial<Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap>> = {
  Home: 'home-outline',
  RepairFlow: 'construct-outline',
  MaintenanceHistory: 'document-text-outline',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.brand,
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            height: 74,
            paddingTop: 8,
            paddingBottom: 10,
            display: route.name === 'RepairRequest' || route.name === 'DeviceDashboard' ? 'none' : 'flex',
          },
          tabBarIcon: ({ color, size }) => {
            const iconName = iconByRoute[route.name as keyof RootTabParamList];
            return iconName ? <Ionicons color={color} name={iconName} size={size} /> : null;
          },
        })}
      >
        <Tab.Screen component={HomeScreen} name="Home" options={{ title: tabLabels.home }} />
        <Tab.Screen component={RepairFlowScreen} name="RepairFlow" options={{ title: tabLabels.repair }} />
        <Tab.Screen
          component={MaintenanceHistoryScreen}
          name="MaintenanceHistory"
          options={{ title: tabLabels.history }}
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
