import { Request, Response } from 'express';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { parseLimit, parsePage } from '../utils/pagination';

interface Product {
  id: string;
  nameZh: string;
  nameEn: string;
  descriptionZh: string;
  descriptionEn: string;
  category: string;
  images: string;
  specifications: string;
  price: number | null;
  featured: number;
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const formatProduct = (row: any) => ({
  _id: row.id,
  name: { zh: row.nameZh, en: row.nameEn },
  description: { zh: row.descriptionZh, en: row.descriptionEn },
  category: row.category,
  images: JSON.parse(row.images || '[]'),
  specifications: JSON.parse(row.specifications || '[]'),
  price: row.price,
  featured: !!row.featured,
  status: row.status,
  order: row.sortOrder,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const getProducts = (req: Request, res: Response): void => {
  const page = parsePage(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 10, 50);
  const category = req.query.category as string;
  const featured = req.query.featured as string;
  const search = req.query.search as string;

  let whereClause = "WHERE status = 'active'";
  const params: any[] = [];

  if (category) {
    whereClause += ' AND category = ?';
    params.push(category);
  }
  if (featured === 'true') {
    whereClause += ' AND featured = 1';
  }
  if (search) {
    whereClause += ' AND (nameZh LIKE ? OR nameEn LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM products ${whereClause}`).get(...params) as any;
  const total = countRow.total;

  const rows = db.prepare(`
    SELECT * FROM products ${whereClause}
    ORDER BY sortOrder ASC, createdAt DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, (page - 1) * limit) as Product[];

  res.json({
    success: true,
    data: rows.map(formatProduct),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const getProduct = (req: Request, res: Response): void => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as Product | undefined;
  
  if (!row) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  res.json({ success: true, data: formatProduct(row) });
};

export const createProduct = (req: Request, res: Response): void => {
  const id = uuidv4();
  const { name, description, category, images, specifications, price, featured, status, order } = req.body;

  db.prepare(`
    INSERT INTO products (id, nameZh, nameEn, descriptionZh, descriptionEn, category, images, specifications, price, featured, status, sortOrder)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, name.zh, name.en, description.zh, description.en, category,
    JSON.stringify(images || []), JSON.stringify(specifications || []),
    price || null, featured ? 1 : 0, status || 'active', order || 0
  );

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product;
  res.status(201).json({ success: true, data: formatProduct(row) });
};

export const updateProduct = (req: Request, res: Response): void => {
  const { name, description, category, images, specifications, price, featured, status, order } = req.body;

  db.prepare(`
    UPDATE products SET
      nameZh = ?, nameEn = ?, descriptionZh = ?, descriptionEn = ?,
      category = ?, images = ?, specifications = ?, price = ?,
      featured = ?, status = ?, sortOrder = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    name?.zh, name?.en, description?.zh, description?.en,
    category, JSON.stringify(images || []), JSON.stringify(specifications || []),
    price || null, featured ? 1 : 0, status, order || 0,
    new Date().toISOString(), req.params.id
  );

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as Product;
  
  if (!row) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  res.json({ success: true, data: formatProduct(row) });
};

export const deleteProduct = (req: Request, res: Response): void => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  res.json({ success: true, message: 'Product deleted successfully' });
};

export const getFeaturedProducts = (req: Request, res: Response): void => {
  const rows = db.prepare(`
    SELECT * FROM products WHERE status = 'active' AND featured = 1
    ORDER BY sortOrder ASC LIMIT 8
  `).all() as Product[];

  res.json({ success: true, data: rows.map(formatProduct) });
};
