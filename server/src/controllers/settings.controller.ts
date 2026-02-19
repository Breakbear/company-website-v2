import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { isUrlOrUploadPath } from '../utils/validation';

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

const validateOptionalAssetPath = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  if (value.length === 0) {
    return true;
  }
  return isUrlOrUploadPath(value);
};

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

export const updateSettings = [
  body('siteName').optional().isObject(),
  body('siteName.zh').optional().isString().trim().isLength({ max: 200 }),
  body('siteName.en').optional().isString().trim().isLength({ max: 200 }),
  body('siteDescription').optional().isObject(),
  body('siteDescription.zh').optional().isString().trim().isLength({ max: 2000 }),
  body('siteDescription.en').optional().isString().trim().isLength({ max: 2000 }),
  body('logo').optional().custom((value) => validateOptionalAssetPath(value)).withMessage('Invalid logo path'),
  body('favicon').optional().custom((value) => validateOptionalAssetPath(value)).withMessage('Invalid favicon path'),
  body('contact').optional().isObject(),
  body('contact.address').optional().isObject(),
  body('contact.address.zh').optional().isString().trim().isLength({ max: 300 }),
  body('contact.address.en').optional().isString().trim().isLength({ max: 300 }),
  body('contact.phone').optional().isString().trim().isLength({ max: 50 }),
  body('contact.email').optional().isString().trim().isLength({ max: 200 }),
  body('contact.fax').optional().isString().trim().isLength({ max: 50 }),
  body('social').optional().isObject(),
  body('social.wechat').optional().isString().trim().isLength({ max: 200 }),
  body('social.weibo').optional().isString().trim().isLength({ max: 200 }),
  body('social.linkedin').optional().isString().trim().isLength({ max: 200 }),
  body('social.facebook').optional().isString().trim().isLength({ max: 200 }),
  body('social.twitter').optional().isString().trim().isLength({ max: 200 }),
  body('seo').optional().isObject(),
  body('seo.keywords').optional().isObject(),
  body('seo.keywords.zh').optional().isString().trim().isLength({ max: 2000 }),
  body('seo.keywords.en').optional().isString().trim().isLength({ max: 2000 }),
  body('seo.description').optional().isObject(),
  body('seo.description.zh').optional().isString().trim().isLength({ max: 2000 }),
  body('seo.description.en').optional().isString().trim().isLength({ max: 2000 }),
  body('about').optional().isObject(),
  body('about.zh').optional().isString().trim().isLength({ max: 20000 }),
  body('about.en').optional().isString().trim().isLength({ max: 20000 }),
  body('banners').optional().isArray({ max: 20 }),
  body('banners.*.image')
    .optional()
    .isString()
    .bail()
    .custom((value) => validateOptionalAssetPath(value))
    .withMessage('Invalid banner image path'),
  body('banners.*.link').optional().isString().trim().isLength({ max: 500 }),
  body('banners.*.title').optional().isObject(),
  body('banners.*.title.zh').optional().isString().trim().isLength({ max: 200 }),
  body('banners.*.title.en').optional().isString().trim().isLength({ max: 200 }),

  (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

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
  },
];
