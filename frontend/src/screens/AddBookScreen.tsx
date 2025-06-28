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
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import bookService, { CreateBookRequest } from '../services/book.service';

const AddBookScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
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

  const handleUploadPdf = async () => {
    if (!selectedFile) {
      Alert.alert('Hata', 'Lütfen bir PDF dosyası seçin');
      return;
    }

    setUploadLoading(true);
    try {
      const book = await bookService.uploadPdf(selectedFile);
      Alert.alert('Başarılı', 'Kitap başarıyla yüklendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('Books'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kitap yüklenirken bir hata oluştu');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!formData.title || !formData.content || !formData.author || !formData.category) {
      Alert.alert('Hata', 'Lütfen tüm gerekli alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await bookService.createBook(formData);
      setManualModalVisible(false);
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
        {/* PDF Yükleme Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PDF Dosyası Yükle</Text>
          <Text style={styles.sectionDescription}>
            PDF dosyanızı yükleyerek otomatik olarak kitap oluşturun
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

          <TouchableOpacity
            style={[styles.uploadButton, !selectedFile && styles.uploadButtonDisabled]}
            onPress={handleUploadPdf}
            disabled={!selectedFile || uploadLoading}
          >
            {uploadLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.uploadButtonText}>PDF'yi Yükle</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Ayırıcı */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>VEYA</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Manuel Ekleme Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manuel Kitap Ekle</Text>
          <Text style={styles.sectionDescription}>
            Kitap bilgilerini manuel olarak girin
          </Text>

          <TouchableOpacity
            style={styles.manualButton}
            onPress={() => setManualModalVisible(true)}
          >
            <Text style={styles.manualButtonText}>Manuel Ekle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Manuel Ekleme Modal */}
      <Modal
        visible={manualModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setManualModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kitap Bilgileri</Text>
              <TouchableOpacity onPress={() => setManualModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
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
                <Text style={styles.inputLabel}>Dosya Yolu *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.filePath}
                  onChangeText={(text) => setFormData({ ...formData, filePath: text })}
                  placeholder="/uploads/books/kitap-adi.pdf"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Kitap İçeriği *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.content}
                  onChangeText={(text) => setFormData({ ...formData, content: text })}
                  placeholder="Kitap içeriğini girin..."
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setManualModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleManualSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalButtonPrimaryText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  manualButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  manualButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 20,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modalButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddBookScreen; 