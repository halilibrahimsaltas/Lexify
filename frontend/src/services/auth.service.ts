import api from "./api";
import storageService, { StoredUserData } from "./storage.service";

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
    // Constructor'da async işlem yapmıyoruz
    // Auth initialization AuthContext'te yapılıyor
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      const authData = response.data;
      // Token ve kullanıcı verilerini storage'a kaydet
      await storageService.setAuthToken(authData.access_token);
      await storageService.setUserData(authData.user);
      // API header'ına token'ı set et
      this.setAuthToken(authData.access_token);
      return authData;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Geçersiz e-posta veya şifre");
      }
      throw new Error("Giriş başarısız");
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Kayıt endpointi backend'de /users olduğu için burası güncellendi
      const response = await api.post("/users", userData);
      const authData = response.data;
      // Token ve kullanıcı verilerini storage'a kaydet
      await storageService.setAuthToken(authData.access_token);
      await storageService.setUserData(authData.user);
      // API header'ına token'ı set et
      this.setAuthToken(authData.access_token);
      return authData;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error("Bu e-posta adresi zaten kullanımda");
      }
      if (error.response?.status === 400) {
        throw new Error("Geçersiz bilgiler");
      }
      throw new Error("Kayıt başarısız");
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      await storageService.clearAuthData();
      this.removeAuthToken();
    }
  }

  async getCurrentUser(): Promise<AuthResponse["user"]> {
    try {
      const response = await api.get("/auth/me");
      const userData = response.data;
      await storageService.setUserData(userData);
      return userData;
    } catch (error) {
      throw new Error("Kullanıcı bilgileri alınamadı");
    }
  }

  async getStoredUserData(): Promise<StoredUserData | null> {
    return await storageService.getUserData();
  }

  async isLoggedIn(): Promise<boolean> {
    return await storageService.isLoggedIn();
  }

  async restoreAuthToken(): Promise<boolean> {
    try {
      const token = await storageService.getAuthToken();
      if (token) {
        this.setAuthToken(token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token restore error:", error);
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await storageService.getRefreshToken();
      if (!refreshToken) return false;
      const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });
      const newToken = response.data.access_token;
      await storageService.setAuthToken(newToken);
      this.setAuthToken(newToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await this.logout();
      return false;
    }
  }

  // Token'ı API header'ına set et
  setAuthToken(token: string): void {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Token'ı API header'ından kaldır
  removeAuthToken(): void {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default new AuthService();
