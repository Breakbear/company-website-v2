import Database from 'better-sqlite3';
import { Migration } from './types';

const up = (db: Database.Database): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'editor',
      avatar TEXT,
      isActive INTEGER DEFAULT 1,
      lastLogin TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      nameZh TEXT NOT NULL,
      nameEn TEXT NOT NULL,
      descriptionZh TEXT NOT NULL,
      descriptionEn TEXT NOT NULL,
      category TEXT NOT NULL,
      images TEXT DEFAULT '[]',
      specifications TEXT DEFAULT '[]',
      price REAL,
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news (
      id TEXT PRIMARY KEY,
      titleZh TEXT NOT NULL,
      titleEn TEXT NOT NULL,
      contentZh TEXT NOT NULL,
      contentEn TEXT NOT NULL,
      summaryZh TEXT,
      summaryEn TEXT,
      category TEXT NOT NULL,
      coverImage TEXT,
      author TEXT DEFAULT 'Admin',
      views INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      publishedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      reply TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      siteNameZh TEXT DEFAULT 'Company Name',
      siteNameEn TEXT DEFAULT 'Company Name',
      siteDescriptionZh TEXT DEFAULT 'Company Description',
      siteDescriptionEn TEXT DEFAULT 'Company Description',
      logo TEXT,
      favicon TEXT,
      addressZh TEXT,
      addressEn TEXT,
      phone TEXT,
      email TEXT,
      fax TEXT,
      wechat TEXT,
      weibo TEXT,
      linkedin TEXT,
      facebook TEXT,
      twitter TEXT,
      seoKeywordsZh TEXT,
      seoKeywordsEn TEXT,
      seoDescriptionZh TEXT,
      seoDescriptionEn TEXT,
      aboutZh TEXT,
      aboutEn TEXT,
      banners TEXT DEFAULT '[]',
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      nameZh TEXT NOT NULL,
      nameEn TEXT NOT NULL,
      type TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      sortOrder INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const initialSchemaMigration: Migration = {
  id: '001_initial_schema',
  description: 'Create core application tables',
  up,
};

