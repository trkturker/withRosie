import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonProps {
    label: string;
    icon: any;
    color: string;
    onPress: () => void;
    isActive: boolean;
    subLabel: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, icon, color, onPress, isActive, subLabel }) => (
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
        <Text className="mt-3 font-balsamiq-bold text-[#FF69B4] text-[15px] text-center">{label}</Text>
        <Text className="text-[#FFB6C1] text-[11px] font-balsamiq tracking-tight text-center">{subLabel}</Text>
    </View>
);
