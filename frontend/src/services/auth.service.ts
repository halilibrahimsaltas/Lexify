import api from './api';
import storageService, { StoredUserData } from './storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

class AuthService {
  constructor() {
    // Uygulama başladığında stored token'ı API'ye set et
    this.initializeAuth();
  }

  private initializeAuth(): void {
    try {
      const token = storageService.getAuthToken();
      if (token) {
        this.setAuthToken(token);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const authData = response.data;
      
      // Token ve kullanıcı verilerini storage'a kaydet
      storageService.setAuthToken(authData.access_token);
      storageService.setUserData(authData.user);
      
      // API header'ına token'ı set et
      this.setAuthToken(authData.access_token);
      
      return authData;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Geçersiz e-posta veya şifre');
      }
      throw new Error('Giriş başarısız');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      const authData = response.data;
      
      // Token ve kullanıcı verilerini storage'a kaydet
      storageService.setAuthToken(authData.access_token);
      storageService.setUserData(authData.user);
      
      // API header'ına token'ı set et
      this.setAuthToken(authData.access_token);
      
      return authData;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Bu e-posta adresi zaten kullanımda');
      }
      if (error.response?.status === 400) {
        throw new Error('Geçersiz bilgiler');
      }
      throw new Error('Kayıt başarısız');
    }
  }

  async logout(): Promise<void> {
    try {
      // Backend'e logout isteği gönder (opsiyonel)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Local storage'dan tüm auth verilerini temizle
      storageService.clearAuthData();
      this.removeAuthToken();
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      
      // Storage'daki kullanıcı verilerini güncelle
      storageService.setUserData(userData);
      
      return userData;
    } catch (error) {
      throw new Error('Kullanıcı bilgileri alınamadı');
    }
  }

  // Storage'dan kullanıcı verilerini al (API çağrısı yapmadan)
  getStoredUserData(): StoredUserData | null {
    return storageService.getUserData();
  }

  // Giriş durumunu kontrol et
  isLoggedIn(): boolean {
    return storageService.isLoggedIn();
  }

  // Token'ı API header'ına set et
  setAuthToken(token: string): void {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Token'ı API header'ından kaldır
  removeAuthToken(): void {
    delete api.defaults.headers.common['Authorization'];
  }

  // Stored token'ı yeniden yükle
  restoreAuthToken(): boolean {
    try {
      const token = storageService.getAuthToken();
      if (token) {
        this.setAuthToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token restore error:', error);
      return false;
    }
  }

  // Token'ı yenile (refresh token ile)
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = storageService.getRefreshToken();
      if (!refreshToken) return false;

      const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
      const newToken = response.data.access_token;
      
      storageService.setAuthToken(newToken);
      this.setAuthToken(newToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Refresh başarısız olursa logout yap
      await this.logout();
      return false;
    }
  }
}

export default new AuthService(); 