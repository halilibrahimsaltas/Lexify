import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import Alert from "../components/Alert";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Image } from "react-native";
import api from "../services/api";
import Constants from "expo-constants";
import authService from "../services/auth.service";
import storageService from "../services/storage.service";
import * as AuthSession from "expo-auth-session";
import { useLanguage } from "../contexts/LanguageContext";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "primary" as "primary" | "secondary",
  });
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, register, updateUser } = useAuth();
  const { t } = useLanguage();

  const showAlert = (
    title: string,
    message: string,
    type: "primary" | "secondary" = "primary"
  ) => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      showAlert(t("error"), t("fill_all_fields"), "primary");
      return false;
    }
    if (!isLogin && !name.trim()) {
      showAlert(t("error"), t("enter_name"), "primary");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert(t("error"), t("enter_valid_email"), "primary");
      return false;
    }
    if (password.length < 8) {
      showAlert(t("error"), t("password_min_length"), "primary");
      return false;
    }
    if (!isLogin && (name.length < 2 || name.length > 50)) {
      showAlert(t("error"), t("name_length"), "primary");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
        try {
          await login(email, password);
        } catch (loginError) {
          showAlert(
            t("info"),
            t("register_success_but_login_failed"),
            "primary"
          );
        }
      }
    } catch (error: any) {
      showAlert(
        t("error"),
        error.message || t("something_went_wrong"),
        "primary"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
  };

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID,
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_IOS_CLIENT_ID,
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { idToken } = response.authentication || {};
      if (idToken) {
        handleGoogleLogin(idToken);
      }
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setGoogleLoading(true);
    try {
      const res = await api.post("/auth/google-mobile", { idToken });
      const { access_token, user } = res.data;

      // Token ve kullanıcıyı storage'a kaydet
      await storageService.setAuthToken(access_token);
      await storageService.setUserData(user);

      // Token'ı API header'ına set et
      authService.setAuthToken(access_token);

      // Kullanıcıyı context'e yaz
      updateUser(user);
    } catch (error: any) {
      showAlert(
        "Hata",
        error.response?.data?.message ||
          error.message ||
          "Google ile giriş başarısız",
        "primary"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo ve Başlık */}
        <View style={styles.header}>
          <Image
            source={require("../assets/icon/Lexify_icon.png")}
            style={{
              width: 80,
              height: 80,
              marginBottom: 12,
              borderRadius: 24,
              backgroundColor: "#FFF8E1",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
              alignSelf: "center",
            }}
          />
          <Text
            style={{
              fontFamily: "Lobster_400Regular",
              fontSize: 38,
              color: "#4E2B1B",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {t("app_title")}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin ? t("login_subtitle") : t("register_subtitle")}
          </Text>
        </View>
        {/* Form */}
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t("name")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("enter_name_placeholder")}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                placeholderTextColor="#BCA27F"
              />
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t("email")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("enter_email_placeholder")}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholderTextColor="#BCA27F"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t("password")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("enter_password_placeholder")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#BCA27F"
            />
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? t("loading") : isLogin ? t("login") : t("register")}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Alt Bağlantı */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? t("no_account_text") : t("have_account_text")}
          </Text>
          <TouchableOpacity onPress={toggleMode} disabled={loading}>
            <Text style={styles.footerLink}>
              {isLogin ? t("register_link") : t("login_link")}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Sosyal Giriş */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>{t("or")}</Text>
          <TouchableOpacity
            style={styles.socialButton}
            disabled={loading || googleLoading}
            onPress={() => promptAsync()}
          >
            {googleLoading ? (
              <ActivityIndicator color="#4E2B1B" />
            ) : (
              <Text style={styles.socialButtonText}>
                {t("continue_with_google")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* Custom Alert Component */}
      <Alert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type as "primary" | "secondary"}
        onClose={handleCloseAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#4E2B1B",
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
  form: {
    marginBottom: 24,
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    padding: 20,
    shadowColor: "transparent",
    elevation: 0,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4E2B1B",
    marginBottom: 7,
    fontFamily: "Roboto_500Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: "#4E2B1B",
    fontFamily: "Roboto_400Regular",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: "#4E2B1B",
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
  },
  submitButton: {
    backgroundColor: "#32341f",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "transparent",
    elevation: 0,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#FFF8E1",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  footerText: {
    color: "#4E2B1B",
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
    marginRight: 5,
    textAlign: "center",
  },
  footerLink: {
    color: "#4E2B1B",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
    fontFamily: "Roboto_500Medium",
  },
  socialContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  socialText: {
    color: "#4E2B1B",
    fontSize: 14,
    marginBottom: 12,
    fontFamily: "Roboto_400Regular",
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#FAFAFA",
    width: "100%",
    alignItems: "center",
  },
  socialButtonText: {
    color: "#4E2B1B",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Roboto_500Medium",
  },
  toggleButton: {
    alignSelf: "flex-end",
    marginBottom: 18,
  },
  toggleButtonText: {
    color: "#4E2B1B",
    fontSize: 14,
    fontFamily: "Roboto_400Regular",
  },
});

export default LoginScreen;
