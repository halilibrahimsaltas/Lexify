import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TranslationScreen = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('tr');

  const languages = [
    { code: 'en', name: 'İngilizce' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'de', name: 'Almanca' },
    { code: 'fr', name: 'Fransızca' },
    { code: 'es', name: 'İspanyolca' },
  ];

  const handleTranslate = () => {
    // Burada gerçek API çağrısı yapılacak
    if (inputText.trim()) {
      setTranslatedText(`Çeviri: ${inputText} (${sourceLanguage} → ${targetLanguage})`);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText.replace('Çeviri: ', ''));
    setTranslatedText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Çeviri</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dil Seçimi */}
        <View style={styles.languageContainer}>
          <View style={styles.languageSelector}>
            <Text style={styles.languageLabel}>Kaynak Dil:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    sourceLanguage === lang.code && styles.selectedLanguage,
                  ]}
                  onPress={() => setSourceLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      sourceLanguage === lang.code && styles.selectedLanguageText,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Text style={styles.swapButtonText}>⇄</Text>
          </TouchableOpacity>

          <View style={styles.languageSelector}>
            <Text style={styles.languageLabel}>Hedef Dil:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    targetLanguage === lang.code && styles.selectedLanguage,
                  ]}
                  onPress={() => setTargetLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      targetLanguage === lang.code && styles.selectedLanguageText,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Çeviri Alanları */}
        <View style={styles.translationContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Metin Girin:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Çevirmek istediğiniz metni yazın..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
            <Text style={styles.translateButtonText}>Çevir</Text>
          </TouchableOpacity>

          <View style={styles.outputContainer}>
            <Text style={styles.outputLabel}>Çeviri:</Text>
            <View style={styles.outputTextContainer}>
              <Text style={styles.outputText}>
                {translatedText || 'Çeviri burada görünecek...'}
              </Text>
            </View>
          </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  languageContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  languageSelector: {
    marginBottom: 15,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageButtonText: {
    color: '#666',
    fontSize: 14,
  },
  selectedLanguageText: {
    color: 'white',
  },
  swapButton: {
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  swapButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default TranslationScreen; 