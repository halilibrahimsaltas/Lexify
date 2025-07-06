import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';
import { useRobotoFonts } from './hooks/useFonts';

export default function App() {
  const fontsLoaded = useRobotoFonts();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // Font yüklendiğinde yapılacak işlemler
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
        <StatusBar style="dark" /> {/* Tema rengine göre ayarlanabilir */}
      </AuthProvider>
    </SafeAreaProvider>
  );
}