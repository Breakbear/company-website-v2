import Database from 'better-sqlite3';
import { initialSchemaMigration } from './001_initial_schema';
import { indexesMigration } from './002_indexes';
import { homepageContentMigration } from './003_homepage_content';
import { Migration } from './types';

const migrations: Migration[] = [initialSchemaMigration, indexesMigration, homepageContentMigration];

const ensureMigrationsTable = (db: Database.Database): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      appliedAt TEXT NOT NULL
    );
  `);
};

export const runMigrations = (db: Database.Database): void => {
  ensureMigrationsTable(db);

  const appliedRows = db.prepare('SELECT id FROM schema_migrations').all() as Array<{ id: string }>;
  const appliedIds = new Set(appliedRows.map((row) => row.id));

  for (const migration of migrations) {
    if (appliedIds.has(migration.id)) {
      continue;
    }

    const runMigration = db.transaction(() => {
      migration.up(db);
      db.prepare(`
        INSERT INTO schema_migrations (id, description, appliedAt)
        VALUES (?, ?, ?)
      `).run(migration.id, migration.description, new Date().toISOString());
    });

    runMigration();
    console.log(`[migration] Applied ${migration.id} - ${migration.description}`);
  }
};
