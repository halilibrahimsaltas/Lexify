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
  Dimensions,
} from "react-native";
import translationService from "../services/translation.service";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLanguage } from "../contexts/LanguageContext";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

interface WordSelectorProps {
  visible: boolean;
  selectedWord: string;
  onClose: () => void;
  onWordSave?: (word: string, translation: string) => void;
  anchorPosition?: { x: number; y: number; width: number; height: number };
}

const WordSelector: React.FC<WordSelectorProps> = ({
  visible,
  selectedWord,
  onClose,
  onWordSave,
  anchorPosition,
}) => {
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

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
      Alert.alert(t("error"), t("translation_error"));
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
        Alert.alert(t("success"), t("word_saved"));
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

  // Konum hesaplama
  const containerStyle = {
    position: "absolute" as const,
    top: 10,
    left: SCREEN_WIDTH / 2 - 110,
    zIndex: 9999,
    width: 300,
    maxHeight: SCREEN_HEIGHT - 16,
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[containerStyle]} pointerEvents="box-none">
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
                    <Text
                      style={
                        currentIndex === 0
                          ? styles.arrowTextDisabled
                          : styles.arrowText
                      }
                    >
                      {"‹"}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.translationBox}>
                    <Text style={styles.translationText}>
                      {current ? (
                        <Text>{current.translation}</Text>
                      ) : (
                        <Text>{t("translation_not_found")}</Text>
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
                    <Text
                      style={
                        currentIndex === alternatives.length - 1
                          ? styles.arrowTextDisabled
                          : styles.arrowText
                      }
                    >
                      {"›"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Kaydet Butonu */}
                {current &&
                  current.translation &&
                  current.translation !== t("translation_not_found") && (
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveWord}
                    >
                      <Text style={styles.saveButtonText}>{t("save")}</Text>
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#32341f",
    borderRadius: 10,
    padding: 6, // azaltıldı
    width: 220, // biraz daha daraltıldı
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "90%",
  },
  selectedWord: {
    fontSize: 16, // biraz küçültüldü
    marginBottom: 6, // azaltıldı
    fontWeight: "bold",
    color: "rgba(245, 245, 245, 0.85)",
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
    letterSpacing: 0.5,
  },
  translationSection: {
    alignItems: "center",
    width: "100%",
    // marginTop kaldırıldı
  },
  altNavRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2, // azaltıldı
    width: "100%",
    justifyContent: "center",
    minHeight: 32, // Satır yüksekliğini sınırla
  },
  arrowButton: {
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    height: 28, // Sabit yükseklik
    width: 32, // Sabit genişlik
    overflow: "visible",
  },
  arrowText: {
    fontSize: 50, // Büyük ok
    lineHeight: 28, // Satır yüksekliğini sınırla
    color: "rgba(245, 245, 245, 0.85)",
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    opacity: 1,
  },
  arrowTextDisabled: {
    fontSize: 40, // biraz küçültüldü
    color: "rgba(245, 245, 245, 0.85)",
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    opacity: 0.3,
  },
  translationBox: {
    minWidth: 120, // azaltıldı
    maxWidth: 200, // azaltıldı
    padding: 6, // azaltıldı
    backgroundColor: "#32341f",
    borderRadius: 8, // azaltıldı
    alignItems: "center",
    marginHorizontal: 2, // azaltıldı
    justifyContent: "center",
  },
  translationText: {
    fontSize: 18, // biraz küçültüldü
    color: "#F7C873",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
    marginBottom: 1, // azaltıldı
  },
  categoryText: {
    fontSize: 10, // biraz küçültüldü
    color: "rgba(245, 245, 245, 0.85)",
    marginTop: 1, // azaltıldı
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Roboto_400Regular",
    opacity: 0.8,
  },
  saveButton: {
    backgroundColor: "#F7C873",
    paddingVertical: 6, // azaltıldı
    paddingHorizontal: 12, // azaltıldı
    borderRadius: 8, // azaltıldı
    marginTop: 6, // azaltıldı
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#32341f",
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Roboto_500Medium",
    textAlign: "center",
    letterSpacing: 0.1,
  },
});

export default WordSelector;
