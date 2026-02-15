import api from './api';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
}

export const createContact = async (data: CreateContactData): Promise<{ success: boolean; data: Contact; message: string }> => {
  const response = await api.post('/contacts', data);
  return response.data;
};

export const getContacts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{ success: boolean; data: Contact[]; pagination: { page: number; limit: number; total: number; pages: number } }> => {
  const response = await api.get('/contacts', { params });
  return response.data;
};

export const updateContactStatus = async (id: string, data: { status: string; reply?: string }): Promise<{ success: boolean; data: Contact }> => {
  const response = await api.put(`/contacts/${id}`, data);
  return response.data;
};

export const deleteContact = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};
