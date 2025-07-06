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
     
      
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Kelime ara..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery('');
                setWords([]);
              }}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
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
    backgroundColor: '#FFF8E1',
  },
  headerContainer: {
    padding: 24,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#F7C873',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B3F2F',
    marginBottom: 8,
    fontFamily: 'Merriweather',
  },
  statsContainer: {
    marginTop: 8,
  },
  statsText: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Merriweather',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#F7C873',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Merriweather',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
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
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Merriweather',
  },
  wordItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#4B3F2F',
    fontFamily: 'Merriweather',
  },
  languageTag: {
    backgroundColor: '#007AFF',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Merriweather',
  },
  translationText: {
    fontSize: 17,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'Merriweather',
  },
  categoryText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    fontFamily: 'Merriweather',
  },
});

export default DictionaryScreen; 