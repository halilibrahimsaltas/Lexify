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

  const handleSaveWord = () => {
    if (alternatives.length > 0) {
      onWordSave?.(selectedWord, alternatives[currentIndex].translation);
      Alert.alert("Başarılı", "Kelime kaydedildi");
      onClose();
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
    borderRadius: 16,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "rgba(30,30,30,0.7)",
    borderRadius: 16,
    padding: 16,
    width: 240,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedWord: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 6,
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
  },
  translationSection: {
    alignItems: "center",
    width: "100%",
  },
  altNavRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
    justifyContent: "center",
  },
  arrowButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginHorizontal: 8,
    padding: 0,
    minWidth: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    opacity: 1,
  },
  arrowTextDisabled: {
    fontSize: 32,
    color: "#444",
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    opacity: 0.5,
  },
  translationBox: {
    minWidth: 160,
    maxWidth: 220,
    padding: 12,
    backgroundColor: "rgba(30,30,30,0.92)",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  translationText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
  },
  categoryText: {
    fontSize: 13,
    color: "#fff",
    marginTop: 2,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Roboto_400Regular",
  },
  saveButton: {
    backgroundColor: "#fff",
    paddingVertical: 7,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    minWidth: 80,
  },
  saveButtonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
  },
});

export default WordSelector;
