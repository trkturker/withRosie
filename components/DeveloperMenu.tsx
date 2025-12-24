import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type PetState = 'happy' | 'bored' | 'hungry' | 'tired';

interface DeveloperMenuProps {
    visible: boolean;
    onClose: () => void;
    currentState: PetState;
    onStateSelect: (state: PetState) => void;
}

export const DeveloperMenu: React.FC<DeveloperMenuProps> = ({ visible, onClose, currentState, onStateSelect }) => {
    const { t } = useTranslation();

    const moodOptions: { state: PetState; icon: any; color: string; labelKey: string }[] = [
        { state: 'happy', icon: 'happy-outline', color: '#B5EAD7', labelKey: 'home.status.happy' },
        { state: 'hungry', icon: 'pizza-outline', color: '#FF9AA2', labelKey: 'home.status.hungry' },
        { state: 'bored', icon: 'game-controller-outline', color: '#FFDAC1', labelKey: 'home.status.bored' },
        { state: 'tired', icon: 'bed-outline', color: '#C7CEEA', labelKey: 'home.status.tired' },
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center px-6"
                onPress={onClose}
            >
                <Pressable
                    className="bg-white rounded-[40px] w-full p-8 shadow-2xl border-4 border-[#FFD1DC]"
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-fredoka-bold text-[#FF69B4]">{t('devMenu.title')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={32} color="#FFB6C1" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-[#FF85A1] font-fredoka-medium mb-6 text-center">
                        {t('devMenu.description')}
                    </Text>

                    <View className="flex-row flex-wrap justify-between">
                        {moodOptions.map((option) => (
                            <TouchableOpacity
                                key={option.state}
                                onPress={() => {
                                    onStateSelect(option.state);
                                    onClose();
                                }}
                                className={`w-[48%] mb-4 p-4 rounded-3xl border-2 items-center ${currentState === option.state ? 'border-[#FF69B4] bg-[#FFF0F3]' : 'border-[#FFE0E6] bg-white'}`}
                            >
                                <View style={{ backgroundColor: option.color }} className="w-12 h-12 rounded-2xl items-center justify-center mb-2">
                                    <Ionicons name={option.icon} size={24} color="white" />
                                </View>
                                <Text className="font-fredoka-bold text-[#FF85A1]">{t(option.labelKey)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-[#FFD1DC] p-4 rounded-2xl mt-4 items-center"
                    >
                        <Text className="font-fredoka-bold text-[#FF69B4]">{t('devMenu.close')}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
