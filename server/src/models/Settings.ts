import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
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
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    siteName: {
      zh: { type: String, default: '公司名称' },
      en: { type: String, default: 'Company Name' },
    },
    siteDescription: {
      zh: { type: String, default: '公司简介' },
      en: { type: String, default: 'Company Description' },
    },
    logo: { type: String },
    favicon: { type: String },
    contact: {
      address: {
        zh: { type: String },
        en: { type: String },
      },
      phone: { type: String },
      email: { type: String },
      fax: { type: String },
    },
    social: {
      wechat: { type: String },
      weibo: { type: String },
      linkedin: { type: String },
      facebook: { type: String },
      twitter: { type: String },
    },
    seo: {
      keywords: {
        zh: { type: String },
        en: { type: String },
      },
      description: {
        zh: { type: String },
        en: { type: String },
      },
    },
    about: {
      zh: { type: String },
      en: { type: String },
    },
    banners: [
      {
        image: { type: String },
        link: { type: String },
        title: {
          zh: { type: String },
          en: { type: String },
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', settingsSchema);
