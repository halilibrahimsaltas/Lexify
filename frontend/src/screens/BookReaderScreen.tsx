import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PDFReader from '../components/PDFReader';
import WordSelector from '../components/WordSelector';
import bookService, { Book } from '../services/book.service';

const BookReaderScreen = ({ navigation, route }: any) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState('');
  const [wordSelectorVisible, setWordSelectorVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadBook();
  }, [bookId]);

  const loadBook = async () => {
    try {
      const bookData = await bookService.getBook(bookId);
      setBook(bookData);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kitap yüklenirken bir hata oluştu');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleWordSelect = (word: string) => {
    // Kelimeyi temizle (noktalama işaretlerini kaldır)
    const cleanWord = word.replace(/[^\w\s]/g, '').trim();
    if (cleanWord.length > 0) {
      setSelectedWord(cleanWord);
      setWordSelectorVisible(true);
    }
  };

  const handleWordSave = (word: string, translation: string) => {
    // Burada kelimeyi kaydetme işlemi yapılabilir
    console.log('Kelime kaydedildi:', { word, translation });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Kitap yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Kitap bulunamadı</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              Alert.alert(
                'Kitap Bilgileri',
                `Başlık: ${book.title}\nKarakter: ${book.content.length}\nKelime: ${book.content.split(' ').length}\nSatır: ${book.content.split('\n').length}`
              );
            }}
          >
            <Text style={styles.infoButtonText}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PDF Reader */}
      <PDFReader
        content={book.content}
        title={book.title}
        onPageChange={handlePageChange}
        onWordSelect={handleWordSelect}
      />

      {/* Word Selector Modal */}
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
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
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    fontFamily: 'serif', // Georgia, Times, vb.
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bookContentContainer: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    margin: 16,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    maxWidth: 800,
    alignSelf: 'center',
  },
  bookContentText: {
    fontSize: 18,
    color: '#4B3F2F', // koyu kahverengi
    lineHeight: 28,
    textAlign: 'justify',
    fontFamily: 'serif', // varsayılan serif fontu, istersen Google Fonts ile özel font entegre edilir
  },
  wordText: {
    fontSize: 18,
    color: '#2c3e50',
    lineHeight: 32,
    fontFamily: 'serif',
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 3,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  wordTextActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#2563eb',
  },
  pageControls: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  pageButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageIndicator: {
    color: '#666',
    fontSize: 15,
    marginHorizontal: 8,
  },
});

export default BookReaderScreen; 