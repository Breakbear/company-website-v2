import Database from 'better-sqlite3';
import { Migration } from './types';

const up = (db: Database.Database): void => {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_status_category
      ON products (status, category);

    CREATE INDEX IF NOT EXISTS idx_products_featured_sort
      ON products (featured, sortOrder, createdAt);

    CREATE INDEX IF NOT EXISTS idx_news_status_category_published
      ON news (status, category, publishedAt);

    CREATE INDEX IF NOT EXISTS idx_contacts_status_created
      ON contacts (status, createdAt);
  `);
};

export const indexesMigration: Migration = {
  id: '002_indexes',
  description: 'Create indexes for common list queries',
  up,
};

