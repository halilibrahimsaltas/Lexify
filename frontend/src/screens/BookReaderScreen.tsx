import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  PanResponder,
  Dimensions,
  findNodeHandle,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "../components/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import WordSelector from "../components/WordSelector";
import { Book } from "../types";
import bookService from "../services/book.service";
import wordService from "../services/word.service";
import { useLanguage } from "../contexts/LanguageContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

const BookReaderScreen = ({ route }: any) => {
  const { bookId } = route.params;

  const [book, setBook] = useState<Book | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState("");
  const [wordSelectorVisible, setWordSelectorVisible] = useState(false);
  const [selectedWordPosition, setSelectedWordPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const wordRefs = useRef<{ [key: string]: any }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showPagination, setShowPagination] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const [chapters, setChapters] = useState<string[]>([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    const fetchProgressAndLoad = async () => {
      try {
        const progress = await bookService.getBookProgress(bookId);
        if (isMounted && progress && progress > 0) {
          setCurrentPage(progress);
        }
      } catch (e) {
        // Progress yoksa sorun değil, 1. sayfadan başla
      } finally {
        loadBookMetadata();
        fetchChapters();
      }
    };
    fetchProgressAndLoad();
    return () => {
      isMounted = false;
    };
  }, [bookId]);

  // Kitap bölümlerini çek
  const fetchChapters = async () => {
    try {
      const data = await bookService.getBookChapters(bookId);
      setChapters(data.chapters);
      setCurrentChapter(0);
    } catch (e) {
      // Bölüm yoksa sorun değil
    }
  };

  // Sayfa değiştiğinde içeriği yükle
  useEffect(() => {
    loadBookPage();
  }, [currentPage]);

  // Ekran kapatılırken progress'i kaydet
  useEffect(() => {
    return () => {
      bookService.saveBookProgress(bookId, currentPage).catch(() => {});
    };
  }, [bookId, currentPage]);

  const loadBookMetadata = async () => {
    try {
      const bookData = await bookService.getBook(bookId);
      setBook(bookData);
    } catch (error: any) {
      setToastMessage(error.message || t("book_info_load_error"));
      setToastType("error");
      setToastVisible(true);
    }
  };

  const loadBookPage = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBookContent(bookId, currentPage);
      setContent(data.content);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      setToastMessage(error.message || t("page_load_error"));
      setToastType("error");
      setToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWordSelect = (word: string, key: string) => {
    const cleanWord = word.replace(/[^\w\s]/g, "").trim();
    if (cleanWord.length > 0) {
      setSelectedWord(cleanWord);
      setWordSelectorVisible(true);
      // Pozisyon ölçümü
      setTimeout(() => {
        const ref = wordRefs.current[key];
        if (ref) {
          ref.measureInWindow(
            (x: number, y: number, width: number, height: number) => {
              setSelectedWordPosition({ x, y, width, height });
            }
          );
        }
      }, 10);
    }
  };

  const handleWordSave = async (word: string, translation: string) => {
    try {
      await wordService.addUserWord({
        originalText: word,
        translatedText: translation,
        sourceLanguage: "en",
        targetLanguage: "tr",
      });
      setToastMessage(t("word_added_favorites"));
      setToastType("success");
      setToastVisible(true);
    } catch (error) {
      setToastMessage(t("word_add_failed"));
      setToastType("error");
      setToastVisible(true);
    }
  };

  // Pagination'ı otomatik gizle/göster
  const resetPaginationTimer = useCallback(() => {
    setShowPagination(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowPagination(false), 4000);
  }, []);

  useEffect(() => {
    resetPaginationTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [currentPage, resetPaginationTimer]);

  // Ekrana dokununca pagination tekrar göster
  const handleScreenTouch = () => {
    resetPaginationTimer();
  };

  // Paragrafları ve kelimeleri iki yana yaslı ve kelime tıklanabilir şekilde göster
  const renderWords = (text: string) => {
    return text.split("\n\n").map((paragraph, pIndex) => (
      <Text key={pIndex} style={styles.bookContentText}>
        {paragraph
          .trim()
          .split(/\s+/)
          .map((word, wIndex) => {
            const key = `${pIndex}-${wIndex}`;
            const isSelected =
              wordSelectorVisible &&
              selectedWord &&
              selectedWord === word.replace(/[^\w\s]/g, "").trim();
            return (
              <Text
                key={key}
                ref={(ref) => {
                  wordRefs.current[key] = ref;
                }}
                style={[styles.wordText, isSelected && styles.selectedWordText]}
                onPress={() => handleWordSelect(word, key)}
              >
                {word}
                <Text> </Text>
              </Text>
            );
          })}
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
            <ActivityIndicator size="large" color="#4E2B1B" />
            <Text style={styles.loadingText}>{t("loading")}</Text>
          </View>
        ) : (
          <>
            <View {...panResponder.panHandlers} style={styles.contentWrapper}>
              <View style={styles.pageContent}>
                {/* Eğer chapter varsa, chapter'ı göster, yoksa normal content göster */}
                {chapters.length > 0
                  ? chapters[currentChapter] &&
                    renderWords(chapters[currentChapter])
                  : renderWords(content)}
              </View>
            </View>

            {/* Chapter navigation bar */}
            {chapters.length > 0 && (
              <View style={styles.chapterControls}>
                <TouchableOpacity
                  onPress={() =>
                    setCurrentChapter((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentChapter === 0}
                >
                  <Text>◀</Text>
                </TouchableOpacity>
                <Text>
                  {t("chapter")} {currentChapter + 1} {t("of")}{" "}
                  {chapters.length}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setCurrentChapter((prev) =>
                      Math.min(prev + 1, chapters.length - 1)
                    )
                  }
                  disabled={currentChapter === chapters.length - 1}
                >
                  <Text>▶</Text>
                </TouchableOpacity>
              </View>
            )}

            {showPagination && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPage === 1 && styles.disabled,
                  ]}
                  onPress={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <MaterialCommunityIcons
                    name="chevron-double-left"
                    size={22}
                    color={currentPage === 1 ? "#bdbdbd" : "#32341f"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPage === 1 && styles.disabled,
                  ]}
                  onPress={() => goToPage("prev")}
                  disabled={currentPage === 1}
                >
                  <Ionicons
                    name="chevron-back"
                    size={22}
                    color={currentPage === 1 ? "#bdbdbd" : "#32341f"}
                  />
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
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={currentPage === totalPages ? "#bdbdbd" : "#32341f"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPage === totalPages && styles.disabled,
                  ]}
                  onPress={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <MaterialCommunityIcons
                    name="chevron-double-right"
                    size={22}
                    color={currentPage === totalPages ? "#bdbdbd" : "#32341f"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {wordSelectorVisible && (
          <WordSelector
            visible={true}
            selectedWord={selectedWord}
            onClose={() => setWordSelectorVisible(false)}
            onWordSave={handleWordSave}
          />
        )}

        <Toast
          visible={toastVisible}
          message={toastMessage}
          type={toastType}
          onHide={() => setToastVisible(false)}
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
    fontFamily: "Roboto_400Regular",
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
    fontFamily: "Roboto_400Regular",
  },
  wordText: {
    fontSize: 17,
    color: "#2c3e50",
    lineHeight: 26,
    fontFamily: "Roboto_400Regular",
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
    borderColor: "#32341f",
  },
  disabled: {
    backgroundColor: "#FFF8E1",
    borderColor: "#bdbdbd",
  },
  navButtonText: {
    color: "#4E2B1B",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
  },
  navButtonTextDisabled: {
    color: "#bdbdbd",
  },
  pageText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "Roboto_400Regular",
    minWidth: 60,
    textAlign: "center",
  },
  chapterControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  selectedWordText: {
    backgroundColor: "#F7C873",
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#F7C873",
    color: "#4E2B1B",
    fontWeight: "bold",
  },
});

export default BookReaderScreen;
