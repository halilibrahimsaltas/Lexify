import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const LogoutScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      setAlertVisible(true);
      setTimeout(() => {
        navigation.replace('Login');
      }, 1500);
    };
    doLogout();
  }, []);

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Alert
        visible={alertVisible}
        title="Çıkış Yapıldı"
        message="Başarıyla çıkış yapıldı."
        type="success"
        onClose={handleCloseAlert}
        autoClose={true}
        autoCloseDelay={1500}
      />
    </View>
  );
};

export default LogoutScreen;