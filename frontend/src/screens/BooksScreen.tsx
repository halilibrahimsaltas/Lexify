import React, { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
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
import Toast from "../components/Toast";
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
    type: 'primary' as 'primary' | 'secondary',
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>("success");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const showAlert = (title: string, message: string, type: 'primary' | 'secondary' = 'primary') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadBooks();
    }, [])
  );

  const loadBooks = async () => {
    try {
      const userBooks = await bookService.getUserBooks();
      setBooks(userBooks);
    } catch (error: any) {
      showAlert(
        "Hata",
        error.message || "Kitaplar yüklenirken bir hata oluştu",
        'primary'
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

  const handleDeleteBook = (bookId: number) => {
    setConfirmDeleteId(bookId);
    setAlertConfig({
      title: "Kitabı Sil",
      message: "Bu kitabı silmek istediğinizden emin misiniz?",
      type: 'secondary',
    });
    setAlertVisible(true);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId == null) return;
    setDeleteLoading(confirmDeleteId);
    setAlertVisible(false);
    try {
      await bookService.deleteBook(confirmDeleteId);
      setBooks(books.filter((book) => book.id !== confirmDeleteId));
      setToastMessage("Kitap başarıyla silindi");
      setToastType('success');
      setToastVisible(true);
    } catch (error: any) {
      setToastMessage(error.message || "Kitap silinirken bir hata oluştu");
      setToastType('error');
      setToastVisible(true);
    } finally {
      setDeleteLoading(null);
      setConfirmDeleteId(null);
    }
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
      showAlert("Hata", error.message || "Arama sırasında hata oluştu", 'primary');
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
        type={alertConfig.type as 'primary' | 'secondary'}
        onClose={handleCloseAlert}
        buttons={[
          {
            text: 'İptal',
            onPress: () => setAlertVisible(false),
            variant: 'secondary',
            iconName: 'close',
            iconFamily: 'MaterialIcons',
          },
          {
            text: 'Sil',
            onPress: confirmDelete,
            variant: 'primary',
            iconName: 'delete',
            iconFamily: 'MaterialIcons',
          },
        ]}
      />
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
