process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'smoke-test-jwt-secret';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import app from './app';
import db from './config/database';
import { env } from './config/env';

interface SeedUser {
  id: string;
  email: string;
  password: string;
}

const createdUserIds: string[] = [];
const createdProductIds: string[] = [];

const createUser = async (role: string): Promise<SeedUser> => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
  const id = uuidv4();
  const password = 'SmokePass123!';
  const username = `${role}_${suffix}`;
  const email = `${role}_${suffix}@example.com`;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.prepare(`
    INSERT INTO users (id, username, email, password, role, isActive)
    VALUES (?, ?, ?, ?, ?, 1)
  `).run(id, username, email, hashedPassword, role);

  createdUserIds.push(id);
  return { id, email, password };
};

const loginAndGetToken = async (email: string, password: string): Promise<string> => {
  const response = await request(app).post('/api/auth/login').send({ email, password });
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.token);
  return response.body.token as string;
};

const baseProductPayload = {
  name: { zh: 'Smoke Product', en: 'Smoke Product' },
  description: { zh: 'Smoke Description', en: 'Smoke Description' },
  category: 'smoke',
  images: [],
  specifications: [],
  price: 99,
  featured: false,
  status: 'active',
  order: 0,
};

test('GET /api/health returns service status', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('protected endpoint returns unified 401 when token is missing', async () => {
  const response = await request(app).get('/api/contacts');
  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /Not authorized/i);
});

test('login token contains role claim', async () => {
  const adminUser = await createUser('admin');
  const token = await loginAndGetToken(adminUser.email, adminUser.password);
  const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };

  assert.equal(decoded.id, adminUser.id);
  assert.equal(decoded.role, 'admin');
});

test('editor can create and update products but cannot delete products', async () => {
  const editorUser = await createUser('editor');
  const token = await loginAndGetToken(editorUser.email, editorUser.password);

  const createResponse = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send(baseProductPayload);

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.success, true);

  const productId = createResponse.body.data?._id as string;
  assert.ok(productId);
  createdProductIds.push(productId);

  const updateResponse = await request(app)
    .put(`/api/products/${productId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      ...baseProductPayload,
      name: { zh: 'Updated Smoke Product', en: 'Updated Smoke Product' },
    });

  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.success, true);

  const deleteResponse = await request(app)
    .delete(`/api/products/${productId}`)
    .set('Authorization', `Bearer ${token}`);

  assert.equal(deleteResponse.status, 403);
  assert.equal(deleteResponse.body.success, false);
});

test('non-admin/editor role receives 403 for upload endpoint', async () => {
  const viewerUser = await createUser('viewer');
  const token = await loginAndGetToken(viewerUser.email, viewerUser.password);

  const response = await request(app)
    .post('/api/upload')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.status, 403);
  assert.equal(response.body.success, false);
});

test('role downgrade invalidates an old token on sensitive operations', async () => {
  const editorUser = await createUser('editor');
  const token = await loginAndGetToken(editorUser.email, editorUser.password);

  db.prepare('UPDATE users SET role = ?, updatedAt = ? WHERE id = ?')
    .run('viewer', new Date().toISOString(), editorUser.id);

  const response = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send(baseProductPayload);

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /Role has changed/i);
});

test.after(() => {
  if (createdProductIds.length > 0) {
    const productPlaceholders = createdProductIds.map(() => '?').join(',');
    db.prepare(`DELETE FROM products WHERE id IN (${productPlaceholders})`).run(...createdProductIds);
  }

  if (createdUserIds.length > 0) {
    const userPlaceholders = createdUserIds.map(() => '?').join(',');
    db.prepare(`DELETE FROM users WHERE id IN (${userPlaceholders})`).run(...createdUserIds);
  }
});

