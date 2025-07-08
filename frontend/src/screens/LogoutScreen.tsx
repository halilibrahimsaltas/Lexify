import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import Alert from "../components/Alert";
import { useLanguage } from "../contexts/LanguageContext";

const LogoutScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      setAlertVisible(true);
      setTimeout(() => {
        navigation.replace("Login");
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
        title={t("logout_done")}
        message={t("logout_success")}
        type="primary"
        onClose={handleCloseAlert}
        autoClose={true}
        autoCloseDelay={1500}
      />
    </View>
  );
};

export default LogoutScreen;
