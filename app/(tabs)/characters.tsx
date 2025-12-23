
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CharactersScreen() {
    const { t } = useTranslation();

    return (
        <SafeAreaView className="flex-1 bg-[#FFF5F7]">
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 120 }}>
                <Text className="text-3xl font-bold text-[#FF69B4] mb-8">{t('tabs.characters')}</Text>

                <View className="flex-row flex-wrap justify-between">
                    <CharacterCard
                        name="Rosie"
                        image={require('../../assets/moods/charBase.png')}
                        selected={true}
                    />
                    <CharacterCard
                        name="Luna"
                        image={require('../../assets/moods/charBored.png')}
                        locked={true}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const CharacterCard = ({ name, image, selected, locked }: any) => (
    <TouchableOpacity
        className={`w-[47%] bg-white rounded-[32px] p-4 mb-4 border-2 ${selected ? 'border-[#FF69B4]' : 'border-[#FFE0E6]'} ${locked ? 'opacity-50' : ''}`}
    >
        <Image source={image} className="w-full h-32" resizeMode="contain" />
        <Text className="text-center font-bold text-[#FF69B4] mt-2">{name}</Text>
        {locked && (
            <Text className="text-center text-[#FFB6C1] text-[10px] uppercase font-bold mt-1">Locked</Text>
        )}
    </TouchableOpacity>
);
