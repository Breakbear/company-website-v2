import db from './config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { defaultHomepageContent } from './config/homepage-content';

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
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (count.count === 0) {
    const products = [
      {
        id: uuidv4(),
        nameZh: '中空液压扳手 HTX-600',
        nameEn: 'Hollow Hydraulic Wrench HTX-600',
        descZh: '适用于风机塔筒、法兰螺栓等高强度紧固场景，兼顾精度与效率。',
        descEn: 'Designed for high-load fastening scenarios such as wind tower and flange bolts with precision and speed.',
        category: 'hydraulic-wrench',
        images: JSON.stringify(['https://images.unsplash.com/photo-1581093450021-4a7360e9a8f0?w=800']),
        specs: JSON.stringify([
          { key: '扭矩范围', value: '185 - 6000 Nm' },
          { key: '驱动方式', value: '中空驱动' },
        ]),
        featured: 1,
        status: 'active',
      },
      {
        id: uuidv4(),
        nameZh: '驱动液压扳手 DTX-280',
        nameEn: 'Square Drive Hydraulic Wrench DTX-280',
        descZh: '模块化驱动头设计，适配石化检修等复杂工况。',
        descEn: 'Modular square-drive architecture for petrochemical maintenance and complex operations.',
        category: 'hydraulic-wrench',
        images: JSON.stringify(['https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800']),
        specs: JSON.stringify([
          { key: '扭矩范围', value: '210 - 28000 Nm' },
          { key: '适配驱动轴', value: '3/4"-2 1/2"' },
        ]),
        featured: 1,
        status: 'active',
      },
      {
        id: uuidv4(),
        nameZh: '智能液压泵站 P3000',
        nameEn: 'Smart Hydraulic Pump P3000',
        descZh: '支持多工具并联控制，内置压力监测与数据追溯能力。',
        descEn: 'Supports multi-tool control with integrated pressure monitoring and traceability.',
        category: 'hydraulic-pump',
        images: JSON.stringify(['https://images.unsplash.com/photo-1498084393753-b411b2d26b34?w=800']),
        specs: JSON.stringify([
          { key: '工作压力', value: '700 bar' },
          { key: '控制方式', value: '触控 + 远程' },
        ]),
        featured: 1,
        status: 'active',
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO products (id, nameZh, nameEn, descriptionZh, descriptionEn, category, images, specifications, featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of products) {
      stmt.run(
        product.id,
        product.nameZh,
        product.nameEn,
        product.descZh,
        product.descEn,
        product.category,
        product.images,
        product.specs,
        product.featured,
        product.status
      );
    }
    console.log('Sample products created');
  }
};

const createSampleNews = () => {
  const count = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
  if (count.count === 0) {
    const newsItems = [
      {
        id: uuidv4(),
        titleZh: '液压扳手平台完成风电检修批量交付',
        titleEn: 'Hydraulic Torque Platform Delivered for Wind Maintenance Projects',
        contentZh:
          '本季度，公司完成多台套液压扳手与泵站系统在沿海风电场的批量部署。项目采用标准化工艺包，实现紧固过程参数可追溯，显著提升检修效率。',
        contentEn:
          'This quarter we completed a batch deployment of hydraulic torque tools and pump systems in coastal wind farms with traceable fastening parameters and improved maintenance efficiency.',
        summaryZh: '风电场景批量交付完成，检修效率与作业一致性显著提升。',
        summaryEn: 'Batch delivery completed for wind projects with higher efficiency and consistency.',
        category: 'company',
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        author: 'Admin',
      },
      {
        id: uuidv4(),
        titleZh: '重载螺栓紧固进入“数据化验证”阶段',
        titleEn: 'Heavy-Bolt Fastening Moves into Data-Validated Operations',
        contentZh:
          '随着安全与合规要求提高，工业紧固正从“经验驱动”转向“数据驱动”。通过记录压力、扭矩与作业流程参数，企业可实现检修质量闭环与责任追溯。',
        contentEn:
          'As safety and compliance requirements rise, industrial fastening is moving from experience-driven work to data-driven validation by recording pressure, torque, and execution traces.',
        summaryZh: '工业紧固正加速数据化，作业质量闭环成为主流趋势。',
        summaryEn: 'Data-driven quality loops are becoming the mainstream in industrial fastening.',
        category: 'industry',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        author: 'Admin',
      },
    ];

    const stmt = db.prepare(`
      INSERT INTO news (id, titleZh, titleEn, contentZh, contentEn, summaryZh, summaryEn, category, coverImage, author, status, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
    `);

    const now = new Date().toISOString();
    for (const item of newsItems) {
      stmt.run(
        item.id,
        item.titleZh,
        item.titleEn,
        item.contentZh,
        item.contentEn,
        item.summaryZh,
        item.summaryEn,
        item.category,
        item.coverImage,
        item.author,
        now
      );
    }
    console.log('Sample news created');
  }
};

const createSettings = () => {
  const existing = db.prepare('SELECT * FROM settings LIMIT 1').get();
  if (!existing) {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO settings (
        id, siteNameZh, siteNameEn, siteDescriptionZh, siteDescriptionEn,
        addressZh, addressEn, phone, email, homepageContent
      )
      VALUES (
        ?, '海拓斯特液压科技', 'Haituoste Torque Technologies',
        '高可靠工业级液压扭矩解决方案', 'Reliable industrial hydraulic torque solutions',
        '中国上海市浦东新区张江工业园', 'Zhangjiang Industrial Park, Pudong, Shanghai, China',
        '+86 21 5033 8899', 'service@haituoste.com', ?
      )
    `).run(id, JSON.stringify(defaultHomepageContent));
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
