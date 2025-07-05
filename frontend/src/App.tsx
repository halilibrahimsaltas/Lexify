import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Merriweather': require('./assets/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf'),
    'Merriweather-Italic': require('./assets/fonts/Merriweather-Italic-VariableFont_opsz,wdth,wght.ttf'),
  });

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