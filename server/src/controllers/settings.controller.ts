import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { defaultHomepageContent, HomepageContent } from '../config/homepage-content';
import { isUrlOrUploadPath } from '../utils/validation';

const cloneHomepageContent = (): HomepageContent =>
  JSON.parse(JSON.stringify(defaultHomepageContent)) as HomepageContent;

const asNonEmptyObject = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback;

const pickLocalized = (value: unknown, fallback: { zh: string; en: string }) => {
  const obj = asNonEmptyObject(value);
  return {
    zh: asString(obj.zh, fallback.zh),
    en: asString(obj.en, fallback.en),
  };
};

const normalizeHomepageContent = (value: unknown): HomepageContent => {
  const fallback = cloneHomepageContent();
  const obj = asNonEmptyObject(value);

  const heroSlidesRaw = Array.isArray(obj.heroSlides) ? obj.heroSlides.slice(0, 8) : fallback.heroSlides;
  const strengthMetricsRaw = Array.isArray(obj.strengthMetrics)
    ? obj.strengthMetrics.slice(0, 8)
    : fallback.strengthMetrics;
  const milestonesRaw = Array.isArray(obj.milestones) ? obj.milestones.slice(0, 20) : fallback.milestones;
  const teamRaw = Array.isArray(obj.team) ? obj.team.slice(0, 20) : fallback.team;

  return {
    heroSlides: heroSlidesRaw.map((item, index) => {
      const source = asNonEmptyObject(item);
      const fallbackItem = fallback.heroSlides[Math.min(index, fallback.heroSlides.length - 1)];
      return {
        image: asString(source.image, fallbackItem?.image || fallback.heroSlides[0].image),
        title: pickLocalized(source.title, fallbackItem?.title || fallback.heroSlides[0].title),
        subtitle: pickLocalized(source.subtitle, fallbackItem?.subtitle || fallback.heroSlides[0].subtitle),
        ctaText: pickLocalized(source.ctaText, fallbackItem?.ctaText || fallback.heroSlides[0].ctaText),
        ctaLink: asString(source.ctaLink, fallbackItem?.ctaLink || '/contact'),
      };
    }),
    strengthMetrics: strengthMetricsRaw.map((item, index) => {
      const source = asNonEmptyObject(item);
      const fallbackItem = fallback.strengthMetrics[Math.min(index, fallback.strengthMetrics.length - 1)];
      return {
        value: asString(source.value, fallbackItem?.value || ''),
        label: pickLocalized(source.label, fallbackItem?.label || fallback.strengthMetrics[0].label),
        description: pickLocalized(
          source.description,
          fallbackItem?.description || fallback.strengthMetrics[0].description
        ),
      };
    }),
    brandStory: {
      title: pickLocalized(asNonEmptyObject(obj.brandStory).title, fallback.brandStory.title),
      description: pickLocalized(asNonEmptyObject(obj.brandStory).description, fallback.brandStory.description),
      highlight: pickLocalized(asNonEmptyObject(obj.brandStory).highlight, fallback.brandStory.highlight),
      image: asString(asNonEmptyObject(obj.brandStory).image, fallback.brandStory.image),
    },
    milestones: milestonesRaw.map((item, index) => {
      const source = asNonEmptyObject(item);
      const fallbackItem = fallback.milestones[Math.min(index, fallback.milestones.length - 1)];
      return {
        year: asString(source.year, fallbackItem?.year || ''),
        title: pickLocalized(source.title, fallbackItem?.title || fallback.milestones[0].title),
        description: pickLocalized(source.description, fallbackItem?.description || fallback.milestones[0].description),
      };
    }),
    team: teamRaw.map((item, index) => {
      const source = asNonEmptyObject(item);
      const fallbackItem = fallback.team[Math.min(index, fallback.team.length - 1)];
      return {
        name: pickLocalized(source.name, fallbackItem?.name || fallback.team[0].name),
        role: pickLocalized(source.role, fallbackItem?.role || fallback.team[0].role),
        bio: pickLocalized(source.bio, fallbackItem?.bio || fallback.team[0].bio),
        image: asString(source.image, fallbackItem?.image || fallback.team[0].image),
      };
    }),
    cta: {
      title: pickLocalized(asNonEmptyObject(obj.cta).title, fallback.cta.title),
      description: pickLocalized(asNonEmptyObject(obj.cta).description, fallback.cta.description),
      buttonText: pickLocalized(asNonEmptyObject(obj.cta).buttonText, fallback.cta.buttonText),
      buttonLink: asString(asNonEmptyObject(obj.cta).buttonLink, fallback.cta.buttonLink),
      backgroundImage: asString(asNonEmptyObject(obj.cta).backgroundImage, fallback.cta.backgroundImage),
    },
  };
};

