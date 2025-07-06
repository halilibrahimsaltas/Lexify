import axios, { AxiosError, AxiosResponse } from "axios";
import Constants from "expo-constants";
// import authService from "./auth.service"; // KALDIRILDI
import storageService from "./storage.service";

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
  async (config) => {
    // Token varsa header'a ekle
    const token = await storageService.getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - sadeleştirildi, refresh ve logout işlemleri kaldırıldı
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Sadece hatayı döndür
    return Promise.reject(error);
  }
);

export default api;
