import '../global.css';
import '../i18n';

import { Stack, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import * as SplashScreen from 'expo-splash-screen';
import {
    useFonts,
    BalsamiqSans_400Regular,
    BalsamiqSans_400Regular_Italic,
    BalsamiqSans_700Bold,
    BalsamiqSans_700Bold_Italic
} from '@expo-google-fonts/balsamiq-sans';
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function GlobalMusicPlayer() {
    const { user } = useAuth();
    const { musicEnabled, soundsEnabled } = useSettings();
    const segments = useSegments();
    const backgroundMusicRef = useRef<Audio.Sound | null>(null);
    const isInitializingRef = useRef(false);

    // Sound system initialization and cleanup
    useEffect(() => {
        return () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.unloadAsync();
                backgroundMusicRef.current = null;
            }
        };
    }, []);

    // Music playback management
    useEffect(() => {
        const manageBackgroundMusic = async () => {
            // Music should only play if user is logged in, not on login screen, and settings allow it
            const isLoginScreen = (segments as string[])[0] === 'login';
            const shouldPlayMusic = !!user && musicEnabled && soundsEnabled && !isLoginScreen;

            if (shouldPlayMusic) {
                if (!backgroundMusicRef.current && !isInitializingRef.current) {
                    isInitializingRef.current = true;
                    try {
                        const { sound } = await Audio.Sound.createAsync(
                            require('../assets/background/lofibackground.mp3'),
                            { isLooping: true, volume: 0.3 }
                        );
                        backgroundMusicRef.current = sound;

                        // Re-check if we should still be playing before starting
                        // (In case the user logged out or changed screen during load)
                        const currentIsLogin = (segments as string[])[0] === 'login';
                        const stillShouldPlay = !!user && musicEnabled && soundsEnabled && !currentIsLogin;

                        if (stillShouldPlay) {
                            await sound.playAsync();
                        } else {
                            await sound.pauseAsync();
                        }
                    } catch (e) {
                        console.log('Background music load error', e);
                    } finally {
                        isInitializingRef.current = false;
                    }
                } else if (backgroundMusicRef.current) {
                    const status = await backgroundMusicRef.current.getStatusAsync();
                    if (status.isLoaded && !status.isPlaying) {
                        await backgroundMusicRef.current.playAsync();
                    }
                }
            } else {
                if (backgroundMusicRef.current) {
                    const status = await backgroundMusicRef.current.getStatusAsync();
                    if (status.isLoaded && status.isPlaying) {
                        await backgroundMusicRef.current.pauseAsync();
                    }
                }
            }
        };

        manageBackgroundMusic();
    }, [musicEnabled, soundsEnabled, segments, user]);

    return null;
}

export default function Layout() {
    const [loaded, error] = useFonts({
        BalsamiqSans_400Regular,
        BalsamiqSans_400Regular_Italic,
        BalsamiqSans_700Bold,
        BalsamiqSans_700Bold_Italic,
        'Balsamiq-Bold': BalsamiqSans_700Bold,
        'Balsamiq-Regular': BalsamiqSans_400Regular,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <AuthProvider>
            <SettingsProvider>
                <GlobalMusicPlayer />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                </Stack>
            </SettingsProvider>
        </AuthProvider>
    );
}