const parseHomepageContent = (raw: string | null | undefined): HomepageContent => {
  if (!raw) {
    return cloneHomepageContent();
  }

  try {
    return normalizeHomepageContent(JSON.parse(raw));
  } catch {
    return cloneHomepageContent();
  }
};

const parseJsonArray = <T>(raw: string | null | undefined, fallback: T[]): T[] => {
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

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
  banners: parseJsonArray(row.banners, []),
  homepageContent: parseHomepageContent(row.homepageContent),
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

const validateOptionalLinkPath = (value: unknown): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  if (value.length === 0) {
    return true;
  }
  return value.startsWith('/') || isUrlOrUploadPath(value);
};

export const getSettings = (req: Request, res: Response): void => {
  let row = db.prepare('SELECT * FROM settings LIMIT 1').get() as any;

  if (!row) {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO settings (id, siteNameZh, siteNameEn, siteDescriptionZh, siteDescriptionEn, homepageContent)
      VALUES (?, '海拓斯特液压科技', 'Haituoste Torque Technologies', '高可靠工业级液压扭矩解决方案', 'Reliable industrial hydraulic torque solutions', ?)
    `).run(id, JSON.stringify(defaultHomepageContent));

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

  body('homepageContent').optional().isObject(),
  body('homepageContent.heroSlides').optional().isArray({ max: 8 }),
  body('homepageContent.heroSlides.*.image')
    .optional()
    .isString()
    .bail()
    .custom((value) => validateOptionalAssetPath(value))
    .withMessage('Invalid hero image path'),
  body('homepageContent.heroSlides.*.title.zh').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.heroSlides.*.title.en').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.heroSlides.*.subtitle.zh').optional().isString().trim().isLength({ max: 500 }),
  body('homepageContent.heroSlides.*.subtitle.en').optional().isString().trim().isLength({ max: 500 }),
  body('homepageContent.heroSlides.*.ctaText.zh').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.heroSlides.*.ctaText.en').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.heroSlides.*.ctaLink')
    .optional()
    .custom((value) => validateOptionalLinkPath(value))
    .withMessage('Invalid hero CTA link'),

  body('homepageContent.strengthMetrics').optional().isArray({ max: 8 }),
  body('homepageContent.strengthMetrics.*.value').optional().isString().trim().isLength({ max: 50 }),
  body('homepageContent.strengthMetrics.*.label.zh').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.strengthMetrics.*.label.en').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.strengthMetrics.*.description.zh').optional().isString().trim().isLength({ max: 300 }),
  body('homepageContent.strengthMetrics.*.description.en').optional().isString().trim().isLength({ max: 300 }),

  body('homepageContent.brandStory').optional().isObject(),
  body('homepageContent.brandStory.title.zh').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.brandStory.title.en').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.brandStory.description.zh').optional().isString().trim().isLength({ max: 5000 }),
  body('homepageContent.brandStory.description.en').optional().isString().trim().isLength({ max: 5000 }),
  body('homepageContent.brandStory.highlight.zh').optional().isString().trim().isLength({ max: 300 }),
  body('homepageContent.brandStory.highlight.en').optional().isString().trim().isLength({ max: 300 }),
  body('homepageContent.brandStory.image')
    .optional()
    .isString()
    .bail()
    .custom((value) => validateOptionalAssetPath(value))
    .withMessage('Invalid brand story image path'),

  body('homepageContent.milestones').optional().isArray({ max: 20 }),
  body('homepageContent.milestones.*.year').optional().isString().trim().isLength({ max: 20 }),
  body('homepageContent.milestones.*.title.zh').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.milestones.*.title.en').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.milestones.*.description.zh').optional().isString().trim().isLength({ max: 400 }),
  body('homepageContent.milestones.*.description.en').optional().isString().trim().isLength({ max: 400 }),

  body('homepageContent.team').optional().isArray({ max: 20 }),
  body('homepageContent.team.*.name.zh').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.team.*.name.en').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.team.*.role.zh').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.team.*.role.en').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.team.*.bio.zh').optional().isString().trim().isLength({ max: 500 }),
  body('homepageContent.team.*.bio.en').optional().isString().trim().isLength({ max: 500 }),
  body('homepageContent.team.*.image')
    .optional()
    .isString()
    .bail()
    .custom((value) => validateOptionalAssetPath(value))
    .withMessage('Invalid team image path'),

  body('homepageContent.cta').optional().isObject(),
  body('homepageContent.cta.title.zh').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.cta.title.en').optional().isString().trim().isLength({ max: 200 }),
  body('homepageContent.cta.description.zh').optional().isString().trim().isLength({ max: 500 }),
  body('homepageContent.cta.description.en').optional().isString().trim().isLength({ max: 500 }),
  body('homepageContent.cta.buttonText.zh').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.cta.buttonText.en').optional().isString().trim().isLength({ max: 120 }),
  body('homepageContent.cta.buttonLink')
    .optional()
    .custom((value) => validateOptionalLinkPath(value))
    .withMessage('Invalid CTA button link'),
  body('homepageContent.cta.backgroundImage')
    .optional()
    .isString()
    .bail()
    .custom((value) => validateOptionalAssetPath(value))
    .withMessage('Invalid CTA background image path'),

  (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    let row = db.prepare('SELECT * FROM settings LIMIT 1').get() as any;
    if (!row) {
      const id = uuidv4();
      db.prepare(`
        INSERT INTO settings (id, homepageContent)
        VALUES (?, ?)
      `).run(id, JSON.stringify(defaultHomepageContent));
      row = db.prepare('SELECT * FROM settings WHERE id = ?').get(id) as any;
    }

    const current = formatSettings(row);

    const siteName = req.body.siteName ?? current.siteName;
    const siteDescription = req.body.siteDescription ?? current.siteDescription;
    const contact = req.body.contact ?? current.contact;
    const social = req.body.social ?? current.social;
    const seo = req.body.seo ?? current.seo;
    const about = req.body.about ?? current.about;
    const banners = req.body.banners ?? current.banners;
    const homepageContent = req.body.homepageContent
      ? normalizeHomepageContent(req.body.homepageContent)
      : current.homepageContent;

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
        banners = ?, homepageContent = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      siteName?.zh ?? current.siteName.zh,
      siteName?.en ?? current.siteName.en,
      siteDescription?.zh ?? current.siteDescription.zh,
      siteDescription?.en ?? current.siteDescription.en,
      req.body.logo ?? current.logo ?? null,
      req.body.favicon ?? current.favicon ?? null,
      contact?.address?.zh ?? current.contact.address?.zh ?? null,
      contact?.address?.en ?? current.contact.address?.en ?? null,
      contact?.phone ?? current.contact.phone ?? null,
      contact?.email ?? current.contact.email ?? null,
      contact?.fax ?? current.contact.fax ?? null,
      social?.wechat ?? current.social.wechat ?? null,
      social?.weibo ?? current.social.weibo ?? null,
      social?.linkedin ?? current.social.linkedin ?? null,
      social?.facebook ?? current.social.facebook ?? null,
      social?.twitter ?? current.social.twitter ?? null,
      seo?.keywords?.zh ?? current.seo.keywords?.zh ?? null,
      seo?.keywords?.en ?? current.seo.keywords?.en ?? null,
      seo?.description?.zh ?? current.seo.description?.zh ?? null,
      seo?.description?.en ?? current.seo.description?.en ?? null,
      about?.zh ?? current.about.zh ?? null,
      about?.en ?? current.about.en ?? null,
      JSON.stringify(banners || []),
      JSON.stringify(homepageContent),
      new Date().toISOString(),
      row.id
    );

    const updatedRow = db.prepare('SELECT * FROM settings WHERE id = ?').get(row.id) as any;
    res.json({ success: true, data: formatSettings(updatedRow) });
  },
];
