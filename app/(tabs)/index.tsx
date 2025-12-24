import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { registerForPushNotificationsAsync, sendLocalNotification, scheduleDelayedNotification, cancelAllNotifications } from '../../lib/notifications';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { DeveloperMenu } from '../../components/DeveloperMenu';
import { ActionButton } from '../../components/ActionButton';

const moodImages: Record<string, any> = {
    happy: require('../../assets/moods/charBase.png'),
    bored: require('../../assets/moods/charBored.png'),
    hungry: require('../../assets/moods/charHungry.png'),
    tired: require('../../assets/moods/charTired.png'),
};

const voiceLines: Record<string, any> = {
    happy: require('../../assets/voicelines/happy.mp3'),
    bored: require('../../assets/voicelines/bored.mp3'),
    hungry: require('../../assets/voicelines/hungry.mp3'),
    tired: require('../../assets/voicelines/tired.mp3'),
};

type PetState = 'happy' | 'bored' | 'hungry' | 'tired';

interface PetData {
    name: string;
    state: PetState;
    lastInteraction: number;
}

export default function HomeScreen() {
    const { user } = useAuth();
    const { notificationsEnabled, soundsEnabled, musicEnabled } = useSettings();
    const { t } = useTranslation();
    const [petData, setPetData] = useState<PetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDevMenu, setShowDevMenu] = useState(false);
    const voiceRef = useRef<Audio.Sound | null>(null);


    useEffect(() => {
        if (user && notificationsEnabled) {
            registerForPushNotificationsAsync().then(({ token }) => {
                if (token) {
                    setDoc(doc(db, 'users', user.uid), {
                        pushToken: token,
                        email: user.email
                    }, { merge: true });
                }
            });
        }
    }, [user, notificationsEnabled]);


    useEffect(() => {
        if (user) {
            const docRef = doc(db, 'users', user.uid, 'pet', 'status');
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as PetData;
                    setPetData(data);

                    if (data.state === 'happy') {
                        const timePassed = Date.now() - data.lastInteraction;
                        const THIRTY_MINUTES = 30 * 60 * 1000;
                        if (timePassed > THIRTY_MINUTES) {
                            const possibleStates: PetState[] = ['hungry', 'bored', 'tired'];
                            const randomState = possibleStates[Math.floor(Math.random() * possibleStates.length)];
                            updatePetState(randomState);
                        }
                    }
                } else {
                    const initialData: PetData = {
                        name: 'Rosie',
                        state: 'bored',
                        lastInteraction: Date.now()
                    };
                    setDoc(docRef, {
                        ...initialData,
                        userEmail: user.email
                    });
                    setPetData(initialData);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const playVoiceLine = async (state: PetState) => {
        if (!soundsEnabled || !voiceLines[state]) return;
        try {
            if (voiceRef.current) {
                await voiceRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(voiceLines[state]);
            voiceRef.current = sound;
            await voiceRef.current.playAsync();
        } catch (e) {
            console.log('Voice line play error', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (petData?.state) {
                playVoiceLine(petData.state);
            }

            return () => {
                if (voiceRef.current) {
                    voiceRef.current.unloadAsync();
                }
            };
        }, [petData?.state, soundsEnabled])
    );

    const playSound = async () => {
        if (!soundsEnabled) return;
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/pop.mp3')
            );
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (e) {
            console.log('Sound play error - might be missing file');
        }
    };

    const updatePetState = async (newState: PetState) => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid, 'pet', 'status');
        try {
            await setDoc(docRef, {
                ...petData,
                state: newState,
                lastInteraction: Date.now(),
                userEmail: user.email
            }, { merge: true });

            playSound();

            if (notificationsEnabled) {
                await cancelAllNotifications();
                const mapping: Record<string, string> = {
                    hungry: 'notifications.needFood',
                    bored: 'notifications.wantPlay',
                    tired: 'notifications.missYou'
                };

                if (newState === 'happy') {
                    await sendLocalNotification(
                        t('notifications.happinessTitle'),
                        t('notifications.happinessBody', { name: petData?.name || 'Rosie' })
                    );
                    const states: PetState[] = ['hungry', 'bored', 'tired'];
                    const nextState = states[Math.floor(Math.random() * states.length)];
                    await scheduleDelayedNotification(
                        petData?.name || 'Rosie',
                        t(mapping[nextState]),
                        1800
                    );
                } else {
                    await sendLocalNotification(
                        petData?.name || 'Rosie',
                        t(mapping[newState])
                    );
                }
            }
        } catch (error) {
            console.error("Error updating pet state:", error);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#FFF5F7]">
                <ActivityIndicator size="large" color="#FF69B4" />
            </View>
        );
    }

    if (!user || !petData) return null;

    return (
        <SafeAreaView className="flex-1 px-6 py-8 bg-[#FFF5F7]">
            <ScrollView showsVerticalScrollIndicator={false}>

                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-3xl font-balsamiq-bold text-[#FF69B4]">{petData.name} ✨</Text>
                        <View className="bg-white px-4 py-1 rounded-full mt-2 self-start shadow-sm flex-row items-center border border-[#FFE0E6]">
                            <View className={`w-2 h-2 rounded-full mr-2 ${petData.state === 'happy' ? 'bg-green-400' : 'bg-pink-400 animate-pulse'}`} />
                            <Text className="text-[#FF85A1] font-balsamiq capitalize">{t(`home.status.${petData.state}`)}</Text>
                        </View>
                    </View>


                    <TouchableOpacity
                        onPress={() => setShowDevMenu(true)}
                        className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-[#FFE0E6]"
                    >
                        <Ionicons name="menu-outline" size={28} color="#FF69B4" />
                    </TouchableOpacity>
                </View>


                <View className="items-center my-4">
                    <View className="relative justify-center items-center">
                        <View className="absolute w-96 h-96 bg-[#FFD1DC] opacity-30 rounded-full blur-3xl" />
                        <Image
                            source={moodImages[petData.state] || moodImages.happy}
                            className="w-96 h-96"
                        />
                    </View>


                    <View className="bg-white/80 p-5 mt-6 rounded-[35px] border-2 border-[#FFE0E6] items-center shadow-sm w-full">
                        <Text className="text-[#FF69B4] text-xl font-balsamiq-bold text-center leading-relaxed">
                            {t(`home.messages.${petData.state}`)}
                        </Text>
                    </View>
                </View>


                <View className="flex-row justify-between mt-8 mb-20">
                    <ActionButton
                        label={t('home.actions.feed')}
                        icon="pizza"
                        color="#FF9AA2"
                        onPress={() => petData.state === 'hungry' && updatePetState('happy')}
                        isActive={petData.state === 'hungry'}
                        subLabel={t('home.subactions.feedTime')}
                    />
                    <ActionButton
                        label={t('home.actions.play')}
                        icon="heart"
                        color="#B5EAD7"
                        onPress={() => petData.state === 'bored' && updatePetState('happy')}
                        isActive={petData.state === 'bored'}
                        subLabel={t('home.subactions.playTime')}
                    />
                    <ActionButton
                        label={t('home.actions.rest')}
                        icon="bed"
                        color="#C7CEEA"
                        onPress={() => petData.state === 'tired' && updatePetState('happy')}
                        isActive={petData.state === 'tired'}
                        subLabel={t('home.subactions.restTime')}
                    />
                </View>
            </ScrollView>

            <DeveloperMenu
                visible={showDevMenu}
                onClose={() => setShowDevMenu(false)}
                currentState={petData.state}
                onStateSelect={updatePetState}
            />
        </SafeAreaView >
    );
}
