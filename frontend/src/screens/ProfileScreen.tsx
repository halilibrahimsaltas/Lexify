import React, { useState, useEffect } from "react";
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

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userWords, setUserWords] = useState<Word[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        password: "",
      });
      loadUserWords();
    }
  }, [user]);

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

    const updateData: UpdateUserRequest = {};
    if (editForm.name !== user.name) updateData.name = editForm.name;
    if (editForm.email !== user.email) updateData.email = editForm.email;
    if (editForm.password.trim()) updateData.password = editForm.password;

    if (Object.keys(updateData).length === 0) {
      showAlert("Bilgi", "Değişiklik yapılmadı", 'info');
      return;
    }

    setEditLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, updateData);

      // AuthContext'teki kullanıcı verilerini güncelle
      updateUser({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      setEditModalVisible(false);
      showAlert("Başarılı", "Profil güncellendi", 'success');
    } catch (error: any) {
      showAlert("Hata", error.message, 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = async () => {
    showAlert(
      "Çıkış Yap", 
      "Çıkış yapmak istediğinizden emin misiniz?", 
      'warning'
    );
    
    // Çıkış onayı için özel butonlar
    setAlertConfig({
      title: "Çıkış Yap",
      message: "Çıkış yapmak istediğinizden emin misiniz?",
      type: 'warning',
    });
    setAlertVisible(true);
    
    const confirmLogout = async () => {
      await logout();
    };
  };

  const menuItems = [
    {
      id: "1",
      title: "Hesap Bilgileri",
      subtitle: "Kişisel bilgilerinizi düzenleyin",
      icon: "👤",
      onPress: () => setEditModalVisible(true),
    },
    {
      id: "2",
      title: "Kitaplarım",
      subtitle: "Eklediğiniz kitapları görüntüleyin",
      icon: "📚",
      onPress: () => navigation.navigate("MainDrawer", { screen: "Kitaplarım" }),
    },
    {
      id: "3",
      title: "Favori Kelimeler",
      subtitle: "Kaydettiğiniz kelimeleri görün",
      icon: "❤️",
      onPress: () => navigation.navigate("MainDrawer", { screen: "Favori Kelimeler" }),
    },
    {
      id: "4",
      title: "Sözlük",
      subtitle: "Kelime çeviri aracı",
      icon: "📖",
      onPress: () => navigation.navigate("MainDrawer", { screen: "Sözlük" }),
    },
    {
      id: "5",
      title: "Öğrenme İstatistikleri",
      subtitle: "İlerlemenizi görüntüleyin",
      icon: "📊",
      onPress: () => showAlert("Bilgi", "Bu özellik yakında eklenecek", 'info'),
    },
    {
      id: "6",
      title: "Ayarlar",
      subtitle: "Uygulama ayarlarını düzenleyin",
      icon: "⚙️",
      onPress: () => showAlert("Bilgi", "Bu özellik yakında eklenecek", 'info'),
    },
    {
      id: "7",
      title: "Yardım",
      subtitle: "Destek ve SSS",
      icon: "❓",
      onPress: () => showAlert("Bilgi", "Bu özellik yakında eklenecek", 'info'),
    },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
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
          <ActivityIndicator size="large" color="#007AFF" />
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
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userLevel}>
              <Text>Seviye: </Text>
              <Text>{user.role === "ADMIN" ? "Yönetici" : "Kullanıcı"}</Text>
            </Text>
          </View>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userWords.length}</Text>
            <Text style={styles.statLabel}>Kaydedilen Kelime</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Günlük Seri</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Doğruluk Oranı</Text>
          </View>
        </View>

        {/* Kayıtlı Kelimeler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kayıtlı Kelimeler</Text>
          {userWords.length === 0 ? (
            <Text style={{ color: "#666" }}>Henüz kelime eklenmemiş.</Text>
          ) : (
            userWords.slice(0, 10).map((word) => (
              <Text
                key={word.id}
                style={{ color: "#333", fontSize: 15, marginBottom: 4 }}
              >
                <Text>{word.originalText}</Text>
                <Text> - </Text>
                <Text>{word.translatedText}</Text>
              </Text>
            ))
          )}
        </View>

        {/* Menü Öğeleri */}
        <View style={styles.menuSection}>{menuItems.map(renderMenuItem)}</View>

        {/* Ayarlar */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingTitle}>Bildirimler</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#007AFF" }}
              thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={styles.settingTitle}>Karanlık Mod</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#767577", true: "#007AFF" }}
              thumbColor={darkModeEnabled ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Çıkış Butonu */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Alert Component */}
      <Alert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleCloseAlert}
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
              <Text style={styles.modalTitle}>Profil Düzenle</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.name}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, name: text })
                  }
                  placeholder="Adınızı ve soyadınızı girin"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>E-posta</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.email}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, email: text })
                  }
                  placeholder="E-posta adresinizi girin"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Yeni Şifre (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.password}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, password: text })
                  }
                  placeholder="Yeni şifrenizi girin"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleEditProfile}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalButtonPrimaryText}>Kaydet</Text>
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
    color: "#007AFF",
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
    padding: 20,
  },
  userSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B3F2F",
    marginBottom: 6,
    fontFamily: "Roboto_500Medium",
  },
  userEmail: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
    fontFamily: "Roboto_400Regular",
  },
  userLevel: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  statsSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
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
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    backgroundColor: "#FF3B30",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: "white",
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
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
    color: "#4B3F2F",
    fontFamily: "Roboto_500Medium",
  },
  modalClose: {
    fontSize: 26,
    color: "#666",
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
    color: "#4B3F2F",
    marginBottom: 8,
    fontFamily: "Roboto_500Medium",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "white",
    fontFamily: "Roboto_400Regular",
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
    borderColor: "#e0e0e0",
  },
  modalButtonPrimary: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonText: {
    color: "#4B3F2F",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  modalButtonPrimaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  section: {
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
});

export default ProfileScreen;
