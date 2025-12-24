import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function LoginScreen() {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const loadSavedEmail = async () => {
            try {
                const savedEmail = await AsyncStorage.getItem('rememberedEmail');
                if (savedEmail) {
                    setEmail(savedEmail);
                    setRememberMe(true);
                }
            } catch (e) {
                console.error('Failed to load remembered email', e);
            }
        };
        loadSavedEmail();
    }, []);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert(t('common.error'), t('login.fillAll'));
            return;
        }

        setLoading(true);
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }

            if (rememberMe) {
                await AsyncStorage.setItem('rememberedEmail', email);
            } else {
                await AsyncStorage.removeItem('rememberedEmail');
            }

            router.replace('/');
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#FFF5F7]"
        >
            <View className="flex-1 justify-center items-center px-8">
                <View className="bg-white p-8 rounded-[40px] w-full shadow-2xl border-4 border-[#FFD1DC]">
                    <Text className={`${i18n.language === 'tr' ? 'text-2xl' : 'text-3xl'} font-balsamiq-bold text-[#FF69B4] mb-8 text-center`}>
                        {isRegistering ? t('login.registerTitle') : t('login.title')}
                    </Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-[#FF85A1] font-balsamiq-bold mb-2 ml-2">{t('login.email')}</Text>
                            <TextInput
                                placeholder="hello@kawaii.com"
                                className="bg-[#FFF0F3] p-4 rounded-3xl border-2 border-[#FFE0E6] text-gray-800 font-balsamiq"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="text-[#FF85A1] font-balsamiq-bold mb-2 ml-2">{t('login.password')}</Text>
                            <TextInput
                                placeholder="••••••••"
                                secureTextEntry
                                className="bg-[#FFF0F3] p-4 rounded-3xl border-2 border-[#FFE0E6] text-gray-800 font-balsamiq"
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        {!isRegistering && (
                            <TouchableOpacity
                                onPress={() => setRememberMe(!rememberMe)}
                                className="flex-row items-center mt-4 ml-2"
                            >
                                <Ionicons
                                    name={rememberMe ? "checkbox" : "square-outline"}
                                    size={24}
                                    color={rememberMe ? "#FF69B4" : "#FFB6C1"}
                                />
                                <Text className="ml-2 text-[#FF85A1] font-balsamiq">
                                    {t('login.rememberMe')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={handleAuth}
                        disabled={loading}
                        className="bg-[#FF69B4] p-5 rounded-full mt-10 shadow-lg active:opacity-80"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center font-balsamiq-bold text-xl uppercase tracking-widest">
                                {isRegistering ? t('login.registerButton') : t('login.loginButton')}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsRegistering(!isRegistering)}
                        className="mt-6"
                    >
                        <Text className="text-[#FF85A1] text-center font-balsamiq-bold">
                            {isRegistering ? t('login.switchToLogin') : t('login.switchToRegister')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="absolute bottom-10 text-[#FFB6C1] font-balsamiq">
                    {t('login.madeWith')}
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}
