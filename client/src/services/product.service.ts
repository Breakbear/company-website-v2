import api from './api';

export interface Product {
  _id: string;
  name: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  category: string;
  images: string[];
  specifications: {
    key: string;
    value: string;
  }[];
  price?: number;
  featured: boolean;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}): Promise<PaginatedResponse<Product>> => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: string): Promise<{ success: boolean; data: Product }> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async (): Promise<{ success: boolean; data: Product[] }> => {
  const response = await api.get('/products/featured');
  return response.data;
};

export const createProduct = async (data: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<{ success: boolean; data: Product }> => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
