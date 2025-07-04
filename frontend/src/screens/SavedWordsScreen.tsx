import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import wordService, { Word } from '../services/word.service';



const SavedWordsScreen = ({ navigation }: any) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const languageNames: Record<string, string> = { en: 'İngilizce', tr: 'Türkçe', de: 'Almanca', fr: 'Fransızca', es: 'İspanyolca' };

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const data = (await wordService.getUserWords()).sort((a, b) =>
     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
      setWords(data);
    } catch (error) {
      Alert.alert('Hata', 'Kaydedilmiş kelimeler alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordText}>{item.originalText}</Text>
      <Text style={styles.translationText}>{item.translatedText}</Text>
      <Text style={styles.metaText}>
        {(languageNames[item.sourceLanguage] || item.sourceLanguage) + ' → ' + (languageNames[item.targetLanguage] || item.targetLanguage)}
      </Text>
      <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString('tr-TR')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Kaydedilmiş Kelimeler</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={words.length === 0 ? styles.emptyContainer : undefined}
          ListEmptyComponent={<Text style={styles.emptyText}>Hiç kelime kaydedilmemiş.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  translationText: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SavedWordsScreen;