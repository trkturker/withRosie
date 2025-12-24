
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return { token: null, status: finalStatus };
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

        try {
            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            console.log(token);
        } catch (e) {
            console.log('Error getting push token', e);
        }

        return { token, status: finalStatus };
    } else {
        console.log('Must use physical device for Push Notifications');
        return { token: null, status: 'granted' }; // Simulating success for simulators for local only
    }
}

export async function sendLocalNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: { data: 'goes here' },
        },
        trigger: null, // send immediately
    });
}
