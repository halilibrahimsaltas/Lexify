import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import bookService from '../services/book.service';

const AddBookScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedFile(file);
      Alert.alert('Başarılı', 'PDF dosyası seçildi');
    } catch (error) {
      Alert.alert('Hata', 'Dosya seçilirken bir hata oluştu');
    }
  };

  const handleUploadPdf = async () => {
    if (!selectedFile || !title || !author || !category) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun ve dosya seçin');
      return;
    }

    setLoading(true);
    try {
      const result = await bookService.uploadPdf({
        file: selectedFile,
        title,
        author,
        category,
        coverImage: coverImage || undefined,
      });

      Alert.alert('Başarılı', 'Kitap başarıyla yüklendi', [
        { text: 'Tamam', onPress: () => navigation.navigate('Books') },
      ]);
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      Alert.alert(
        'Hata',
        error?.response?.data?.message || error.message || 'Kitap yüklenirken hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Kitap Ekle</Text>

        <TextInput
          placeholder="Başlık"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Yazar"
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          placeholder="Kategori"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          placeholder="Kapak Görseli (opsiyonel)"
          style={styles.input}
          value={coverImage}
          onChangeText={setCoverImage}
        />

        <TouchableOpacity style={styles.fileButton} onPress={handleFilePick}>
          <Text style={styles.fileButtonText}>
            {selectedFile ? selectedFile.name : 'PDF Dosyası Seç'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, loading && styles.disabledButton]}
          onPress={handleUploadPdf}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.uploadButtonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  fileButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  fileButtonText: { color: 'white', fontWeight: '600' },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#ccc' },
  uploadButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default AddBookScreen;
