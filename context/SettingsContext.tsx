import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

interface SettingsContextType {
    notificationsEnabled: boolean;
    soundsEnabled: boolean;
    musicEnabled: boolean;
    language: string;
    setNotificationsEnabled: (value: boolean) => void;
    setSoundsEnabled: (value: boolean) => void;
    setMusicEnabled: (value: boolean) => void;
    setLanguage: (value: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
    const [soundsEnabled, setSoundsEnabledState] = useState(true);
    const [musicEnabled, setMusicEnabledState] = useState(true);
    const [language, setLanguageState] = useState(i18n.language || 'en');

    useEffect(() => {

        const loadSettings = async () => {
            try {
                const savedNotif = await AsyncStorage.getItem('notificationsEnabled');
                const savedSounds = await AsyncStorage.getItem('soundsEnabled');
                const savedMusic = await AsyncStorage.getItem('musicEnabled');
                const savedLang = await AsyncStorage.getItem('user-language');

                if (savedNotif !== null) setNotificationsEnabledState(JSON.parse(savedNotif));
                if (savedSounds !== null) setSoundsEnabledState(JSON.parse(savedSounds));
                if (savedMusic !== null) setMusicEnabledState(JSON.parse(savedMusic));
                if (savedLang !== null) {
                    setLanguageState(savedLang);
                    i18n.changeLanguage(savedLang);
                }
            } catch (e) {
                console.error('Failed to load settings', e);
            }
        };
        loadSettings();
    }, []);

    const setNotificationsEnabled = async (value: boolean) => {
        if (value) {
            const { registerForPushNotificationsAsync } = await import('../lib/notifications');
            const { status } = await registerForPushNotificationsAsync();

            if (status !== 'granted') {
                const { Alert } = await import('react-native');
                Alert.alert(
                    i18n.t('common.error'),
                    i18n.t('settings.notificationsDenied')
                );
                setNotificationsEnabledState(false);
                await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(false));
                return;
            }
        }

        setNotificationsEnabledState(value);
        await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
    };

    const setSoundsEnabled = async (value: boolean) => {
        setSoundsEnabledState(value);
        await AsyncStorage.setItem('soundsEnabled', JSON.stringify(value));

    };

    const setMusicEnabled = async (value: boolean) => {
        setMusicEnabledState(value);
        await AsyncStorage.setItem('musicEnabled', JSON.stringify(value));
    };

    const setLanguage = async (value: string) => {
        setLanguageState(value);
        i18n.changeLanguage(value);
        await AsyncStorage.setItem('user-language', value);
    };

    return (
        <SettingsContext.Provider
            value={{
                notificationsEnabled,
                soundsEnabled,
                musicEnabled,
                language,
                setNotificationsEnabled,
                setSoundsEnabled,
                setMusicEnabled,
                setLanguage,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
