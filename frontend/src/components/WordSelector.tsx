import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { BlurView } from 'expo-blur';
import translationService from "../services/translation.service";
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      let allAlternatives: {
        word: string;
        translation: string;
        category: string;
        type: string;
      }[] = [];
      if (result.translatedText) {
        allAlternatives = [
          {
            word: selectedWord,
            translation: result.translatedText,
            category: "",
            type: "",
          },
          ...(result.alternatives || []),
        ];
      }
      setAlternatives(allAlternatives);
    } catch (error) {
      Alert.alert("Hata", "Çeviri yapılırken bir hata oluştu");
      setAlternatives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWord = async () => {
    if (alternatives.length > 0) {
      if (onWordSave) {
        await onWordSave(selectedWord, alternatives[currentIndex].translation);
        onClose();
      } else {
        // Sadece fallback için Alert, normalde Toast üst parent'ta gösterilecek
        Alert.alert("Başarılı", "Kelime kaydedildi");
        onClose();
      }
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < alternatives.length - 1 ? prev + 1 : prev
    );
  };

  const current = alternatives[currentIndex];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <BlurView intensity={20} tint="dark" style={styles.blurCard}>
          <View style={styles.modalContent} pointerEvents="box-none">
            {/* Seçilen Kelime */}
            <Text style={styles.selectedWord}>{selectedWord}</Text>

            {/* Çeviri ve Alternatifler */}
            {isLoading ? (
              <ActivityIndicator style={{ marginVertical: 20 }} color="#fff" />
            ) : (
              <View style={styles.translationSection}>
                <View style={styles.altNavRow}>
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    <Text style={currentIndex === 0 ? styles.arrowTextDisabled : styles.arrowText}>{"‹"}</Text>
                  </TouchableOpacity>
                  <View style={styles.translationBox}>
                    <Text style={styles.translationText}>
                      {current ? (
                        <Text>{current.translation}</Text>
                      ) : (
                        <Text>Çeviri bulunamadı</Text>
                      )}
                    </Text>
                    {current && (current.category || current.type) ? (
                      <Text style={styles.categoryText}>
                        <Text>{current.category}</Text>
                        {current.type ? (
                          <>
                            <Text> • </Text>
                            <Text>{current.type}</Text>
                          </>
                        ) : null}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={handleNext}
                    disabled={currentIndex === alternatives.length - 1}
                  >
                    <Text style={currentIndex === alternatives.length - 1 ? styles.arrowTextDisabled : styles.arrowText}>{"›"}</Text>
                  </TouchableOpacity>
                </View>
                {/* Kaydet Butonu */}
                {current &&
                  current.translation &&
                  current.translation !== "Çeviri bulunamadı" && (
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveWord}
                    >
                      <Ionicons name="bookmark-outline" size={20} color="#4E2B1B" style={{ marginRight: 6, alignSelf: 'center' }} />
                      <Text style={styles.saveButtonText}>Kaydet</Text>
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  blurCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    maxWidth: '90%',
  },
  modalContent: {
    backgroundColor: "#FFF8E1",
    borderRadius: 20,
    padding: 20,
    width: 270,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 2,
    borderColor: '#4E2B1B',
    justifyContent: 'center',
    maxWidth: '90%',
  },
  selectedWord: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4E2B1B",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
    letterSpacing: 0.5,
  },
  translationSection: {
    alignItems: "center",
    width: "100%",
    marginTop: 6,
  },
  altNavRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  arrowButton: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: '#F7C873',
    marginHorizontal: 8,
    padding: 0,
    minWidth: 38,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  arrowText: {
    fontSize: 32,
    color: "#4E2B1B",
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    opacity: 1,
  },
  arrowTextDisabled: {
    fontSize: 32,
    color: "#4E2B1B",
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    opacity: 0.3,
  },
  translationBox: {
    minWidth: 160,
    maxWidth: 200,
    padding: 16,
    backgroundColor: "#FFF8E1",
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#F7C873',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  translationText: {
    fontSize: 20,
    color: "#4E2B1B",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 13,
    color: "#4E2B1B",
    marginTop: 2,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Roboto_400Regular",
    opacity: 0.8,
  },
  saveButton: {
    backgroundColor: "#F7C873",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 22,
    alignItems: "center",
    marginTop: 16,
    minWidth: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4E2B1B',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  saveButtonText: {
    color: "#4E2B1B",
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default WordSelector;
