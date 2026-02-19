import Database from 'better-sqlite3';
import { Migration } from './types';

const up = (db: Database.Database): void => {
  const columns = db.prepare('PRAGMA table_info(settings)').all() as Array<{ name: string }>;
  const hasHomepageContent = columns.some((column) => column.name === 'homepageContent');

  if (!hasHomepageContent) {
    db.exec(`ALTER TABLE settings ADD COLUMN homepageContent TEXT DEFAULT '{}'`);
  }

  db.exec(`UPDATE settings SET homepageContent = '{}' WHERE homepageContent IS NULL`);
};

export const homepageContentMigration: Migration = {
  id: '003_homepage_content',
  description: 'Add homepageContent JSON column to settings',
  up,
};

