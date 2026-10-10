import axios from 'axios';
import { refreshTokens } from './api/auth';

export const apiInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(null);
  });
  failedQueue = [];
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/api/auth/');
    const isAlreadyRetried = originalRequest._retry === true;

    // If 401 and not already retrying and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !isAlreadyRetried
    ) {
      if (isRefreshing) {
        // Queue requests that come in while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshTokens();
        processQueue(null);
        return apiInstance.request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed — clear auth state and redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
