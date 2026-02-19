export interface LocalizedText {
  zh: string;
  en: string;
}

export interface HomepageHeroSlide {
  image: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  ctaText: LocalizedText;
  ctaLink: string;
}

export interface StrengthMetric {
  value: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface BrandStoryContent {
  title: LocalizedText;
  description: LocalizedText;
  highlight: LocalizedText;
  image: string;
}

export interface MilestoneItem {
  year: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface TeamMember {
  name: LocalizedText;
  role: LocalizedText;
  bio: LocalizedText;
  image: string;
}

export interface HomepageCta {
  title: LocalizedText;
  description: LocalizedText;
  buttonText: LocalizedText;
  buttonLink: string;
  backgroundImage: string;
}

export interface HomepageContent {
  heroSlides: HomepageHeroSlide[];
  strengthMetrics: StrengthMetric[];
  brandStory: BrandStoryContent;
  milestones: MilestoneItem[];
  team: TeamMember[];
  cta: HomepageCta;
}

export const defaultHomepageContent: HomepageContent = {
  heroSlides: [
    {
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1920&auto=format&fit=crop',
      title: {
        zh: '工业级液压扳手系统解决方案',
        en: 'Industrial Hydraulic Torque Solutions',
      },
      subtitle: {
        zh: '面向风电、石化与重工场景，提供高精度扭矩控制与全生命周期服务',
        en: 'Precision torque control and full lifecycle services for wind, petrochemical, and heavy industries',
      },
      ctaText: {
        zh: '查看产品方案',
        en: 'Explore Product Solutions',
      },
      ctaLink: '/products',
    },
    {
      image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920&auto=format&fit=crop',
      title: {
        zh: '高可靠性，适配严苛工况',
        en: 'High Reliability for Harsh Conditions',
      },
      subtitle: {
        zh: '核心组件通过长周期疲劳测试，保障连续作业稳定输出',
        en: 'Core components are fatigue-tested for stable output in continuous operations',
      },
      ctaText: {
        zh: '了解技术优势',
        en: 'Discover Technical Advantages',
      },
      ctaLink: '/about',
    },
    {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop',
      title: {
        zh: '快速响应的工程服务网络',
        en: 'Fast-Response Engineering Service Network',
      },
      subtitle: {
        zh: '从选型、调试到维保，构建以现场效率为导向的交付体系',
        en: 'From selection and commissioning to maintenance, we deliver field-efficiency-driven service',
      },
      ctaText: {
        zh: '联系技术顾问',
        en: 'Contact a Technical Consultant',
      },
      ctaLink: '/contact',
    },
  ],
  strengthMetrics: [
    {
      value: '20+',
      label: { zh: '行业经验', en: 'Years in Industry' },
      description: { zh: '深耕液压扭矩技术与工业应用', en: 'Focused on torque technology and industrial applications' },
    },
    {
      value: '1200+',
      label: { zh: '项目交付', en: 'Projects Delivered' },
      description: { zh: '覆盖能源、化工、重工等关键行业', en: 'Serving energy, petrochemical, and heavy industry sectors' },
    },
    {
      value: '48h',
      label: { zh: '服务响应', en: 'Service Response' },
      description: { zh: '重点区域快速到场支持', en: 'Rapid onsite support in key regions' },
    },
  ],
  brandStory: {
    title: {
      zh: '以扭矩精度定义工业执行力',
      en: 'Defining Industrial Execution with Torque Precision',
    },
    description: {
      zh: '我们聚焦液压扳手系统的研发与应用，围绕“精度、稳定、效率”持续迭代产品平台，帮助客户在关键工序中实现可追溯、可复现、可规模化的紧固作业标准。',
      en: 'We specialize in R&D and application of hydraulic torque systems, continuously iterating around precision, stability, and efficiency to enable traceable and scalable tightening standards.',
    },
    highlight: {
      zh: '标准化交付体系 + 场景化工程服务',
      en: 'Standardized Delivery + Scenario-Based Engineering Service',
    },
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&auto=format&fit=crop',
  },
  milestones: [
    {
      year: '2008',
      title: { zh: '公司成立', en: 'Company Founded' },
      description: { zh: '建立液压紧固技术研发团队', en: 'Established core hydraulic fastening R&D team' },
    },
    {
      year: '2013',
      title: { zh: '行业拓展', en: 'Industry Expansion' },
      description: { zh: '进入风电与石化关键维护场景', en: 'Expanded into wind power and petrochemical maintenance scenarios' },
    },
    {
      year: '2018',
      title: { zh: '平台升级', en: 'Platform Upgrade' },
      description: { zh: '推出模块化液压扳手系统平台', en: 'Released modular hydraulic torque system platform' },
    },
    {
      year: '2023',
      title: { zh: '全球服务协同', en: 'Global Service Collaboration' },
      description: { zh: '形成多区域工程服务协作网络', en: 'Built a multi-region engineering service collaboration network' },
    },
  ],
  team: [
    {
      name: { zh: '刘工', en: 'Liu' },
      role: { zh: '首席技术官', en: 'Chief Technology Officer' },
      bio: {
        zh: '专注液压系统与扭矩控制算法，主导多代平台迭代。',
        en: 'Focused on hydraulic systems and torque control algorithms, leading multi-generation platform upgrades.',
      },
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=640&auto=format&fit=crop',
    },
    {
      name: { zh: '陈工', en: 'Chen' },
      role: { zh: '工程交付总监', en: 'Engineering Delivery Director' },
      bio: {
        zh: '负责复杂工况项目管理与现场交付标准化。',
        en: 'Leads project management and standardized field delivery for complex scenarios.',
      },
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&auto=format&fit=crop',
    },
    {
      name: { zh: '王工', en: 'Wang' },
      role: { zh: '服务支持负责人', en: 'Head of Service Support' },
      bio: {
        zh: '构建全国服务响应机制，保障关键节点快速恢复。',
        en: 'Built nationwide response mechanisms for rapid recovery at critical nodes.',
      },
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=640&auto=format&fit=crop',
    },
  ],
  cta: {
    title: { zh: '为你的关键紧固工序提供更高标准', en: 'Raise the Standard of Your Critical Fastening Operations' },
    description: {
      zh: '告诉我们你的工况与目标，我们将在 24 小时内给出技术建议与产品组合方案。',
      en: 'Share your operation context and goals. Our team will provide technical recommendations within 24 hours.',
    },
    buttonText: { zh: '获取专属方案', en: 'Get a Tailored Solution' },
    buttonLink: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a8f0?w=1920&auto=format&fit=crop',
  },
};

