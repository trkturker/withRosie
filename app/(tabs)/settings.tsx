
import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function SettingsScreen() {
    const { logout } = useAuth();
    const {
        notificationsEnabled,
        soundsEnabled,
        language,
        setNotificationsEnabled,
        setSoundsEnabled,
        setLanguage
    } = useSettings();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FFF5F7]">
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 120 }}>
                <Text className="text-3xl font-fredoka-bold text-[#FF69B4] mb-8">{t('settings.title')}</Text>

                <View className="bg-white rounded-[32px] p-6 shadow-sm border border-[#FFE0E6] mb-6">
                    <SettingItem
                        icon="notifications-outline"
                        label={t('settings.notifications')}
                        value={notificationsEnabled}
                        onToggle={setNotificationsEnabled}
                    />
                    <View className="h-[1px] bg-[#FFE0E6] my-4" />
                    <SettingItem
                        icon="volume-high-outline"
                        label={t('settings.sounds')}
                        value={soundsEnabled}
                        onToggle={setSoundsEnabled}
                    />
                </View>

                <Text className="text-[#FF85A1] font-fredoka-bold mb-4 ml-2 uppercase tracking-widest text-xs">
                    {t('settings.language')}
                </Text>
                <View className="bg-white rounded-[32px] p-2 shadow-sm border border-[#FFE0E6] flex-row mb-8">
                    <LanguageButton
                        label={t('settings.turkish')}
                        active={language === 'tr'}
                        onPress={() => setLanguage('tr')}
                    />
                    <LanguageButton
                        label={t('settings.english')}
                        active={language === 'en'}
                        onPress={() => setLanguage('en')}
                    />
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="bg-white p-5 rounded-[24px] shadow-sm border border-[#FFE0E6] flex-row items-center justify-center space-x-2"
                >
                    <Ionicons name="log-out-outline" size={24} color="#FF69B4" />
                    <Text className="text-[#FF69B4] font-fredoka-bold text-lg">{t('common.logout')}</Text>
                </TouchableOpacity>

                <Text className="text-center text-[#FFB6C1] mt-8 text-xs font-fredoka-medium">
                    Rosie v1.0.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const SettingItem = ({ icon, label, value, onToggle }: any) => (
    <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3">
            <View className="bg-[#FFF0F3] p-2 rounded-xl">
                <Ionicons name={icon} size={22} color="#FF69B4" />
            </View>
            <Text className="text-[#FF819E] font-fredoka-bold text-base">{label}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#FFE0E6', true: '#FF69B4' }}
            thumbColor="white"
        />
    </View>
);

const LanguageButton = ({ label, active, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className={`flex-1 p-4 rounded-[24px] items-center ${active ? 'bg-[#FF69B4]' : 'bg-transparent'}`}
    >
        <Text className={`font-fredoka-bold ${active ? 'text-white' : 'text-[#FF85A1]'}`}>{label}</Text>
    </TouchableOpacity>
);
