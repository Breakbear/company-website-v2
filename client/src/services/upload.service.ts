import api from './api';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
  };
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadMultipleImages = async (files: File[]): Promise<{ success: boolean; data: { url: string; filename: string }[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });
  
  const response = await api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
