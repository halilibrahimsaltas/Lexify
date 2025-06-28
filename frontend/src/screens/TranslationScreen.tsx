import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import translationService from '../services/translation.service';

const TranslationScreen = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Hata', 'Lütfen çevirmek istediğiniz metni girin');
      return;
    }

    setIsLoading(true);
    try {
      const result = await translationService.translate({ text: inputText });
      
      if (result.translatedText) {
        setTranslatedText(result.translatedText);
        setAlternatives(result.alternatives || []);
      } else {
        setTranslatedText('Çeviri bulunamadı');
        setAlternatives([]);
      }
    } catch (error) {
      Alert.alert('Hata', 'Çeviri yapılırken bir hata oluştu');
      setTranslatedText('');
      setAlternatives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
    setAlternatives([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Çeviri</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Temizle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Çeviri Alanları */}
        <View style={styles.translationContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Metin Girin:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Çevirmek istediğiniz kelimeyi yazın..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={[styles.translateButton, isLoading && styles.disabledButton]} 
            onPress={handleTranslate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.translateButtonText}>Çevir</Text>
            )}
          </TouchableOpacity>

          <View style={styles.outputContainer}>
            <Text style={styles.outputLabel}>Çeviri:</Text>
            <View style={styles.outputTextContainer}>
              <Text style={styles.outputText}>
                {translatedText || 'Çeviri burada görünecek...'}
              </Text>
            </View>
          </View>

          {/* Alternatif Çeviriler */}
          {alternatives.length > 0 && (
            <View style={styles.alternativesContainer}>
              <Text style={styles.alternativesLabel}>Alternatif Çeviriler:</Text>
              {alternatives.slice(0, 5).map((alt, index) => (
                <View key={index} style={styles.alternativeItem}>
                  <Text style={styles.alternativeWord}>{alt.word}</Text>
                  <Text style={styles.alternativeTranslation}>{alt.translation}</Text>
                  <Text style={styles.alternativeCategory}>{alt.category} • {alt.type}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  translationContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
  },
  translateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  translateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outputContainer: {
    marginBottom: 15,
  },
  outputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  outputTextContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    minHeight: 100,
  },
  outputText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  alternativesContainer: {
    marginTop: 15,
  },
  alternativesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  alternativeItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alternativeWord: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  alternativeTranslation: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  alternativeCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default TranslationScreen; 