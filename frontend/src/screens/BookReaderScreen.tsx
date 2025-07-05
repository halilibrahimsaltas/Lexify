import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  PanResponder,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WordSelector from "../components/WordSelector";
import { Book } from "../types";
import bookService from "../services/book.service";

const SCREEN_WIDTH = Dimensions.get("window").width;

const BookReaderScreen = ({ route }: any) => {
  const { bookId } = route.params;

  const [book, setBook] = useState<Book | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState("");
  const [wordSelectorVisible, setWordSelectorVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showPagination, setShowPagination] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

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
    }
  };

  const loadBookPage = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBookContent(bookId, currentPage);
      setContent(data.content);
      setTotalPages(data.totalPages || 1);
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
  };

  // Pagination'ı otomatik gizle/göster
  const resetPaginationTimer = useCallback(() => {
    setShowPagination(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowPagination(false), 4000);
  }, []);

  useEffect(() => {
    resetPaginationTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [currentPage, resetPaginationTimer]);

  // Ekrana dokununca pagination tekrar göster
  const handleScreenTouch = () => {
    resetPaginationTimer();
  };

  // Paragrafları ve kelimeleri iki yana yaslı ve kelime tıklanabilir şekilde göster
  const renderWords = (text: string) => {
    return text.split("\n\n").map((paragraph, pIndex) => (
      <Text key={pIndex} style={styles.bookContentText}>
        {paragraph.trim().split(/\s+/).map((word, wIndex) => (
          <Text
            key={`${pIndex}-${wIndex}`}
            style={styles.wordText}
            onPress={() => handleWordSelect(word)}
          >
            {word}
            <Text> </Text>
          </Text>
        ))}
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

  // PanResponder ile swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          goToPage("prev");
        } else if (gestureState.dx < -50) {
          goToPage("next");
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} onTouchStart={handleScreenTouch}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : (
          <>
            <View
              {...panResponder.panHandlers}
              style={styles.contentWrapper}
            >
              <View style={styles.pageContent}>{renderWords(content)}</View>
            </View>

            {showPagination && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.navButton, currentPage === 1 && styles.disabled]}
                  onPress={() => goToPage("prev")}
                  disabled={currentPage === 1}
                >
                  <Text style={currentPage === 1 ? styles.navButtonTextDisabled : styles.navButtonText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.pageText}>
                  {currentPage} / {totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPage === totalPages && styles.disabled,
                  ]}
                  onPress={() => goToPage("next")}
                  disabled={currentPage === totalPages}
                >
                  <Text style={currentPage === totalPages ? styles.navButtonTextDisabled : styles.navButtonText}>›</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <WordSelector
          visible={wordSelectorVisible}
          selectedWord={selectedWord}
          onClose={() => setWordSelectorVisible(false)}
          onWordSave={handleWordSave}
        />
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#666",
    fontFamily: "Merriweather",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    margin: 0,
    borderRadius: 0,
    elevation: 2,
    minHeight: 0,
  },
  pageContent: {
    width: "100%",
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    padding: 15,
    alignSelf: "center",
    minHeight: 120,
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderColor: "transparent",
    gap: 8,
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    marginHorizontal: 2,
    minWidth: 36,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  disabled: {
    backgroundColor: "#FFF8E1",
    borderColor: "#bdbdbd",
  },
  navButtonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Merriweather",
  },
  navButtonTextDisabled: {
    color: "#bdbdbd",
  },
  pageText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Merriweather",
    minWidth: 60,
    textAlign: "center",
  },
});

export default BookReaderScreen;
