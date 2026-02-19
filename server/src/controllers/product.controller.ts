import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { parseLimit, parsePage } from '../utils/pagination';
import { isUrlOrUploadPath } from '../utils/validation';

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

const productValidationRules = [
  body('name.zh').isString().trim().notEmpty().isLength({ max: 200 }).withMessage('name.zh is required'),
  body('name.en').isString().trim().notEmpty().isLength({ max: 200 }).withMessage('name.en is required'),
  body('description.zh')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 10000 })
    .withMessage('description.zh is required'),
  body('description.en')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 10000 })
    .withMessage('description.en is required'),
  body('category').isString().trim().notEmpty().isLength({ max: 100 }).withMessage('category is required'),
  body('images').optional().isArray({ max: 20 }).withMessage('images must be an array'),
  body('images.*')
    .optional()
    .isString()
    .bail()
    .custom((value) => isUrlOrUploadPath(value))
    .withMessage('images entries must be URLs or /uploads paths'),
  body('specifications').optional().isArray({ max: 50 }).withMessage('specifications must be an array'),
  body('specifications.*.key')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('specification key must be a non-empty string'),
  body('specifications.*.value')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('specification value must be a non-empty string'),
  body('price').optional({ values: 'null' }).isFloat({ min: 0 }).withMessage('price must be >= 0'),
  body('featured').optional().isBoolean().withMessage('featured must be a boolean'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage("status must be either 'active' or 'inactive'"),
  body('order').optional().isInt({ min: 0, max: 100000 }).withMessage('order must be a positive integer'),
];

const validateProductPayload = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

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

export const createProduct = [
  ...productValidationRules,
  (req: Request, res: Response): void => {
    if (!validateProductPayload(req, res)) {
      return;
    }

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
  },
];

export const updateProduct = [
  ...productValidationRules,
  (req: Request, res: Response): void => {
    if (!validateProductPayload(req, res)) {
      return;
    }

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
  },
];

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
