// api.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';


const refreshTokenPath = '/auth/refreshToken';

// Создаем инстанс axios с поддержкой куков
export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (error: any) => void }> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve());
  failedQueue = [];
};

// Запрос на обновление токена через endpoint /refresh (куки httpOnly)
const refreshAuth = async (): Promise<void> => {
  await api.get(refreshTokenPath);
};

// Интерсепторы
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (originalRequest.url === refreshTokenPath) {
        if (window.location.pathname !== '/login') window.location.href = '/login';
        return;
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          await refreshAuth();
          processQueue(null);
          resolve(api(originalRequest));
        } catch (err) {
          processQueue(err as AxiosError);
          if (window.location.pathname !== '/login') window.location.href = '/login';
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }
    return Promise.reject(error);
  }
);
