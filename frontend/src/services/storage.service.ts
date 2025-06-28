import { Platform } from 'react-native';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  IS_LOGGED_IN: 'is_logged_in',
} as const;

export interface StoredUserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

class StorageService {
  private storage: any;

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage() {
    if (Platform.OS === 'web') {
      // Web için localStorage wrapper
      this.storage = {
        set: (key: string, value: any) => {
          try {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          } catch (error) {
            console.error('localStorage set error:', error);
          }
        },
        getString: (key: string) => {
          try {
            return localStorage.getItem(key);
          } catch (error) {
            console.error('localStorage getString error:', error);
            return null;
          }
        },
        getBoolean: (key: string) => {
          try {
            const value = localStorage.getItem(key);
            return value === 'true';
          } catch (error) {
            console.error('localStorage getBoolean error:', error);
            return false;
          }
        },
        delete: (key: string) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error('localStorage delete error:', error);
          }
        },
        clearAll: () => {
          try {
            localStorage.clear();
          } catch (error) {
            console.error('localStorage clearAll error:', error);
          }
        },
        getAllKeys: () => {
          try {
            return Object.keys(localStorage);
          } catch (error) {
            console.error('localStorage getAllKeys error:', error);
            return [];
          }
        }
      };
    } else {
      // Mobile için basit bir fallback (AsyncStorage kullanacağız)
      this.storage = {
        set: (key: string, value: any) => {
          console.log('Mobile storage set:', key, value);
          // Mobile'da AsyncStorage kullanılacak
        },
        getString: (key: string) => {
          console.log('Mobile storage getString:', key);
          return null;
        },
        getBoolean: (key: string) => {
          console.log('Mobile storage getBoolean:', key);
          return false;
        },
        delete: (key: string) => {
          console.log('Mobile storage delete:', key);
        },
        clearAll: () => {
          console.log('Mobile storage clearAll');
        },
        getAllKeys: () => {
          console.log('Mobile storage getAllKeys');
          return [];
        }
      };
    }
  }

  // Token işlemleri
  setAuthToken(token: string): void {
    this.storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
    this.storage.set(STORAGE_KEYS.IS_LOGGED_IN, true);
  }

  getAuthToken(): string | null {
    return this.storage.getString(STORAGE_KEYS.AUTH_TOKEN) || null;
  }

  removeAuthToken(): void {
    this.storage.delete(STORAGE_KEYS.AUTH_TOKEN);
    this.storage.delete(STORAGE_KEYS.IS_LOGGED_IN);
  }

  // Kullanıcı verisi işlemleri
  setUserData(userData: StoredUserData): void {
    this.storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  getUserData(): StoredUserData | null {
    const userDataString = this.storage.getString(STORAGE_KEYS.USER_DATA);
    if (!userDataString) return null;
    
    try {
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('User data parse error:', error);
      return null;
    }
  }

  removeUserData(): void {
    this.storage.delete(STORAGE_KEYS.USER_DATA);
  }

  // Refresh token işlemleri
  setRefreshToken(token: string): void {
    this.storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return this.storage.getString(STORAGE_KEYS.REFRESH_TOKEN) || null;
  }

  removeRefreshToken(): void {
    this.storage.delete(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Giriş durumu kontrolü
  isLoggedIn(): boolean {
    return this.storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false;
  }

  // Tüm auth verilerini temizle
  clearAuthData(): void {
    this.removeAuthToken();
    this.removeUserData();
    this.removeRefreshToken();
  }

  // Tüm storage'ı temizle
  clearAll(): void {
    this.storage.clearAll();
  }

  // Debug için tüm verileri listele
  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }
}

export default new StorageService(); 