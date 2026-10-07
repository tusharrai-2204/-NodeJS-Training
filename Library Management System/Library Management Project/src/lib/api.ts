import { getAccessToken } from '@/store/authStore';
import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: "http://localhost:3001"
});

apiInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
})