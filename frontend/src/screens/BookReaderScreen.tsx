import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WordSelector from "../components/WordSelector";
import { Book } from "../types";
import bookService from "../services/book.service";
import { ScrollView } from "react-native"; // Import ScrollView for content scrolling

const BookReaderScreen = ({ navigation, route }: any) => {
  const { bookId } = route.params;

  const [book, setBook] = useState<Book | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState("");
  const [wordSelectorVisible, setWordSelectorVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1); // opsiyonel olarak güncellenebilir

  useEffect(() => {
    loadBookMetadata();
  }, [bookId]);

  useEffect(() => {
    loadBookPage();
  }, [currentPage]);

  const loadBookMetadata = async () => {
    try {
      const bookData = await bookService.getBook(bookId);
      setBook(bookData);
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Kitap bilgisi yüklenemedi");
      navigation.goBack();
    }
  };

  const loadBookPage = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBookContent(bookId, currentPage);
      setContent(data.content);
      setTotalPages(data.totalPages || 1); // Eğer backend gönderiyorsa
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Sayfa yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleWordSelect = (word: string) => {
    const cleanWord = word.replace(/[^\w\s]/g, "").trim();
    if (cleanWord.length > 0) {
      setSelectedWord(cleanWord);
      setWordSelectorVisible(true);
    }
  };

  const handleWordSave = (word: string, translation: string) => {
    console.log("✅ Favoriye eklendi:", { word, translation });
    // backend’e post edilecek kısım sonra eklenecek
  };

  const renderWords = (text: string) => {
    return text.split(/\s+/).map((word, index) => (
      <Text
        key={index}
        style={styles.wordText}
        onPress={() => handleWordSelect(word)}
      >
        {word + " "}
      </Text>
    ));
  };

  const goToPage = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {book?.title || "Kitap"}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              Alert.alert(
                "Kitap Bilgisi",
                `Başlık: ${book?.title}\nYazar: ${book?.author}`
              );
            }}
          >
            <Text style={styles.infoButtonText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* İçerik */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.bookContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.wordRow}>{renderWords(content)}</View>
        </ScrollView>
      )}

      {/* Sayfa Kontrolleri */}
      <View style={styles.pageControls}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.pageButtonDisabled,
          ]}
          onPress={() => goToPage("prev")}
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
          onPress={() => goToPage("next")}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Kelime Seçici */}
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
    backgroundColor: "#f8f9fa",
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
    fontFamily: "serif", // Georgia, Times, vb.
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  infoButtonText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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
  bookContentContainer: {
    flexGrow: 1,
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    margin: 16,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    maxWidth: 800,
    alignSelf: "center",
    minHeight: 200,
  },
  wordRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  wordText: {
    fontSize: 18,
    color: "#2c3e50",
    lineHeight: 32,
    fontFamily: "serif",
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 3,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },

  bookContentText: {
    fontSize: 18,
    color: "#4B3F2F", // koyu kahverengi
    lineHeight: 28,
    textAlign: "justify",
    fontFamily: "serif", // varsayılan serif fontu, istersen Google Fonts ile özel font entegre edilir
  },
  wordTextActive: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#2563eb",
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
});

export default BookReaderScreen;
