import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Word {
  id: string;
  word: string;
  translation: string;
  language: string;
}

const DictionaryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<Word[]>([
    { id: '1', word: 'hello', translation: 'merhaba', language: 'en' },
    { id: '2', word: 'world', translation: 'dünya', language: 'en' },
    { id: '3', word: 'book', translation: 'kitap', language: 'en' },
  ]);

  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderWord = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.languageTag}>{item.language.toUpperCase()}</Text>
      </View>
      <Text style={styles.translationText}>{item.translation}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sözlük</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Kelime ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredWords}
        renderItem={renderWord}
        keyExtractor={(item) => item.id}
        style={styles.wordList}
        showsVerticalScrollIndicator={false}
      />
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
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  wordList: {
    flex: 1,
    padding: 20,
  },
  wordItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  languageTag: {
    backgroundColor: '#007AFF',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  translationText: {
    fontSize: 16,
    color: '#666',
  },
});

export default DictionaryScreen; 