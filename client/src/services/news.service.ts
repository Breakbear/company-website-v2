import api from './api';

export interface News {
  _id: string;
  title: {
    zh: string;
    en: string;
  };
  content: {
    zh: string;
    en: string;
  };
  summary: {
    zh: string;
    en: string;
  };
  category: string;
  coverImage: string;
  author: string;
  views: number;
  status: string;
  publishedAt: string;
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

export const getNewsList = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<PaginatedResponse<News>> => {
  const response = await api.get('/news', { params });
  return response.data;
};

export const getNews = async (id: string): Promise<{ success: boolean; data: News }> => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

export const getLatestNews = async (limit?: number): Promise<{ success: boolean; data: News[] }> => {
  const response = await api.get('/news/latest', { params: { limit } });
  return response.data;
};

export const createNews = async (data: Partial<News>): Promise<{ success: boolean; data: News }> => {
  const response = await api.post('/news', data);
  return response.data;
};

export const updateNews = async (id: string, data: Partial<News>): Promise<{ success: boolean; data: News }> => {
  const response = await api.put(`/news/${id}`, data);
  return response.data;
};

export const deleteNews = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};
