import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';

interface PDFPage {
  id: number;
  content: string;
  pageNumber: number;
}

interface PDFReaderProps {
  content: string;
  title: string;
  onPageChange?: (pageNumber: number) => void;
  onWordSelect?: (word: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PDFReader: React.FC<PDFReaderProps> = ({
  content,
  title,
  onPageChange,
  onWordSelect,
}) => {
  const [pages, setPages] = useState<PDFPage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(24);

  // Sayfa başına yaklaşık karakter sayısı (ekran boyutuna göre)
  const charsPerPage = Math.floor((screenWidth - 40) / 10) * Math.floor((screenHeight - 200) / (lineHeight + 4));

  useEffect(() => {
    processContent();
  }, [content, fontSize, lineHeight]);

  const processContent = () => {
    setIsLoading(true);
    
    try {
      // İçeriği paragraflara böl
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      const processedPages: PDFPage[] = [];
      let currentPageContent = '';
      let pageNumber = 1;

      paragraphs.forEach((paragraph, index) => {
        const paragraphWithBreaks = paragraph.replace(/\n/g, ' ');
        
        if ((currentPageContent + paragraphWithBreaks).length > charsPerPage) {
          if (currentPageContent.trim()) {
            processedPages.push({
              id: pageNumber,
              content: currentPageContent.trim(),
              pageNumber,
            });
            pageNumber++;
            currentPageContent = paragraphWithBreaks + '\n\n';
          } else {
            // Çok uzun paragraf, kelime kelime böl
            const words = paragraphWithBreaks.split(' ');
            let tempContent = '';
            
            words.forEach(word => {
              if ((tempContent + word + ' ').length > charsPerPage) {
                if (tempContent.trim()) {
                  processedPages.push({
                    id: pageNumber,
                    content: tempContent.trim(),
                    pageNumber,
                  });
                  pageNumber++;
                  tempContent = word + ' ';
                } else {
                  tempContent = word + ' ';
                }
              } else {
                tempContent += word + ' ';
              }
            });
            
            currentPageContent = tempContent;
          }
        } else {
          currentPageContent += paragraphWithBreaks + '\n\n';
        }
      });

      // Son sayfayı ekle
      if (currentPageContent.trim()) {
        processedPages.push({
          id: pageNumber,
          content: currentPageContent.trim(),
          pageNumber,
        });
      }

      setPages(processedPages);
    } catch (error) {
      Alert.alert('Hata', 'İçerik işlenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages.length) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleWordPress = (word: string) => {
    onWordSelect?.(word);
  };

  const renderTextWithClickableWords = (text: string) => {
    // Metni kelimelere böl ve tıklanabilir hale getir
    const words = text.split(/(\s+)/);
    
    return words.map((word, index) => {
      // Boşlukları ve noktalama işaretlerini atla
      if (word.trim() === '' || /^[^\w\s]*$/.test(word)) {
        return <Text key={index} style={[styles.pageText, { fontSize, lineHeight }]}>{word}</Text>;
      }
      
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleWordPress(word)}
          style={styles.wordContainer}
        >
          <Text style={[styles.pageText, styles.clickableWord, { fontSize, lineHeight }]}>
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
        <Text style={styles.loadingText}>Sayfalar hazırlanıyor...</Text>
      </View>
    );
  }

  if (pages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>İçerik bulunamadı</Text>
      </View>
    );
  }

  const currentPageData = pages.find(p => p.pageNumber === currentPage);

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.pageInfo}>
          Sayfa {currentPage} / {pages.length}
        </Text>
      </View>

      {/* Font Boyutu Kontrolleri */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={decreaseFontSize}>
          <Text style={styles.controlButtonText}>A-</Text>
        </TouchableOpacity>
        <Text style={styles.fontSizeText}>{fontSize}px</Text>
        <TouchableOpacity style={styles.controlButton} onPress={increaseFontSize}>
          <Text style={styles.controlButtonText}>A+</Text>
        </TouchableOpacity>
      </View>

      {/* Sayfa İçeriği */}
      <ScrollView style={styles.pageContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.pageContent}>
          <View style={styles.textContainer}>
            {renderTextWithClickableWords(currentPageData?.content || '')}
          </View>
        </View>
      </ScrollView>

      {/* Sayfa Navigasyonu */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={styles.navButtonText}>← Önceki</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentPage} / {pages.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, currentPage === pages.length && styles.disabledButton]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pages.length}
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