import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
  IS_LOGGED_IN: "is_logged_in",
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
    if (Platform.OS === "web") {
      this.storage = {
        set: (key: string, value: any) => {
          localStorage.setItem(
            key,
            typeof value === "string" ? value : JSON.stringify(value)
          );
        },
        getString: (key: string) => localStorage.getItem(key),
        getBoolean: (key: string) => localStorage.getItem(key) === "true",
        delete: (key: string) => localStorage.removeItem(key),
        clearAll: () => localStorage.clear(),
        getAllKeys: () => Object.keys(localStorage),
      };
    } else {
      this.storage = {
        set: async (key: string, value: any) => {
          await AsyncStorage.setItem(
            key,
            typeof value === "string" ? value : JSON.stringify(value)
          );
        },
        getString: async (key: string) => {
          const val = await AsyncStorage.getItem(key);
          return val;
        },
        getBoolean: async (key: string) => {
          const val = await AsyncStorage.getItem(key);
          return val === "true";
        },
        delete: async (key: string) => {
          await AsyncStorage.removeItem(key);
        },
        clearAll: async () => {
          await AsyncStorage.clear();
        },
        getAllKeys: async () => {
          return await AsyncStorage.getAllKeys();
        },
      };
    }
  }

  // Token işlemleri
  async setAuthToken(token: string): Promise<void> {
    await this.storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
    await this.storage.set(STORAGE_KEYS.IS_LOGGED_IN, true);
  }

  async getAuthToken(): Promise<string | null> {
    return (await this.storage.getString(STORAGE_KEYS.AUTH_TOKEN)) || null;
  }

  async removeAuthToken(): Promise<void> {
    await this.storage.delete(STORAGE_KEYS.AUTH_TOKEN);
    await this.storage.delete(STORAGE_KEYS.IS_LOGGED_IN);
  }

  // Kullanıcı verisi işlemleri
  async setUserData(userData: StoredUserData): Promise<void> {
    await this.storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  async getUserData(): Promise<StoredUserData | null> {
    const userDataString = await this.storage.getString(STORAGE_KEYS.USER_DATA);
    if (!userDataString) return null;
    try {
      return JSON.parse(userDataString);
    } catch (error) {
      console.error("User data parse error:", error);
      return null;
    }
  }

  async removeUserData(): Promise<void> {
    await this.storage.delete(STORAGE_KEYS.USER_DATA);
  }

  // Refresh token işlemleri
  async setRefreshToken(token: string): Promise<void> {
    await this.storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return (await this.storage.getString(STORAGE_KEYS.REFRESH_TOKEN)) || null;
  }

  async removeRefreshToken(): Promise<void> {
    await this.storage.delete(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Giriş durumu kontrolü
  async isLoggedIn(): Promise<boolean> {
    return (await this.storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN)) || false;
  }

  // Tüm auth verilerini temizle
  async clearAuthData(): Promise<void> {
    await this.removeAuthToken();
    await this.removeUserData();
    await this.removeRefreshToken();
  }

  // Tüm storage'ı temizle
  async clearAll(): Promise<void> {
    await this.storage.clearAll();
  }

  // Debug için tüm verileri listele
  async getAllKeys(): Promise<string[]> {
    return await this.storage.getAllKeys();
  }
}

export default new StorageService();
