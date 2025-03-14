import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'react-native';
import { useAssets } from 'expo-asset';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [assets] = useAssets([
    require('../../assets/images/map-icon.png'),
    require('../../assets/images/helper-icon.png'),
    require('../../assets/images/task-icon.png'),
    require('../../assets/images/coupon-icon.png'),
    require('../../assets/images/member-icon.png'),
  ]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '地圖',
          tabBarIcon: ({ color, size }) =>
            assets && assets[0]?.uri ? (
              <Image source={{ uri: assets[0].uri }} style={{ width: size, height: size, tintColor: color }} />
            ) : null,
        }}
      />
      <Tabs.Screen
        name="helper"
        options={{
          title: '小幫手',
          tabBarIcon: ({ color, size }) =>
            assets && assets[1]?.uri ? (
              <Image source={{ uri: assets[1].uri }} style={{ width: size, height: size, tintColor: color }} />
            ) : null,
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: '任務',
          tabBarIcon: ({ color, size }) =>
            assets && assets[2]?.uri ? (
              <Image source={{ uri: assets[2].uri }} style={{ width: size, height: size, tintColor: color }} />
            ) : null,
        }}
      />
      <Tabs.Screen
        name="coupon"
        options={{
          title: '優惠卷',
          tabBarIcon: ({ color, size }) =>
            assets && assets[3]?.uri ? (
              <Image source={{ uri: assets[3].uri }} style={{ width: size, height: size, tintColor: color ,resizeMode: 'contain',}} />
            ) : null,
        }}
      />
      <Tabs.Screen
        name="member"
        options={{
          title: '個人中心',
          tabBarIcon: ({ color, size }) =>
            assets && assets[4]?.uri ? (
              <Image source={{ uri: assets[4].uri }} style={{ width: size, height: size, tintColor: color }} />
            ) : null,
        }}
      />
    </Tabs>
  );
}
