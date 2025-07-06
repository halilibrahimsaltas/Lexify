import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'primary' as 'primary' | 'secondary',
  });

  const { login, register } = useAuth();

  const showAlert = (title: string, message: string, type: 'primary' | 'secondary' = 'primary') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Hata', 'Lütfen tüm alanları doldurun', 'primary');
      return false;
    }

    if (!isLogin && !name.trim()) {
      showAlert('Hata', 'Lütfen adınızı girin', 'primary');
      return false;
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Hata', 'Geçerli bir e-posta adresi girin', 'primary');
      return false;
    }

    // Şifre uzunluğu kontrolü (backend DTO'ya uygun)
    if (password.length < 8) {
      showAlert('Hata', 'Şifre en az 8 karakter olmalıdır', 'primary');
      return false;
    }

    // İsim uzunluğu kontrolü (backend DTO'ya uygun)
    if (!isLogin && (name.length < 2 || name.length > 50)) {
      showAlert('Hata', 'İsim 2-50 karakter arasında olmalıdır', 'primary');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        // Giriş işlemi
        await login(email, password);
        
      } else {
        // Kayıt işlemi
        await register(email, password, name);
        showAlert('Başarılı', 'Hesap oluşturuldu', 'primary');
      }
    } catch (error: any) {
      showAlert('Hata', error.message || 'Bir hata oluştu', 'primary');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo ve Başlık */}
        <View style={styles.header}>
          <Text style={styles.logo}>📚</Text>
          <Text style={styles.title}>Lexify</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                placeholder="Adınızı ve soyadınızı girin"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi girin (en az 8 karakter)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Şifremi unuttum</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Alt Bağlantı */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
          </Text>
          <TouchableOpacity onPress={toggleMode} disabled={loading}>
            <Text style={styles.footerLink}>
              {isLogin ? 'Kayıt olun' : 'Giriş yapın'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sosyal Giriş */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>veya</Text>
          <TouchableOpacity style={styles.socialButton} disabled={loading}>
            <Text style={styles.socialButtonText}>Google ile devam et</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Alert Component */}
      <Alert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type as 'primary' | 'secondary'}
        onClose={handleCloseAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
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
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;