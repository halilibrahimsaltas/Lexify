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
import Toast from "../components/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import bookService from "../services/book.service";
import Button from "../components/Button";
import { useLanguage } from "../contexts/LanguageContext";

const AddBookScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const { t } = useLanguage();

  const showAlert = (
    title: string,
    message: string,
    type: "primary" | "secondary" = "primary"
  ) => {
    // This function is no longer used for alerts, but kept for now.
    // The new Toast component handles its own visibility.
  };

  const handleCloseAlert = () => {
    // This function is no longer used for alerts.
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
      setToastMessage(`${file.name} ${t("file_selected")}`);
      setToastType("success");
      setToastVisible(true);
    } catch (error) {
      setToastMessage(t("file_select_error"));
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleUploadPdf = async () => {
    if (!selectedFile || !title || !author || !category) {
      setToastMessage(t("fill_required_fields"));
      setToastType("info");
      setToastVisible(true);
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
      setToastMessage(t("book_upload_success"));
      setToastType("success");
      setToastVisible(true);
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
      setToastMessage(
        error?.response?.data?.message ||
          error.message ||
          t("book_upload_error")
      );
      setToastType("error");
      setToastVisible(true);
    } finally {
      setLoading(false);
      console.log("--- Kitap Yükleme Bitti ---");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t("add_book")}</Text>

        <TextInput
          placeholder={t("title")}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder={t("author")}
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          placeholder={t("category")}
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          placeholder={t("cover_image_optional")}
          style={styles.input}
          value={coverImage}
          onChangeText={setCoverImage}
        />

        <Button
          title={selectedFile ? selectedFile.name : t("choose_file")}
          onPress={handleFilePick}
          variant="outline"
          size="medium"
          disabled={loading}
          style={{ marginBottom: 16 }}
        />
        <Button
          title={loading ? t("loading") : t("save")}
          onPress={handleUploadPdf}
          variant="primary"
          size="large"
          disabled={loading}
        />
        <TouchableOpacity
          style={{ marginTop: 24, alignItems: "center" }}
          onPress={() => navigation.navigate("Help")}
        >
          <Text
            style={{
              color: "#4E2B1B",
              fontWeight: "bold",
              fontSize: 16,
              textDecorationLine: "none",
              textAlign: "center",
            }}
          >
            {t("go_to_help_for_add_book")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  scrollContent: { padding: 20 },
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
    backgroundColor: "#4E2B1B",
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
