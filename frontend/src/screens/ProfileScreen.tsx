import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import Alert from "../components/Alert";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import userService, { User, UpdateUserRequest } from "../services/user.service";
import wordService, { Word } from "../services/word.service";
import Toast from "../components/Toast";
import { useLanguage } from "../contexts/LanguageContext";
// @ts-ignore (MaterialCommunityIcons, Feather, Ionicons importlarının üstüne).
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// @ts-ignore (MaterialCommunityIcons, Feather, Ionicons importlarının üstüne).
import Feather from "react-native-vector-icons/Feather";
// @ts-ignore (MaterialCommunityIcons, Feather, Ionicons importlarının üstüne).
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    password: "",
    passwordRepeat: "",
  });
  const [userWords, setUserWords] = useState<Word[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "primary" as
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "warning"
      | "info",
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const { t } = useLanguage();

  const showAlert = (
    title: string,
    message: string,
    type: "primary" | "secondary" | "success" | "error" = "primary"
  ) => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        password: "",
        passwordRepeat: "",
      });
      loadUserWords();
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setEditForm({
          name: user.name,
          password: "",
          passwordRepeat: "",
        });
        loadUserWords();
      }
    }, [user])
  );

  const loadUserWords = async () => {
    if (!user) return;

    try {
      const words = await wordService.getUserWords();
      setUserWords(words);
    } catch (error) {
      console.log("User words loading error:", error);
    }
  };

  const handleEditProfile = async () => {
    if (!user) return;

    if (editForm.password !== editForm.passwordRepeat) {
      showAlert(t("error"), t("passwords_do_not_match"), "error");
      showToast(t("passwords_do_not_match"), "error");
      return;
    }

    const updateData: UpdateUserRequest = {};
    if (editForm.name !== user.name) updateData.name = editForm.name;
    if (editForm.password.trim()) updateData.password = editForm.password;

    if (Object.keys(updateData).length === 0) {
      showAlert(t("info"), t("no_changes"), "primary");
      showToast(t("no_changes"), "info");
      return;
    }

    setEditLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, updateData);
      updateUser({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
      setEditModalVisible(false);
      showAlert(t("success"), t("profile_updated"), "primary");
      showToast(t("profile_updated_success"), "success");
    } catch (error: any) {
      showAlert(t("error"), error.message, "primary");
      showToast(error.message || t("something_went_wrong"), "error");
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = async () => {
    setAlertConfig({
      title: t("logout"),
      message: t("logout_confirm"),
      type: "secondary",
    });
    setAlertVisible(true);
  };

  const handleAlertClose = async (confirmed?: boolean) => {
    setAlertVisible(false);
    if (alertConfig.title === t("logout") && confirmed !== false) {
      await logout();
      showToast(t("logout_done"), "success");
    }
  };

  const menuItems = [
    {
      id: "1",
      title: t("account_info"),
      subtitle: t("edit_personal_info"),
      icon: <Feather name="user" size={26} color="#FFF8E1" />,
      onPress: () => setEditModalVisible(true),
    },
    {
      id: "2",
      title: t("books"),
      subtitle: t("view_added_books"),
      icon: (
        <MaterialCommunityIcons name="bookshelf" size={26} color="#FFF8E1" />
      ),
      onPress: () => navigation.navigate("MainDrawer", { screen: t("books") }),
    },
    {
      id: "3",
      title: t("saved_words"),
      subtitle: t("view_saved_words"),
      icon: <Feather name="star" size={26} color="#FFF8E1" />,
      onPress: () =>
        navigation.navigate("MainDrawer", { screen: t("saved_words") }),
    },
    {
      id: "4",
      title: t("dictionary"),
      subtitle: t("dictionary_tool"),
      icon: <Ionicons name="book-outline" size={26} color="#FFF8E1" />,
      onPress: () =>
        navigation.navigate("MainDrawer", { screen: t("dictionary") }),
    },
    {
      id: "6",
      title: t("settings"),
      subtitle: t("edit_app_settings"),
      icon: <Feather name="settings" size={26} color="#FFF8E1" />,
      onPress: () =>
        navigation.navigate("MainDrawer", { screen: t("settings") }),
    },
    {
      id: "7",
      title: t("help"),
      subtitle: t("help_tooltip"),
      icon: <Feather name="help-circle" size={26} color="#FFF8E1" />,
      onPress: () => navigation.navigate("Help"),
    },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        {item.icon}
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E2B1B" />
          <Text style={styles.loadingText}>
            Kullanıcı bilgileri yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Kullanıcı Bilgileri */}
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Menü Öğeleri */}
        <View style={styles.menuSection}>{menuItems.map(renderMenuItem)}</View>

        {/* Ayarlar */}

        {/* Çıkış Butonu */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Alert Component */}
      <Alert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type as "primary" | "secondary"}
        onClose={handleAlertClose}
      />

      {/* Toast Component */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      {/* Profil Düzenleme Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("edit_profile")}</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t("full_name")}</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.name}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, name: text })
                  }
                  placeholder={t("enter_full_name")}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t("new_password")}</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.password}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, password: text })
                  }
                  placeholder={t("enter_new_password")}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {t("repeat_new_password")}
                </Text>
                <TextInput
                  style={styles.input}
                  value={editForm.passwordRepeat}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, passwordRepeat: text })
                  }
                  placeholder={t("enter_repeat_new_password")}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleEditProfile}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalButtonPrimaryText}>{t("save")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFF8E1",
    borderBottomWidth: 1,
    borderBottomColor: "#F7C873",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: "#4E2B1B",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4B3F2F",
    flex: 1,
    fontFamily: "Roboto_500Medium",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    fontFamily: "Roboto_400Regular",
  },
  content: {
    flex: 1,
    padding: 10,
  },
  userSection: {
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  avatarContainer: {
    marginRight: 20,
    backgroundColor: "#FAF3DD",
    borderRadius: 30,
    padding: 10,
  },
  avatar: {
    fontSize: 40,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4E2B1B",
    marginBottom: 6,
    fontFamily: "Roboto_500Medium",
  },
  userEmail: {
    fontSize: 13,
    color: "#4E2B1B",
    marginBottom: 6,
    fontFamily: "Roboto_400Regular",
  },
  userLevel: {
    fontSize: 12,
    color: "#4E2B1B",
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  statsSection: {
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    padding: 24,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4E2B1B",
    marginBottom: 6,
    fontFamily: "Roboto_500Medium",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
  menuSection: {
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    marginBottom: 20,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 26,
    marginRight: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#4B3F2F",
    marginBottom: 3,
    fontFamily: "Roboto_500Medium",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Roboto_400Regular",
  },
  menuArrow: {
    fontSize: 20,
    color: "#ccc",
    fontWeight: "bold",
  },
  settingsSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B3F2F",
    marginBottom: 18,
    fontFamily: "Roboto_500Medium",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    fontSize: 22,
    marginRight: 18,
  },
  settingTitle: {
    fontSize: 17,
    color: "#4B3F2F",
    fontFamily: "Roboto_400Regular",
  },
  logoutButton: {
    backgroundColor: "#32341f",
    borderColor: "#32341f",
    borderWidth: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  logoutButtonText: {
    color: "#FFF8E1",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    borderColor: "#32341f",
    borderWidth: 1,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4E2B1B",
    fontFamily: "Roboto_500Medium",
  },
  modalClose: {
    fontSize: 26,
    color: "#4E2B1B",
    fontWeight: "bold",
  },
  modalBody: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4E2B1B",
    marginBottom: 8,
    fontFamily: "Roboto_500Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    fontFamily: "Roboto_400Regular",
    color: "#4E2B1B",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#32341f",
    backgroundColor: "#FFF8E1",
  },
  modalButtonPrimary: {
    backgroundColor: "#32341f",
    borderColor: "#32341f",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  modalButtonText: {
    color: "#32341f",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  modalButtonPrimaryText: {
    color: "#FFF8E1",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  section: {
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    padding: 24,
    marginBottom: 20,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

export default ProfileScreen;
