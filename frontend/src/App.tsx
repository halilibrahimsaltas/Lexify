import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import AppContent from './AppContent';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
        <StatusBar style="dark" /> {/* Tema rengine göre ayarlanabilir */}
      </AuthProvider>
    </SafeAreaProvider>
  );
}