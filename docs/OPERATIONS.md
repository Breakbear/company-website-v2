# Operations Checklist

## 1) Team sync after rewritten history

`main` was force-pushed after removing tracked SQLite files from history.

Share this with all collaborators:

```bash
git fetch origin
git checkout main
git reset --hard origin/main
```

If local branches are based on old history, rebase/cherry-pick onto the new `main`.

## 2) Required deployment environment variables

Set these variables in Railway (or any runtime environment):

- `JWT_SECRET`: long random secret string (required)
- `CORS_ORIGIN`: comma-separated allowed origins, for example `https://example.com,https://admin.example.com`
- `PORT`: optional, defaults to `5000`

If `JWT_SECRET` is missing, server startup fails by design.

## 3) Client relogin notice

JWT payload now includes `role`, and stale tokens are rejected after role changes.
Plan a one-time relogin notice for admin users during release.

## 4) CI quality gate

GitHub Actions workflow `.github/workflows/verify.yml` now runs on push/PR to `main`:

- `npm ci`
- `npm run verify`

Any regression in typecheck/build/smoke tests will block the pipeline.

## 5) Database migrations

SQLite schema is now managed via versioned migrations (`schema_migrations` table).

- Migrations run automatically on server startup.
- You can also run them manually:

```bash
npm run migrate --workspace=server
```
