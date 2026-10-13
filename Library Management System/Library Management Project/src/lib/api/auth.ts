import type { registerForm, loginForm, StudentLoginForm } from "../types";
import { apiInstance } from "../api";
import axios from "axios";

export const loginUser = async (data: loginForm) => {
  const response = await apiInstance.post('/api/auth/login', data);
  return response.data;
};

export const studentLoginUser = async (data: StudentLoginForm) => {
  const response = await apiInstance.post('/api/auth/student-login', data);
  return response.data;
};

export const changePassword = async (data: { new_password: string }) => {
  const response = await apiInstance.post('/api/auth/change-password', data);
  return response.data;
}

export const registerUser = async (data: registerForm) => {
  const response = await apiInstance.post('/api/auth/register', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiInstance.post('/api/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await apiInstance.get('/api/auth/me');
  return response.data;
};

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  withCredentials: true,
});

export const refreshTokens = async () => {
  const response = await authApi.post('/api/auth/refresh');
  return response.data;
};