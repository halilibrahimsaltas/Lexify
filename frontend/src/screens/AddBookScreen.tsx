import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import bookService from '../services/book.service';

const AddBookScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

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
    if (!selectedFile) {
      Alert.alert('Hata', 'Lütfen bir PDF dosyası seçin');
      return;
    }

    setLoading(true);
    try {
      console.log('📁 Seçilen dosya:', selectedFile);
      console.log('📁 Dosya URI:', selectedFile.uri);
      console.log('📁 Dosya adı:', selectedFile.name);
      console.log('📁 Dosya tipi:', selectedFile.mimeType);

      const result = await bookService.uploadPdf(selectedFile);
      console.log('✅ Upload başarılı:', result);

      Alert.alert('Başarılı', 'Kitap başarıyla yüklendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('Books'),
        },
      ]);
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      console.error('❌ Error response:', error?.response?.data);
      console.error('❌ Error status:', error?.response?.status);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>PDF Kitap Ekle</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PDF Dosyası Seç</Text>

          <TouchableOpacity style={styles.filePickerButton} onPress={handleFilePick}>
            <Text style={styles.filePickerButtonText}>
              {selectedFile ? selectedFile.name : 'PDF Dosyası Seç'}
            </Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileInfoText}>Seçilen: {selectedFile.name}</Text>
              <Text style={styles.fileInfoText}>
                Boyut: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.uploadButton, !selectedFile && styles.uploadButtonDisabled]}
            onPress={handleUploadPdf}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.uploadButtonText}>PDF'yi Yükle ve Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 15 },
  backButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', flex: 1 },
  content: { flex: 1, padding: 20 },
  section: { backgroundColor: 'white', borderRadius: 10, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  filePickerButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  filePickerButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  fileInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  fileInfoText: { fontSize: 14, color: '#666', marginBottom: 5 },
  uploadButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonDisabled: { backgroundColor: '#ccc' },
  uploadButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default AddBookScreen;
