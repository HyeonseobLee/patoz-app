import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { tabLabels } from '../data/mock';
import MaintenanceHistoryScreen from '../screens/MaintenanceHistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import RepairFlowScreen from '../screens/RepairFlowScreen';
import { colors } from '../styles/theme';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const iconByRoute: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
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
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name={iconByRoute[route.name as keyof RootTabParamList]} size={size} />
          ),
        })}
      >
        <Tab.Screen component={HomeScreen} name="Home" options={{ title: tabLabels.home }} />
        <Tab.Screen component={RepairFlowScreen} name="RepairFlow" options={{ title: tabLabels.repair }} />
        <Tab.Screen
          component={MaintenanceHistoryScreen}
          name="MaintenanceHistory"
          options={{ title: tabLabels.history }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
