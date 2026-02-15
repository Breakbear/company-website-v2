import { Request, Response } from 'express';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';

interface NewsRow {
  id: string;
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  summaryZh: string | null;
  summaryEn: string | null;
  category: string;
  coverImage: string | null;
  author: string;
  views: number;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

const formatNews = (row: any) => ({
  _id: row.id,
  title: { zh: row.titleZh, en: row.titleEn },
  content: { zh: row.contentZh, en: row.contentEn },
  summary: { zh: row.summaryZh || '', en: row.summaryEn || '' },
  category: row.category,
  coverImage: row.coverImage,
  author: row.author,
  views: row.views,
  status: row.status,
  publishedAt: row.publishedAt,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const getNewsList = (req: Request, res: Response): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const category = req.query.category as string;

  let whereClause = "WHERE status = 'published'";
  const params: any[] = [];

  if (category) {
    whereClause += ' AND category = ?';
    params.push(category);
  }

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM news ${whereClause}`).get(...params) as any;
  const total = countRow.total;

  const rows = db.prepare(`
    SELECT * FROM news ${whereClause}
    ORDER BY publishedAt DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, (page - 1) * limit) as NewsRow[];

  res.json({
    success: true,
    data: rows.map(formatNews),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const getNews = (req: Request, res: Response): void => {
  const row = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id) as NewsRow | undefined;
  
  if (!row) {
    res.status(404).json({ success: false, message: 'News not found' });
    return;
  }

  db.prepare('UPDATE news SET views = views + 1 WHERE id = ?').run(req.params.id);

  res.json({ success: true, data: formatNews(row) });
};

export const createNews = (req: Request, res: Response): void => {
  const id = uuidv4();
  const { title, content, summary, category, coverImage, author, status } = req.body;

  db.prepare(`
    INSERT INTO news (id, titleZh, titleEn, contentZh, contentEn, summaryZh, summaryEn, category, coverImage, author, status, publishedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, title.zh, title.en, content.zh, content.en,
    summary?.zh || null, summary?.en || null,
    category, coverImage || null, author || 'Admin', status || 'published',
    new Date().toISOString()
  );

  const row = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsRow;
  res.status(201).json({ success: true, data: formatNews(row) });
};

export const updateNews = (req: Request, res: Response): void => {
  const { title, content, summary, category, coverImage, author, status } = req.body;

  db.prepare(`
    UPDATE news SET
      titleZh = ?, titleEn = ?, contentZh = ?, contentEn = ?,
      summaryZh = ?, summaryEn = ?, category = ?, coverImage = ?,
      author = ?, status = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    title?.zh, title?.en, content?.zh, content?.en,
    summary?.zh || null, summary?.en || null,
    category, coverImage || null, author, status,
    new Date().toISOString(), req.params.id
  );

  const row = db.prepare('SELECT * FROM news WHERE id = ?').get(req.params.id) as NewsRow;
  
  if (!row) {
    res.status(404).json({ success: false, message: 'News not found' });
    return;
  }

  res.json({ success: true, data: formatNews(row) });
};

export const deleteNews = (req: Request, res: Response): void => {
  const result = db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ success: false, message: 'News not found' });
    return;
  }

  res.json({ success: true, message: 'News deleted successfully' });
};

export const getLatestNews = (req: Request, res: Response): void => {
  const limit = parseInt(req.query.limit as string) || 5;
  const rows = db.prepare(`
    SELECT * FROM news WHERE status = 'published'
    ORDER BY publishedAt DESC LIMIT ?
  `).all(limit) as NewsRow[];

  res.json({ success: true, data: rows.map(formatNews) });
};
