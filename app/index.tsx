
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Assets mapping
const moodImages: Record<string, any> = {
  happy: require('../assets/moods/charBase.png'),
  bored: require('../assets/moods/charBored.png'),
  hungry: require('../assets/moods/charHungry.png'),
  tired: require('../assets/moods/charTired.png'),
};

type PetState = 'happy' | 'bored' | 'hungry' | 'tired';

interface PetData {
  name: string;
  state: PetState;
  lastInteraction: number;
}

export default function CompanionApp() {
  const { user, loading: authLoading, logout } = useAuth();
  const [petData, setPetData] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading]);

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
          setDoc(docRef, initialData);
          setPetData(initialData);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const updatePetState = async (newState: PetState) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'pet', 'status');
    try {
      await setDoc(docRef, {
        ...petData,
        state: newState,
        lastInteraction: Date.now()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating pet state:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FFF5F7]">
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    );
  }

  if (!user || !petData) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#FFF5F7]">
      <Stack.Screen options={{ title: 'Sanal Bebek', headerShown: false }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-8">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-10">
          <View>
            <Text className="text-3xl font-bold text-[#FF69B4]">{petData.name} ✨</Text>
            <View className="bg-white px-4 py-1 rounded-full mt-2 self-start shadow-sm flex-row items-center border border-[#FFE0E6]">
              <View className={`w-2 h-2 rounded-full mr-2 ${petData.state === 'happy' ? 'bg-green-400' : 'bg-pink-400 animate-pulse'}`} />
              <Text className="text-[#FF85A1] font-medium capitalize">{petData.state}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white p-3 rounded-2xl shadow-sm border border-[#FFE0E6] active:bg-[#FFF0F3]"
          >
            <Ionicons name="log-out-outline" size={24} color="#FF69B4" />
          </TouchableOpacity>
        </View>

        {/* Character Visual */}
        <View className="flex-1 justify-center items-center">
          <View className="relative">
            {/* Glow/Halo Effect */}
            <View className="absolute -inset-10 bg-[#FFD1DC] opacity-30 rounded-full blur-3xl" />

            <Image
              source={moodImages[petData.state] || moodImages.happy}
              className="w-72 h-72"
              resizeMode="contain"
            />
          </View>

          {/* Status Message Bubble */}
          <View className="mt-8 bg-white/80 p-6 rounded-[35px] border-2 border-[#FFE0E6] items-center shadow-sm w-full">
            <Text className="text-[#FF69B4] text-xl font-bold text-center italic leading-relaxed">
              {petData.state === 'happy' && "Yaşasın! Harika hissediyorum! 💕"}
              {petData.state === 'hungry' && "Mide gurultularımı duyuyor musun? 🍩"}
              {petData.state === 'bored' && "Uuuu... Canım çok sıkılıyor! 🎨"}
              {petData.state === 'tired' && "Birazcık kestirmeye mi gitsek? ☁️"}
            </Text>
          </View>
        </View>

        {/* Interaction Actions */}
        <View className="flex-row justify-between mt-12 mb-10">
          <ActionButton
            label="Besle"
            icon="pizza"
            color="#FF9AA2"
            onPress={() => updatePetState('happy')}
            isActive={petData.state === 'hungry'}
            subLabel="Yemek Saati"
          />
          <ActionButton
            label="Oyna"
            icon="heart"
            color="#B5EAD7"
            onPress={() => updatePetState('happy')}
            isActive={petData.state === 'bored'}
            subLabel="Oyun Vakti"
          />
          <ActionButton
            label="Dinlen"
            icon="bed"
            color="#C7CEEA"
            onPress={() => updatePetState('happy')}
            isActive={petData.state === 'tired'}
            subLabel="Uyku Vakti"
          />
        </View>

        {/* Secret Simulator Controls (For testing purposes) */}
        <View className="mb-4">
          <Text className="text-[#FFB6C1] text-[10px] text-center mb-2 uppercase tracking-widest opacity-60">Geliştirici Kontrolleri</Text>
          <View className="flex-row justify-center space-x-6 opacity-30">
            <TouchableOpacity onPress={() => updatePetState('hungry')} className="mx-2">
              <Text className="text-[#FFB6C1] text-xs underline">Acıktır</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updatePetState('bored')} className="mx-2">
              <Text className="text-[#FFB6C1] text-xs underline">Sık</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updatePetState('tired')} className="mx-2">
              <Text className="text-[#FFB6C1] text-xs underline">Yor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ActionButton = ({ label, icon, color, onPress, isActive, subLabel }: any) => (
  <View className="items-center flex-1">
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: color }}
      className={`w-[85px] h-[85px] rounded-[32px] justify-center items-center shadow-lg border-b-4 border-black/10 transition-transform active:scale-95 ${isActive ? 'scale-110 border-4 border-white' : ''}`}
    >
      <Ionicons name={icon} size={36} color="white" />
    </TouchableOpacity>
    <Text className="mt-3 font-bold text-[#FF69B4] text-sm">{label}</Text>
    <Text className="text-[#FFB6C1] text-[10px] font-medium">{subLabel}</Text>
  </View>
);
