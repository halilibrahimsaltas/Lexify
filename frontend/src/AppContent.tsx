import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Navigation from './navigation/Navigation';
import LoadingScreen from './components/LoadingScreen';



export default function AppContent() {
  const { isLoading } = useAuth();
  return isLoading ? < LoadingScreen /> : <Navigation />;
}