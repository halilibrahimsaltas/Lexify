import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import translationService from '../services/translation.service';

interface WordSelectorProps {
  visible: boolean;
  selectedWord: string;
  onClose: () => void;
  onWordSave?: (word: string, translation: string) => void;
}

const WordSelector: React.FC<WordSelectorProps> = ({
  visible,
  selectedWord,
  onClose,
  onWordSave,
}) => {
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (visible && selectedWord) {
      fetchTranslation();
    }
    // Reset index when word changes
    setCurrentIndex(0);
  }, [visible, selectedWord]);

  const fetchTranslation = async () => {
    setIsLoading(true);
    try {
      const result = await translationService.translate({ text: selectedWord });
      let allAlternatives: { word: string; translation: string; category: string; type: string }[] = [];
      if (result.translatedText) {
        allAlternatives = [
          { word: selectedWord, translation: result.translatedText, category: '', type: '' },
          ...(result.alternatives || [])
        ];
      }
      setAlternatives(allAlternatives);
    } catch (error) {
      Alert.alert('Hata', 'Çeviri yapılırken bir hata oluştu');
      setAlternatives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWord = () => {
    if (alternatives.length > 0) {
      onWordSave?.(selectedWord, alternatives[currentIndex].translation);
      Alert.alert('Başarılı', 'Kelime kaydedildi');
      onClose();
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < alternatives.length - 1 ? prev + 1 : prev));
  };

  const current = alternatives[currentIndex];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Çeviri</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Seçilen Kelime */}
          <Text style={styles.selectedWord}>{selectedWord}</Text>

          {/* Çeviri ve Alternatifler */}
          {isLoading ? (
            <ActivityIndicator style={{ marginVertical: 20 }} color="#007AFF" />
          ) : (
            <View style={styles.translationSection}>
              <View style={styles.altNavRow}>
                <TouchableOpacity
                  style={[styles.arrowButton, currentIndex === 0 && styles.disabledButton]}
                  onPress={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <Text style={styles.arrowText}>{'<'}</Text>
                </TouchableOpacity>
                <View style={styles.translationBox}>
                  <Text style={styles.translationText}>
                    {current ? current.translation : 'Çeviri bulunamadı'}
                  </Text>
                  {current && (current.category || current.type) ? (
                    <Text style={styles.categoryText}>{current.category} {current.type && `• ${current.type}`}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={[styles.arrowButton, currentIndex === alternatives.length - 1 && styles.disabledButton]}
                  onPress={handleNext}
                  disabled={currentIndex === alternatives.length - 1}
                >
                  <Text style={styles.arrowText}>{'>'}</Text>
                </TouchableOpacity>
              </View>
              {/* Kaydet Butonu */}
              {current && current.translation && current.translation !== 'Çeviri bulunamadı' && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveWord}>
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: 260,
    alignItems: 'center',
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedWord: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 10,
    textAlign: 'center',
  },
  translationSection: {
    alignItems: 'center',
    width: '100%',
  },
  altNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'center',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  arrowText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  translationBox: {
    minWidth: 120,
    maxWidth: 150,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  translationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WordSelector; 