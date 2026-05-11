import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Colors } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { 
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold 
} from '@expo-google-fonts/hanken-grotesk';
import { 
  Inter_400Regular, 
  Inter_600SemiBold 
} from '@expo-google-fonts/inter';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="wallet-setup" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ presentation: 'modal' }} />
        <Stack.Screen name="pay-manual" options={{ presentation: 'modal' }} />
        <Stack.Screen name="pay" options={{ presentation: 'card' }} />
        <Stack.Screen name="success" options={{ gestureEnabled: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
