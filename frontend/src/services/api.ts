import axios, { AxiosError, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import authService from './auth.service';
import storageService from './storage.service';

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  (config) => {
    // Token varsa header'a ekle
    const isLoggedIn = authService.isLoggedIn();
    if (isLoggedIn) {
      const token = storageService.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token expire olduğunda refresh et
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Token expire hatası (401) ve henüz retry yapılmamışsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Token'ı yenile
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          // Yeni token ile orijinal isteği tekrarla
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh başarısız olursa kullanıcıyı logout yap
        await authService.logout();
        // Login sayfasına yönlendir (bu kısım navigation ile yapılacak)
        console.log('Token refresh failed, user logged out');
      }
    }

    return Promise.reject(error);
  }
);

export default api;