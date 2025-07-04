import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

interface PDFReaderProps {
  content: string;
  title: string;
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange?: (pageNumber: number) => void;
  onWordSelect?: (word: string) => void;
}

const { height: screenHeight } = Dimensions.get('window');

const PDFReader: React.FC<PDFReaderProps> = ({
  content,
  title,
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
  onWordSelect,
}) => {
  const [fontSize, setFontSize] = React.useState(16);
  const [lineHeight, setLineHeight] = React.useState(24);

  const handleWordPress = (word: string) => {
    onWordSelect?.(word);
  };

  const renderTextWithClickableWords = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      if (word.trim() === '' || /^[^\w\s]*$/.test(word)) {
        return <Text key={index} style={[styles.pageText, { fontSize, lineHeight }]}>{word}</Text>;
      }
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleWordPress(word)}
          style={styles.wordContainer}
        >
          <Text style={[styles.pageText, styles.clickableWord, { fontSize, lineHeight }]}
          >
            {word}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
    setLineHeight(prev => Math.min(prev + 3, 36));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
    setLineHeight(prev => Math.max(prev - 3, 18));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Sayfa yükleniyor...</Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>İçerik bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    
    

      {/* Sayfa İçeriği */}
      <ScrollView style={styles.pageContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.pageContent}>
          <View style={styles.textContainer}>
            {renderTextWithClickableWords(content)}
          </View>
        </View>
      </ScrollView>

      {/* Sayfa Navigasyonu */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.navButtonText}>← Önceki</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentPage} / {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.navButtonText}>Sonraki →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 15,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fontSizeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  pageContainer: {
    flex: 1,
    padding: 20,
  },
  pageContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    minHeight: screenHeight - 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pageText: {
    color: '#333',
    textAlign: 'justify',
    lineHeight: 24,
  },
  clickableWord: {
    backgroundColor: 'transparent',
  },
  wordContainer: {
    backgroundColor: 'transparent',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pageIndicator: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  pageIndicatorText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default PDFReader;