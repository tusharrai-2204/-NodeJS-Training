import axios from "axios";
import type { registerForm, loginForm } from "../types";

const authApi = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export const loginUser = async (data: loginForm) => {
  const response = await authApi.post('/api/auth/login', data);
  return response.data;
};

export const registerUser = async (data: registerForm) => {
  const response = await authApi.post('/api/auth/register', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await authApi.post('/api/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await authApi.get('/api/auth/me');
  return response.data;
};