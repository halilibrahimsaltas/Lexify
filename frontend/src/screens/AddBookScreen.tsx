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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import bookService, { CreateBookRequest } from '../services/book.service';
import api from '../services/api';

const AddBookScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    content: '',
    author: '',
    coverImage: '',
    filePath: '',
    category: '',
  });

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      setSelectedFile(file);
      Alert.alert('Başarılı', 'PDF dosyası seçildi');
    } catch (error) {
      Alert.alert('Hata', 'Dosya seçilirken bir hata oluştu');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      Alert.alert('Hata', 'Lütfen bir PDF dosyası seçin');
      return;
    }

    if (!formData.title || !formData.author || !formData.category) {
      Alert.alert('Hata', 'Lütfen tüm gerekli alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', {
        uri: selectedFile.uri,
        type: 'application/pdf',
        name: selectedFile.name,
      } as any);
      
      // Kitap bilgilerini ekle
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('category', formData.category);
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }
      if (formData.filePath) {
        formDataToSend.append('filePath', formData.filePath);
      }

      const response = await api.post('/books/upload/pdf-with-details', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Başarılı', 'Kitap başarıyla eklendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('Books'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kitap eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      coverImage: '',
      filePath: '',
      category: '',
    });
    setSelectedFile(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Kitap Ekle</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* PDF Seçme Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PDF Dosyası Seç</Text>
          <Text style={styles.sectionDescription}>
            PDF dosyanızı seçin. İçerik otomatik olarak çıkarılacak ve kitap bilgileriyle birlikte kaydedilecek.
          </Text>

          <TouchableOpacity style={styles.filePickerButton} onPress={handleFilePick}>
            <Text style={styles.filePickerButtonText}>
              {selectedFile ? selectedFile.name : 'PDF Dosyası Seç'}
            </Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileInfoText}>Seçilen dosya: {selectedFile.name}</Text>
              <Text style={styles.fileInfoText}>
                Boyut: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          )}
        </View>

        {/* Kitap Bilgileri Formu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kitap Bilgileri</Text>
          <Text style={styles.sectionDescription}>
            Kitap bilgilerini girin. PDF içeriği otomatik olarak çıkarılacak.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kitap Başlığı *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Kitap başlığını girin"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Yazar *</Text>
            <TextInput
              style={styles.input}
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
              placeholder="Yazar adını girin"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kategori *</Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Örn: Dil Öğrenimi, Roman, Bilim"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kapak Resmi URL (Opsiyonel)</Text>
            <TextInput
              style={styles.input}
              value={formData.coverImage}
              onChangeText={(text) => setFormData({ ...formData, coverImage: text })}
              placeholder="https://example.com/cover.jpg"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Dosya Yolu (Opsiyonel)</Text>
            <TextInput
              style={styles.input}
              value={formData.filePath}
              onChangeText={(text) => setFormData({ ...formData, filePath: text })}
              placeholder="/uploads/books/kitap-adi.pdf"
            />
          </View>
        </View>

        {/* Kaydet Butonu */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.saveButton, (!selectedFile || !formData.title || !formData.author || !formData.category) && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            disabled={!selectedFile || !formData.title || !formData.author || !formData.category || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>PDF'yi İşle ve Kitabı Kaydet</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
          >
            <Text style={styles.resetButtonText}>Formu Temizle</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  filePickerButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  filePickerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  fileInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBookScreen; 