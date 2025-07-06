import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Alert from "../components/Alert";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import bookService from "../services/book.service";
import Button from '../components/Button';

const AddBookScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedFile(file);
      showAlert("Başarılı", `${file.name} dosyası seçildi`, 'success');
    } catch (error) {
      showAlert("Hata", "Dosya seçilirken bir hata oluştu", 'error');
    }
  };

  const handleUploadPdf = async () => {
    if (!selectedFile || !title || !author || !category) {
      showAlert(
        "Eksik Bilgi",
        "Lütfen tüm zorunlu alanları doldurun ve dosya seçin",
        'warning'
      );
      return;
    }

    setLoading(true);
    try {
      console.log("--- Kitap Yükleme Başladı ---");
      console.log("Seçilen dosya:", selectedFile);
      console.log("Başlık:", title);
      console.log("Yazar:", author);
      console.log("Kategori:", category);
      console.log("Kapak Görseli:", coverImage);
      const result = await bookService.uploadPdf({
        file: selectedFile,
        title,
        author,
        category,
        coverImage: coverImage || undefined,
      });
      console.log("Kitap yükleme sonucu:", result);
      showAlert("Başarılı", "Kitap başarıyla yüklendi", 'success');
      setTimeout(() => navigation.navigate("MainDrawer"), 1500);
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      if (error?.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
      } else if (error?.request) {
        console.log("Request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
      showAlert(
        "Hata",
        error?.response?.data?.message ||
          error.message ||
          "Kitap yüklenirken hata oluştu",
        'error'
      );
    } finally {
      setLoading(false);
      console.log("--- Kitap Yükleme Bitti ---");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Kitap Ekle</Text>

        <TextInput
          placeholder="Başlık"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Yazar"
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          placeholder="Kategori"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          placeholder="Kapak Görseli (opsiyonel)"
          style={styles.input}
          value={coverImage}
          onChangeText={setCoverImage}
        />

        <Button
          title={selectedFile ? selectedFile.name : 'Dosya Seç'}
          onPress={handleFilePick}
          variant="outline"
          size="medium"
          disabled={loading}
          style={{ marginBottom: 16 }}
        />
        <Button
          title={loading ? 'Yükleniyor...' : 'Kaydet'}
          onPress={handleUploadPdf}
          variant="primary"
          size="large"
          disabled={loading}
        />
      </ScrollView>

      {/* Custom Alert Component */}
      <Alert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
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
  scrollContent: { padding: 20, },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4B3F2F",
    flex: 1,
    fontFamily: "Roboto_500Medium",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  fileButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  fileButtonText: { color: "white", fontWeight: "600" },
  uploadButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#ccc" },
  uploadButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default AddBookScreen;
