import React, { useState, useEffect } from "react";
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bookService from "../services/book.service";
import WordSelector from "../components/WordSelector";
import type { Book } from "../types";

const BookReaderScreen = ({ navigation, route }: any) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageContent, setPageContent] = useState("");
  const [selectedWord, setSelectedWord] = useState("");
  const [wordSelectorVisible, setWordSelectorVisible] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [bookId]);

  useEffect(() => {
    if (book && !loading) {
      fetchPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookData = await bookService.getBook(bookId);
      setBook(bookData);
      const response = await bookService.getBookContent(bookId, 1);
      setPageContent(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(1);
    } catch (err: any) {
      setError("Kitap veya ilk sayfa yüklenemedi.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchPage = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getBookContent(bookId, page);
      setPageContent(response.content);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError("Sayfa yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleWordPress = (word: string) => {
    const cleanWord = word.replace(/[^\w\s]/g, "").trim();
    if (cleanWord.length > 0) {
      setSelectedWord(cleanWord);
      setWordSelectorVisible(true);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleWordSave = async (word: string, translation: string) => {
    try {
      // Buraya backend'e kaydetme isteği yazılabilir
      console.log("✅ Favori kaydedildi:", { word, translation });
      Alert.alert("Başarılı", `"${word}" favorilere eklendi.`);
    } catch (error) {
      Alert.alert("Hata", "Kelime kaydedilemedi");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {book?.title}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.pageContainer}
          contentContainerStyle={styles.pageContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageContent}>
            {pageContent.split("\n\n").map((paragraph, pIndex) => (
              <Text key={pIndex} style={styles.bookContentText}>
                {paragraph
                  .trim()
                  .split(/\s+/)
                  .map((word, wIndex) => (
                    <Text
                      key={`${pIndex}-${wIndex}`}
                      style={styles.wordText}
                      onPress={() => handleWordPress(word)}
                    >
                      {word}
                      <Text> </Text>
                    </Text>
                  ))}
              </Text>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Sayfa Navigasyonu */}
      <View style={styles.pageControls}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.pageButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Sayfa {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.pageButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Word Selector */}
      <WordSelector
        visible={wordSelectorVisible}
        selectedWord={selectedWord}
        onClose={() => setWordSelectorVisible(false)}
        onWordSave={handleWordSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginRight: 12,
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    fontFamily: "Merriweather",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
    width: "100%",
    backgroundColor: "#FFF8E1",
  },
  pageContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
    paddingBottom: 0,
    width: "100%",
  },
  pageContent: {
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    maxWidth: "100%",
    alignSelf: "center",
    minHeight: 120,
    width: "100%",
  },
  bookContentText: {
    fontSize: 17,
    color: "#4B3F2F",
    lineHeight: 26,
    textAlign: "justify",
    fontFamily: "Merriweather",
  },
  wordText: {
    fontSize: 17,
    color: "#2c3e50",
    lineHeight: 26,
    fontFamily: "Merriweather",
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 3,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  pageControls: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  pageButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pageIndicator: {
    color: "#666",
    fontSize: 15,
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  errorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookReaderScreen;
