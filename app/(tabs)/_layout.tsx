import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FF69B4',
                tabBarInactiveTintColor: '#FFB6C1',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 25,
                    left: 20,
                    right: 20,
                    borderRadius: 35,
                    height: 75,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderTopWidth: 0,
                    paddingBottom: 12,
                    margin: 12,
                    paddingTop: 12,
                    shadowColor: '#FF69B4',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.15,
                    shadowRadius: 24,
                    elevation: 12,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Fredoka_700Bold',
                    fontSize: 11,
                    marginTop: 2,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="characters"
                options={{
                    title: t('tabs.characters'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.home'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t('tabs.settings'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
