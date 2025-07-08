import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import wordService, { Word } from "../services/word.service";
import Toast from "../components/Toast";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Alert from "../components/Alert";
import { useLanguage } from "../contexts/LanguageContext";

const SavedWordsScreen = ({ navigation }: any) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "primary" as "primary" | "secondary",
  });
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    word: string;
  } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const { t, language } = useLanguage();
  const languageNames: Record<string, string> = {
    en: t("english"),
    tr: t("turkish"),
    de: t("german"),
    fr: t("french"),
    es: t("spanish"),
  };

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

  const handleDeletePress = (id: number, word: string) => {
    setConfirmDelete({ id, word });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    setConfirmDelete(null);
    try {
      await wordService.deleteUserWord(confirmDelete.id);
      setWords((prev) => prev.filter((w) => w.id !== confirmDelete.id));
      setToastMessage(t("word_removed_favorites_saved"));
      setToastType("success");
      setToastVisible(true);
    } catch (error) {
      setToastMessage(t("word_delete_failed_saved"));
      setToastType("error");
      setToastVisible(true);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchWords();
    }, [])
  );

  const fetchWords = async () => {
    setLoading(true);
    try {
      const data = (await wordService.getUserWords()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setWords(data);
    } catch (error) {
      showAlert(t("error"), t("saved_words_fetch_error"), "primary");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeletePress(item.id, item.originalText)}
        disabled={deletingId === item.id}
      >
        {deletingId === item.id ? (
          <ActivityIndicator size={20} color="#FF3B30" />
        ) : (
          <MaterialIcons name="delete" size={24} color="#4E2B1B" />
        )}
      </TouchableOpacity>
      <Text style={styles.wordText}>{item.originalText}</Text>
      <Text style={styles.translationText}>{item.translatedText}</Text>
      <Text style={styles.metaText}>
        <Text>{languageNames[item.sourceLanguage] || item.sourceLanguage}</Text>
        <Text> → </Text>
        <Text>{languageNames[item.targetLanguage] || item.targetLanguage}</Text>
      </Text>
      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleString("tr-TR")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E2B1B" />
          <Text style={styles.loadingText}>{t("words_loading")}</Text>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            words.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>{t("no_saved_words_saved")}</Text>
              <Text style={styles.emptyText}>{t("add_words_info_saved")}</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      {/* Delete confirm Alert */}
      <Alert
        visible={!!confirmDelete}
        title={t("remove_from_favorites_saved")}
        message={`${
          confirmDelete?.word ? '"' + confirmDelete.word + '" ' : ""
        }${t("are_you_sure_remove_saved")}`}
        type="secondary"
        onClose={() => setConfirmDelete(null)}
        buttons={[
          {
            text: t("cancel"),
            onPress: () => setConfirmDelete(null),
            variant: "secondary",
            iconName: "close",
            iconFamily: "MaterialIcons",
          },
          {
            text: t("delete"),
            onPress: handleConfirmDelete,
            variant: "primary",
            iconName: "delete",
            iconFamily: "MaterialIcons",
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  header: {
    padding: 24,
    backgroundColor: "#FFF8E1",
    borderBottomWidth: 1,
    borderBottomColor: "#F7C873",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4B3F2F",
    marginBottom: 6,
    fontFamily: "Roboto_500Medium",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Roboto_400Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontFamily: "Roboto_400Regular",
  },
  wordItem: {
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 0,
    marginHorizontal: 0,
    borderWidth: 0,
    shadowColor: "transparent",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    position: "relative",
  },
  deleteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 4,
  },
  wordText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4E2B1B",
    fontFamily: "Roboto_500Medium",
  },
  translationText: {
    fontSize: 15,
    color: "#F7C873",
    marginTop: 6,
    fontFamily: "Roboto_400Regular",
  },
  metaText: {
    fontSize: 12,
    color: "#4E2B1B",
    marginTop: 6,
    fontFamily: "Roboto_400Regular",
  },
  dateText: {
    fontSize: 11,
    color: "#4E2B1B",
    marginTop: 4,
    textAlign: "right",
    fontFamily: "Roboto_400Regular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B3F2F",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "Roboto_400Regular",
  },
});

export default SavedWordsScreen;
