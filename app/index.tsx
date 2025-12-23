
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F7' }}>
        <ActivityIndicator size="large" color="#FF69B4" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
