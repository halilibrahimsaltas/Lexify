import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import Alert from "../components/Alert";
import { SafeAreaView } from "react-native-safe-area-context";
import bookService from "../services/book.service";
import { Book } from "../types";
import BookCard from "../components/BookCard";

const BooksScreen = ({ navigation }: any) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
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
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const userBooks = await bookService.getUserBooks();
      setBooks(userBooks);
    } catch (error: any) {
      showAlert(
        "Hata",
        error.message || "Kitaplar yüklenirken bir hata oluştu",
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const handleDeleteBook = async (bookId: number) => {
    showAlert(
      "Kitabı Sil", 
      "Bu kitabı silmek istediğinizden emin misiniz?", 
      'warning'
    );
    
    // Silme işlemi için özel butonlar
    setAlertConfig({
      title: "Kitabı Sil",
      message: "Bu kitabı silmek istediğinizden emin misiniz?",
      type: 'warning',
    });
    setAlertVisible(true);
    
    const confirmDelete = async () => {
      setDeleteLoading(bookId);
      try {
        await bookService.deleteBook(bookId);
        setBooks(books.filter((book) => book.id !== bookId));
        showAlert("Başarılı", "Kitap başarıyla silindi", 'success');
      } catch (error: any) {
        showAlert(
          "Hata",
          error.message || "Kitap silinirken bir hata oluştu",
          'error'
        );
      } finally {
        setDeleteLoading(null);
      }
    };
    
    // Silme onayı için özel butonlar
    setAlertConfig({
      title: "Kitabı Sil",
      message: "Bu kitabı silmek istediğinizden emin misiniz?",
      type: 'warning',
    });
    setAlertVisible(true);
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      // Varsayalım ki bookService'de bir arama fonksiyonu var:
      const results = await bookService.searchBooks(search.trim());
      setSearchResults(results);
    } catch (error: any) {
      showAlert("Hata", error.message || "Arama sırasında hata oluştu", 'error');
    }
  };

  const filteredBooks = searchResults !== null
    ? searchResults
    : search.trim()
      ? books.filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase())
        )
      : books;

  const renderBookItem = (book: Book) => {
    const userProgress =
      Array.isArray(book.progress) && book.progress.length > 0
        ? book.progress[0]
        : null;
    const totalPages = book.pages?.length || 1;
    const progress = userProgress
      ? (userProgress.currentPage || 0) / totalPages
      : 0;

    return (
      <BookCard
        key={book.id}
        book={book}
        onPress={() => navigation.navigate("BookReader", { bookId: book.id })}
        onDelete={() => handleDeleteBook(book.id)}
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Kitaplar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Kitap veya yazar ara..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddBook")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBooks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>Hiç kitap bulunamadı</Text>
            <Text style={styles.emptyDescription}>
              Yeni kitap eklemek için sağdaki + butonunu kullanabilirsin
            </Text>
          </View>
        ) : (
          <View style={styles.booksList}>{filteredBooks.map(renderBookItem)}</View>
        )}
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF8E1",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7C873",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F7C873",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: "#4B3F2F",
    fontSize: 28,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 0,
  },
  booksList: {
    gap: 0,
    margin: 0,
    padding: 0,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
});

export default BooksScreen;
