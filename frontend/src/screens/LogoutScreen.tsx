import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const LogoutScreen = ({ navigation }: any) => {
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      Alert.alert('Çıkış Yapıldı');
      navigation.replace('Login');
    };
    doLogout();
  }, []);

  return null;
};

export default LogoutScreen;