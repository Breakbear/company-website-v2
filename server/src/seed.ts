import db from './config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const createAdminUser = async () => {
  const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@example.com');
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const id = uuidv4();
    db.prepare(`
      INSERT INTO users (id, username, email, password, role, isActive)
      VALUES (?, 'admin', 'admin@example.com', ?, 'admin', 1)
    `).run(id, hashedPassword);
    console.log('Admin user created: admin@example.com / admin123');
  }
};

const createSampleProducts = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
  if (count.count === 0) {
    const products = [
      {
        id: uuidv4(),
        nameZh: '电子产品A', nameEn: 'Electronics A',
        descZh: '高品质电子产品，性能卓越', descEn: 'High quality electronics with excellent performance',
        category: 'electronics', images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']),
        specs: JSON.stringify([{ key: '型号', value: 'EA-001' }, { key: '功率', value: '100W' }]),
        featured: 1, status: 'active'
      },
      {
        id: uuidv4(),
        nameZh: '机械设备B', nameEn: 'Machinery B',
        descZh: '工业级机械设备，稳定可靠', descEn: 'Industrial grade machinery, stable and reliable',
        category: 'machinery', images: JSON.stringify(['https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800']),
        specs: JSON.stringify([{ key: '型号', value: 'MB-002' }, { key: '重量', value: '500kg' }]),
        featured: 1, status: 'active'
      },
      {
        id: uuidv4(),
        nameZh: '消费品C', nameEn: 'Consumer Goods C',
        descZh: '优质消费品，品质保证', descEn: 'Premium consumer goods with quality guarantee',
        category: 'consumer', images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800']),
        specs: JSON.stringify([{ key: '材质', value: '不锈钢' }, { key: '尺寸', value: '10x10x5cm' }]),
        featured: 0, status: 'active'
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO products (id, nameZh, nameEn, descriptionZh, descriptionEn, category, images, specifications, featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of products) {
      stmt.run(p.id, p.nameZh, p.nameEn, p.descZh, p.descEn, p.category, p.images, p.specs, p.featured, p.status);
    }
    console.log('Sample products created');
  }
};

const createSampleNews = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM news').get() as any;
  if (count.count === 0) {
    const newsItems = [
      {
        id: uuidv4(),
        titleZh: '公司成功参加2024年国际贸易展览会', titleEn: 'Company Successfully Attends 2024 International Trade Exhibition',
        contentZh: '我司在2024年国际贸易展览会上取得了巨大成功，与多家国际企业建立了合作关系。展会期间，我们展示了最新的产品系列，获得了参观者的广泛好评。',
        contentEn: 'Our company achieved great success at the 2024 International Trade Exhibition, establishing partnerships with multiple international enterprises.',
        summaryZh: '公司参加2024年国际贸易展览会，取得圆满成功',
        summaryEn: 'Company attends 2024 International Trade Exhibition with great success',
        category: 'company', coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', author: 'Admin'
      },
      {
        id: uuidv4(),
        titleZh: '行业趋势：全球贸易数字化转型', titleEn: 'Industry Trend: Digital Transformation in Global Trade',
        contentZh: '随着科技的发展，全球贸易正在经历数字化转型。电子商务、区块链技术和人工智能正在改变传统的贸易模式，为企业带来新的机遇和挑战。',
        contentEn: 'With the development of technology, global trade is undergoing digital transformation.',
        summaryZh: '分析全球贸易数字化转型的趋势和影响',
        summaryEn: 'Analyzing the trends and impacts of digital transformation in global trade',
        category: 'industry', coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', author: 'Admin'
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO news (id, titleZh, titleEn, contentZh, contentEn, summaryZh, summaryEn, category, coverImage, author, status, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
    `);

    const now = new Date().toISOString();
    for (const n of newsItems) {
      stmt.run(n.id, n.titleZh, n.titleEn, n.contentZh, n.contentEn, n.summaryZh, n.summaryEn, n.category, n.coverImage, n.author, now);
    }
    console.log('Sample news created');
  }
};

const createSettings = () => {
  const existing = db.prepare('SELECT * FROM settings LIMIT 1').get();
  if (!existing) {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO settings (id, siteNameZh, siteNameEn, siteDescriptionZh, siteDescriptionEn, addressZh, addressEn, phone, email)
      VALUES (?, '贸易公司', 'Trade Company', '专业的贸易服务提供商', 'Professional trade service provider', 
              '中国上海市浦东新区', 'Pudong New Area, Shanghai, China', '+86 21 1234 5678', 'info@company.com')
    `).run(id);
    console.log('Settings created');
  }
};

const seedDatabase = async () => {
  console.log('Seeding database...');
  
  await createAdminUser();
  createSampleProducts();
  createSampleNews();
  createSettings();
  
  console.log('Database seeded successfully!');
};

seedDatabase();
