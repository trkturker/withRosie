
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { registerForPushNotificationsAsync, sendLocalNotification } from '../../lib/notifications';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';

const moodImages: Record<string, any> = {
    happy: require('../../assets/moods/charBase.png'),
    bored: require('../../assets/moods/charBored.png'),
    hungry: require('../../assets/moods/charHungry.png'),
    tired: require('../../assets/moods/charTired.png'),
};

type PetState = 'happy' | 'bored' | 'hungry' | 'tired';

interface PetData {
    name: string;
    state: PetState;
    lastInteraction: number;
}

export default function HomeScreen() {
    const { user } = useAuth();
    const { notificationsEnabled, soundsEnabled } = useSettings();
    const { t } = useTranslation();
    const [petData, setPetData] = useState<PetData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && notificationsEnabled) {
            registerForPushNotificationsAsync().then(token => {
                if (token) {
                    // Save token and email to user root document
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
                    setPetData(docSnap.data() as PetData);
                } else {
                    const initialData: PetData = {
                        name: 'Rosie',
                        state: 'happy',
                        lastInteraction: Date.now()
                    };
                    setDoc(docRef, {
                        ...initialData,
                        userEmail: user.email // Store contact email with pet status
                    });
                    setPetData(initialData);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const playSound = async () => {
        if (!soundsEnabled) return;
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/pop.mp3') // Assuming this exists or will be added
            );
            await sound.playAsync();
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

            if (newState === 'happy' && notificationsEnabled) {
                await sendLocalNotification(
                    t('notifications.happinessTitle'),
                    t('notifications.happinessBody', { name: petData?.name || 'Rosie' })
                );
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
        <SafeAreaView className="flex-1 px-6 py-8 bg-[#FFF5F7] font-fredoka">
            <ScrollView>

                {/* Header */}
                <View className="flex-row justify-between items-center ">
                    {/* <View className="flex-row justify-between items-center mb-10"> */}
                    <View>
                        <Text className="text-3xl font-fredoka-bold text-[#FF69B4]">{petData.name} ✨</Text>
                        <View className="bg-white px-4 py-1 rounded-full mt-2 self-start shadow-sm flex-row items-center border border-[#FFE0E6]">
                            <View className={`w-2 h-2 rounded-full mr-2 ${petData.state === 'happy' ? 'bg-green-400' : 'bg-pink-400 animate-pulse'}`} />
                            <Text className="text-[#FF85A1] font-fredoka-medium capitalize">{t(`home.status.${petData.state}`)}</Text>
                        </View>
                    </View>
                </View>

                {/* Developer Controls */}
                <View className="flex-1 ">
                    <Text className="text-black text-[10px] text-center mb-2 uppercase tracking-widest opacity-60">{t('home.devControls')}</Text>
                    <View className="flex-row justify-center space-x-6 opacity-30">
                        <TouchableOpacity onPress={() => updatePetState('hungry')} className="mx-2">
                            <Text className="text-black text-xs underline">Acıkmış (Hungry)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updatePetState('bored')} className="mx-2">
                            <Text className="text-black text-xs underline">Sıkılmış (Bored)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updatePetState('tired')} className="mx-2">
                            <Text className="text-black text-xs underline">Yorgun (Tired)</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Character Visual */}
                <View className="flex-1 justify-center items-center">
                    <View className="relative justify-center items-center">
                        <View className="absolute  w-96 h-96 bg-[#FFD1DC] opacity-30 rounded-full blur-3xl" />
                        <Image
                            source={moodImages[petData.state] || moodImages.happy}
                            className="w-96 h-96"
                        />
                    </View>

                    {/* Status Message Bubble */}
                    <View className="bg-white/80 p-4 mt-4 rounded-[35px] border-2 border-[#FFE0E6] items-center shadow-sm w-full">
                        <Text className="text-[#FF69B4] text-xl font-fredoka-bold text-center italic leading-relaxed">
                            {t(`home.messages.${petData.state}`)}
                        </Text>
                    </View>
                </View>

                {/* Interaction Actions */}
                <View className="flex-row justify-between mt-6 ">
                    <ActionButton
                        label={t('home.actions.feed')}
                        icon="pizza"
                        color="#FF9AA2"
                        onPress={() => updatePetState('happy')}
                        isActive={petData.state === 'hungry'}
                        subLabel={t('home.subactions.feedTime')}
                    />
                    <ActionButton
                        label={t('home.actions.play')}
                        icon="heart"
                        color="#B5EAD7"
                        onPress={() => updatePetState('happy')}
                        isActive={petData.state === 'bored'}
                        subLabel={t('home.subactions.playTime')}
                    />
                    <ActionButton
                        label={t('home.actions.rest')}
                        icon="bed"
                        color="#C7CEEA"
                        onPress={() => updatePetState('happy')}
                        isActive={petData.state === 'tired'}
                        subLabel={t('home.subactions.restTime')}
                    />
                </View>





            </ScrollView>

        </SafeAreaView >
    );
}

const ActionButton = ({ label, icon, color, onPress, isActive, subLabel }: any) => (
    <View className="items-center flex-1">
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: color,
                shadowColor: color,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 10
            }}
            className={`w-[82px] h-[82px] rounded-[30px] justify-center items-center border-b-4 border-black/10 transition-transform active:scale-90 ${isActive ? 'scale-110 border-4 border-white shadow-2xl' : 'border-4 border-white shadow-3xl'}`}
        >
            <Ionicons name={icon} size={34} color="white" />
        </TouchableOpacity>
        <Text className="mt-3 font-fredoka-bold text-[#FF69B4] text-[15px]">{label}</Text>
        <Text className="text-[#FFB6C1] text-[11px] font-fredoka-medium tracking-tight">{subLabel}</Text>
    </View>
);
