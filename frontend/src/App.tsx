import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./contexts/AuthContext";
import AppContent from "./AppContent";
import { useRobotoFonts } from "./hooks/useFonts";
import { LanguageProvider } from "./contexts/LanguageContext";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const fontsLoaded = useRobotoFonts();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      // Fontlar yüklendikten sonra 2 saniye animasyon göster
      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || showSplash) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
          <StatusBar style="dark" /> {/* Tema rengine göre ayarlanabilir */}
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
