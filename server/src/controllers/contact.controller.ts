import { Request, Response } from 'express';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { parseLimit, parsePage } from '../utils/pagination';

interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  subject: string;
  message: string;
  status: string;
  reply: string | null;
  createdAt: string;
  updatedAt: string;
}

const formatContact = (row: any) => ({
  _id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  company: row.company,
  subject: row.subject,
  message: row.message,
  status: row.status,
  reply: row.reply,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const createContact = [
  body('name').isString().trim().notEmpty().isLength({ max: 100 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isString().trim().notEmpty().isLength({ max: 50 }).withMessage('Phone is required'),
  body('company').optional({ values: 'null' }).isString().trim().isLength({ max: 100 }),
  body('subject').isString().trim().notEmpty().isLength({ max: 200 }).withMessage('Subject is required'),
  body('message').isString().trim().notEmpty().isLength({ max: 5000 }).withMessage('Message is required'),
  
  (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const id = uuidv4();
    const { name, email, phone, company, subject, message } = req.body;

    db.prepare(`
      INSERT INTO contacts (id, name, email, phone, company, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'unread')
    `).run(id, name, email, phone, company || null, subject, message);

    const row = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as ContactRow;
    res.status(201).json({ success: true, data: formatContact(row), message: 'Message sent successfully' });
  },
];

export const getContacts = (req: Request, res: Response): void => {
  const page = parsePage(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 20, 100);
  const status = req.query.status as string;

  let whereClause = 'WHERE 1=1';
  const params: any[] = [];

  if (status) {
    whereClause += ' AND status = ?';
    params.push(status);
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM contacts ${whereClause}`).get(...params) as any;
  const total = countRow.total;

  const rows = db.prepare(`
    SELECT * FROM contacts ${whereClause}
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, (page - 1) * limit) as ContactRow[];

  res.json({
    success: true,
    data: rows.map(formatContact),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const updateContactStatus = [
  body('status')
    .isIn(['unread', 'read', 'replied'])
    .withMessage("status must be one of 'unread', 'read', 'replied'"),
  body('reply').optional({ values: 'null' }).isString().trim().isLength({ max: 2000 }),

  (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { status, reply } = req.body;

    db.prepare(`
      UPDATE contacts SET status = ?, reply = ?, updatedAt = ?
      WHERE id = ?
    `).run(status, reply || null, new Date().toISOString(), req.params.id);

    const row = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id) as ContactRow;

    if (!row) {
      res.status(404).json({ success: false, message: 'Contact not found' });
      return;
    }

    res.json({ success: true, data: formatContact(row) });
  },
];

export const deleteContact = (req: Request, res: Response): void => {
  const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ success: false, message: 'Contact not found' });
    return;
  }

  res.json({ success: true, message: 'Contact deleted successfully' });
};
