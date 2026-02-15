import { Request, Response } from 'express';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const formatSettings = (row: any) => ({
  _id: row.id,
  siteName: { zh: row.siteNameZh, en: row.siteNameEn },
  siteDescription: { zh: row.siteDescriptionZh, en: row.siteDescriptionEn },
  logo: row.logo,
  favicon: row.favicon,
  contact: {
    address: { zh: row.addressZh, en: row.addressEn },
    phone: row.phone,
    email: row.email,
    fax: row.fax,
  },
  social: {
    wechat: row.wechat,
    weibo: row.weibo,
    linkedin: row.linkedin,
    facebook: row.facebook,
    twitter: row.twitter,
  },
  seo: {
    keywords: { zh: row.seoKeywordsZh, en: row.seoKeywordsEn },
    description: { zh: row.seoDescriptionZh, en: row.seoDescriptionEn },
  },
  about: { zh: row.aboutZh, en: row.aboutEn },
  banners: JSON.parse(row.banners || '[]'),
});

export const getSettings = (req: Request, res: Response): void => {
  let row = db.prepare('SELECT * FROM settings LIMIT 1').get() as any;
  
  if (!row) {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO settings (id, siteNameZh, siteNameEn, siteDescriptionZh, siteDescriptionEn)
      VALUES (?, '公司名称', 'Company Name', '公司简介', 'Company Description')
    `).run(id);
    row = db.prepare('SELECT * FROM settings WHERE id = ?').get(id) as any;
  }

  res.json({ success: true, data: formatSettings(row) });
};

export const updateSettings = (req: Request, res: Response): void => {
  let row = db.prepare('SELECT * FROM settings LIMIT 1').get() as any;
  
  if (!row) {
    const id = uuidv4();
    db.prepare(`INSERT INTO settings (id) VALUES (?)`).run(id);
    row = db.prepare('SELECT * FROM settings WHERE id = ?').get(id) as any;
  }

  const { siteName, siteDescription, logo, favicon, contact, social, seo, about, banners } = req.body;

  db.prepare(`
    UPDATE settings SET
      siteNameZh = ?, siteNameEn = ?,
      siteDescriptionZh = ?, siteDescriptionEn = ?,
      logo = ?, favicon = ?,
      addressZh = ?, addressEn = ?,
      phone = ?, email = ?, fax = ?,
      wechat = ?, weibo = ?, linkedin = ?, facebook = ?, twitter = ?,
      seoKeywordsZh = ?, seoKeywordsEn = ?,
      seoDescriptionZh = ?, seoDescriptionEn = ?,
      aboutZh = ?, aboutEn = ?,
      banners = ?, updatedAt = ?
    WHERE id = ?
  `).run(
    siteName?.zh, siteName?.en,
    siteDescription?.zh, siteDescription?.en,
    logo, favicon,
    contact?.address?.zh, contact?.address?.en,
    contact?.phone, contact?.email, contact?.fax,
    social?.wechat, social?.weibo, social?.linkedin, social?.facebook, social?.twitter,
    seo?.keywords?.zh, seo?.keywords?.en,
    seo?.description?.zh, seo?.description?.en,
    about?.zh, about?.en,
    JSON.stringify(banners || []),
    new Date().toISOString(),
    row.id
  );

  const updatedRow = db.prepare('SELECT * FROM settings WHERE id = ?').get(row.id) as any;
  res.json({ success: true, data: formatSettings(updatedRow) });
};
