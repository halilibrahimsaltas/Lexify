import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import wordService, { Word } from '../services/word.service';
import Alert from '../components/Alert';



const SavedWordsScreen = ({ navigation }: any) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
  });
  const languageNames: Record<string, string> = { en: 'İngilizce', tr: 'Türkçe', de: 'Almanca', fr: 'Fransızca', es: 'İspanyolca' };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

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
      showAlert('Hata', 'Kaydedilmiş kelimeler alınamadı', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Word }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordText}>{item.originalText}</Text>
      <Text style={styles.translationText}>{item.translatedText}</Text>
      <Text style={styles.metaText}>
        <Text>{languageNames[item.sourceLanguage] || item.sourceLanguage}</Text>
        <Text> → </Text>
        <Text>{languageNames[item.targetLanguage] || item.targetLanguage}</Text>
      </Text>
      <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleString('tr-TR')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
     

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Kelimeler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={words.length === 0 ? styles.emptyContainer : undefined}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>❤️</Text>
              <Text style={styles.emptyTitle}>Henüz kelime kaydetmediniz</Text>
              <Text style={styles.emptyText}>
                Kitap okurken kelimeleri favorilere ekleyerek burada görüntüleyebilirsiniz.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Custom Alert Component */}
      <Alert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={handleCloseAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#F7C873',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B3F2F',
    marginBottom: 6,
    fontFamily: 'Merriweather',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontFamily: 'Merriweather',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Merriweather',
  },
  wordItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  wordText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#4B3F2F',
    fontFamily: 'Merriweather',
  },
  translationText: {
    fontSize: 17,
    color: '#007AFF',
    marginTop: 6,
    fontFamily: 'Merriweather',
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    fontFamily: 'Merriweather',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
    fontFamily: 'Merriweather',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B3F2F',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Merriweather',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Merriweather',
  },
});

export default SavedWordsScreen;