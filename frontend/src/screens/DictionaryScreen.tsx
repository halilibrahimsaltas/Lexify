import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import dictionaryService from "../services/dictionary.service";
import wordService from "../services/word.service";
import { useLanguage } from "../contexts/LanguageContext";

interface Word {
  id: string;
  word: string;
  translation: string;
  language: string;
  category?: string;
  type?: string;
}

const DictionaryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "primary" as "primary" | "secondary",
  });
  const { t } = useLanguage();

  useEffect(() => {
    loadDictionaryStats();
  }, []);

  const loadDictionaryStats = async () => {
    try {
      const statsData = await dictionaryService.getDictionaryStats();
      setStats(statsData);
    } catch (error) {
      console.error(t("dictionary_stats_load_error"), error);
    }
  };

  const searchWords = async (query: string) => {
    if (!query.trim()) {
      setWords([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await dictionaryService.searchWords({
        query: query.trim(),
        limit: 50,
      });
      setWords(result.words);
    } catch (error) {
      Alert.alert(t("error"), t("word_search_failed"));
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchWords(text);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const showAlert = (
    title: string,
    message: string,
    type: "primary" | "secondary" = "primary"
  ) => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleAddFavorite = async (item: Word) => {
    setAddingId(item.id);
    try {
      await wordService.addUserWord({
        originalText: item.word,
        translatedText: item.translation,
        sourceLanguage: item.language,
        targetLanguage: "tr", // veya uygun hedef dil
      });
      showAlert(t("success"), t("word_added_favorites"), "primary");
    } catch (error) {
      showAlert(t("error"), t("word_add_failed"), "primary");
    } finally {
      setAddingId(null);
    }
  };

  const renderWord = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.languageTag}>{item.language.toUpperCase()}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddFavorite(item)}
          disabled={addingId === item.id}
        >
          {addingId === item.id ? (
            <ActivityIndicator size={16} color="#32341f" />
          ) : (
            <Ionicons name="add" size={20} color="#32341f" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.translationText}>{item.translation}</Text>
      {item.category && (
        <Text style={styles.categoryText}>
          {item.category} • {item.type}
        </Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            📚 {stats.totalWords.toLocaleString()} {t("word_count")}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4E2B1B" />
      ) : (
        <Text style={styles.emptyText}>
          {searchQuery ? t("no_search_result") : t("start_typing_to_search")}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder={t("search_word")}
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      <FlatList
        data={words}
        renderItem={renderWord}
        keyExtractor={(item) => item.id}
        style={styles.wordList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          words.length === 0 ? styles.emptyListContainer : undefined
        }
      />

      {/* Custom Alert Component */}
      {alertVisible && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 40,
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <View
            style={{ backgroundColor: "#32341f", padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "#FFF8E1", fontWeight: "bold" }}>
              {alertConfig.title}
            </Text>
            <Text style={{ color: "#FFF8E1" }}>{alertConfig.message}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  headerContainer: {
    padding: 24,
    backgroundColor: "#FFF8E1",
    borderBottomWidth: 1,
    borderBottomColor: "#F7C873",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4B3F2F",
    marginBottom: 8,
    fontFamily: "Roboto_500Medium",
  },
  statsContainer: {
    marginTop: 8,
  },
  statsText: {
    fontSize: 15,
    color: "#666",
    fontFamily: "Roboto_400Regular",
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "#FFF8E1",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#F7C873",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: "#666",
  },
  searchInput: {
    width: "100%",
    fontSize: 18,
    color: "#333",
    fontFamily: "Roboto_400Regular",
    backgroundColor: "#FCFCFC",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    margin: 0,
    marginTop: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  wordList: {
    flex: 1,
    padding: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
  wordItem: {
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    elevation: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    borderWidth: 0,
    shadowColor: "transparent",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
  },
  wordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  wordText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4E2B1B",
    flex: 1,
    marginRight: 8,
    textAlign: "left",
  },
  languageTag: {
    backgroundColor: "#32341f",
    color: "#FFF8E1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Roboto_500Medium",
  },
  translationText: {
    color: "#4E2B1B",
    fontSize: 14,
    marginTop: 2,
    textAlign: "left",
    fontFamily: "Roboto_400Regular",
  },
  categoryText: {
    fontSize: 12,
    color: "#4E2B1B",
    marginTop: 2,
    textAlign: "left",
    fontFamily: "Roboto_400Regular",
  },
  addButton: {
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#32341f",
    borderRadius: 8,
    padding: 2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
});

export default DictionaryScreen;
