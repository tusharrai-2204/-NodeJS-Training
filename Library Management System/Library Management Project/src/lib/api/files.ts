import { apiInstance } from "../api";

export const uploadFile = async (file: File): Promise<{ id: number; url: string; original_name: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiInstance.post('/api/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.data;
};