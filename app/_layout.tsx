import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot ,Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { CartProvider } from './(tabs)/context/CartContext';
import { UserProvider } from './(tabs)/context/UserContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider>
      <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      </CartProvider>
      </UserProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
