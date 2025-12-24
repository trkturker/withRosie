import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

export default function TabLayout() {
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    backgroundColor: 'white',
                    borderRadius: 35,
                    borderTopWidth: 2,
                    height: 75,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
                    paddingTop: 12,
                    shadowColor: '#FFB6C1',
                    marginRight: 20,
                    marginLeft: 20,
                    elevation: 4,
                    marginBottom: 15,
                    borderWidth: 2,
                    borderColor: '#FFE0E6',
                },
                tabBarActiveTintColor: '#FF69B4',
                tabBarInactiveTintColor: '#FFB6C1',
                tabBarLabelStyle: {
                    fontFamily: 'Balsamiq-Bold',
                    fontSize: 11,
                    marginBottom: 5,
                },
                tabBarIconStyle: {
                    marginBottom: 0,
                }
            }}
        >
            <Tabs.Screen
                name="characters"
                options={{
                    title: t('tabs.characters'),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "people" : "people-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.home'),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t('tabs.settings'),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "settings" : "settings-outline"} size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
