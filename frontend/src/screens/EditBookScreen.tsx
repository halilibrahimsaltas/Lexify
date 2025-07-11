import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import bookService from "../services/book.service";
import Toast from "../components/Toast";
import { useLanguage } from "../contexts/LanguageContext";

const EditBookScreen = ({ route, navigation }: any) => {
  const { book } = route.params;
  const [title, setTitle] = useState(book.title);
  const [category, setCategory] = useState(book.category || "");
  const [coverImage, setCoverImage] = useState(book.coverImage || "");
  const [author, setAuthor] = useState(book.author || "");
  const [loading, setLoading] = useState(false);

  // Toast için state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );

  const { t } = useLanguage();

  const handleSave = async () => {
    setLoading(true);
    try {
      await bookService.updateBook(book.id, {
        title,
        category,
        coverImage,
        author, // Yazar bilgisini de gönder
      });
      setToastMessage(t("book_updated"));
      setToastType("success");
      setToastVisible(true);
      setTimeout(() => navigation.goBack(), 1200);
    } catch (e: any) {
      setToastMessage(e.message || t("update_failed"));
      setToastType("error");
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("book_name")}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={t("book_name_placeholder")}
      />
      <Text style={styles.label}>{t("author")}</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder={t("author")}
      />
      <Text style={styles.label}>{t("category")}</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder={t("category")}
      />
      <Text style={styles.label}>{t("cover_image_url")}</Text>
      <TextInput
        style={styles.input}
        value={coverImage}
        onChangeText={setCoverImage}
        placeholder={t("cover_image_url_placeholder")}
      />
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.coverImage} />
      ) : null}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? t("saving") : t("save")}
        </Text>
      </TouchableOpacity>
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    padding: 24,
    marginTop: 20,
  },
  label: {
    fontSize: 15,
    color: "#4E2B1B",
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F7C873",
    padding: 12,
    fontSize: 16,
    color: "#4E2B1B",
  },
  imagePicker: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F7C873",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    marginTop: 4,
    height: 120,
  },
  coverImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    resizeMode: "cover",
  },
  saveButton: {
    backgroundColor: "#F7C873",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#4E2B1B",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditBookScreen;
