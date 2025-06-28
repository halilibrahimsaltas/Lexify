import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dictionaryService from '../services/dictionary.service';

interface Word {
  id: string;
  word: string;
  translation: string;
  language: string;
  category?: string;
  type?: string;
}

const DictionaryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadDictionaryStats();
  }, []);

  const loadDictionaryStats = async () => {
    try {
      const statsData = await dictionaryService.getDictionaryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Sözlük istatistikleri yüklenemedi:', error);
    }
  };

  const searchWords = async (query: string) => {
    if (!query.trim()) {
      setWords([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await dictionaryService.searchWords({ query: query.trim(), limit: 50 });
      setWords(result.words);
    } catch (error) {
      Alert.alert('Hata', 'Kelime arama başarısız');
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchWords(text);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const renderWord = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.languageTag}>{item.language.toUpperCase()}</Text>
      </View>
      <Text style={styles.translationText}>{item.translation}</Text>
      {item.category && (
        <Text style={styles.categoryText}>{item.category} • {item.type}</Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Sözlük</Text>
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            📚 {stats.totalWords.toLocaleString()} kelime
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Text style={styles.emptyText}>
          {searchQuery ? 'Arama sonucu bulunamadı' : 'Kelime aramak için yazmaya başlayın'}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Kelime ara..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={words}
        renderItem={renderWord}
        keyExtractor={(item) => item.id}
        style={styles.wordList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={words.length === 0 ? styles.emptyListContainer : undefined}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statsContainer: {
    marginTop: 5,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
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
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default DictionaryScreen; 