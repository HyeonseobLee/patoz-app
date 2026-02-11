import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
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
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator();

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'bicycle-outline',
  StoreFinder: 'map-outline',
  Profile: 'person-outline',
};

// 1. 하단 탭바 컴포넌트 분리 (오직 3개만 포함)
function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1, // 이제 정확히 1/3씩 공간을 나눠 갖습니다.
          paddingTop: 8,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 60 + insets.bottom : 70,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
        },
        tabBarIcon: ({ color }) => (
          <Ionicons name={iconByRoute[route.name]} size={24} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: tabLabels.home }} />
      <Tab.Screen name="StoreFinder" component={StoreFinderScreen} options={{ title: tabLabels.storeFinder }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: tabLabels.profile }} />
    </Tab.Navigator>
  );
}

// 2. 전체 내비게이션 구조 (탭바와 상세 페이지 분리)
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 메인 탭바 (홈, 매장, 프로필) */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        
        {/* 상세 화면들 (탭바가 나타나지 않음) */}
        <Stack.Screen name="RepairFlow" component={RepairFlowScreen} />
        <Stack.Screen name="MaintenanceHistory" component={MaintenanceHistoryScreen} />
        <Stack.Screen name="MaintenanceDetail" component={MaintenanceDetailScreen} />
        <Stack.Screen name="RepairRequest" component={RepairRequestScreen} />
        <Stack.Screen name="DeviceDashboard" component={DeviceDashboardScreen} />
        <Stack.Screen name="RepairStatus" component={RepairStatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}