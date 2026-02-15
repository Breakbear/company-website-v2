import api from './api';

export interface Settings {
  _id: string;
  siteName: {
    zh: string;
    en: string;
  };
  siteDescription: {
    zh: string;
    en: string;
  };
  logo: string;
  favicon: string;
  contact: {
    address: {
      zh: string;
      en: string;
    };
    phone: string;
    email: string;
    fax?: string;
  };
  social: {
    wechat?: string;
    weibo?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  seo: {
    keywords: {
      zh: string;
      en: string;
    };
    description: {
      zh: string;
      en: string;
    };
  };
  about: {
    zh: string;
    en: string;
  };
  banners: {
    image: string;
    link?: string;
    title: {
      zh: string;
      en: string;
    };
  }[];
}

export const getSettings = async (): Promise<{ success: boolean; data: Settings }> => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (data: Partial<Settings>): Promise<{ success: boolean; data: Settings }> => {
  const response = await api.put('/settings', data);
  return response.data;
};
