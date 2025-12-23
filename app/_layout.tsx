import '../global.css';
import '../i18n';

import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SettingsProvider } from '../context/SettingsContext';

export default function Layout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SettingsProvider>
    </AuthProvider>
  );
}
