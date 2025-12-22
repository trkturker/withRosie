
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { router } from 'expo-router';
import { ScreenContent } from '@/components/ScreenContent';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        setLoading(true);
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Hata', error.message);
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
                    <Text className="text-4xl font-bold text-[#FF69B4] mb-8 text-center italic">
                        Rosie {isRegistering ? 'Kayıt' : 'Giriş'}
                    </Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-[#FF85A1] font-semibold mb-2 ml-2">E-posta</Text>
                            <TextInput
                                placeholder="hello@kawaii.com"
                                className="bg-[#FFF0F3] p-4 rounded-3xl border-2 border-[#FFE0E6] text-gray-800"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="text-[#FF85A1] font-semibold mb-2 ml-2">Şifre</Text>
                            <TextInput
                                placeholder="••••••••"
                                secureTextEntry
                                className="bg-[#FFF0F3] p-4 rounded-3xl border-2 border-[#FFE0E6] text-gray-800"
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleAuth}
                        disabled={loading}
                        className="bg-[#FF69B4] p-5 rounded-full mt-10 shadow-lg active:opacity-80"
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center font-bold text-xl uppercase tracking-widest">
                                {isRegistering ? 'Haydi Başla' : 'Giriş Yap'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsRegistering(!isRegistering)}
                        className="mt-6"
                    >
                        <Text className="text-[#FF85A1] text-center font-semibold">
                            {isRegistering ? 'Zaten hesabın var mı? Giriş yap' : 'Yeni misin? Hemen kayıt ol!'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="absolute bottom-10 text-[#FFB6C1] font-medium">
                    Made with 💖 for Kawaii Lovers
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}
