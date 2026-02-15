import { Request, Response } from 'express';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';

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
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('message').notEmpty().withMessage('Message is required'),
  
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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
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

export const updateContactStatus = (req: Request, res: Response): void => {
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
};

export const deleteContact = (req: Request, res: Response): void => {
  const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ success: false, message: 'Contact not found' });
    return;
  }

  res.json({ success: true, message: 'Contact deleted successfully' });
};
