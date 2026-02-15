import React from 'react';
import { Target, Eye, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Banner from '../components/common/Banner';
import SectionTitle from '../components/common/SectionTitle';

const About: React.FC = () => {
  const { t, language } = useLanguage();

  const milestones = [
    { year: '2010', title: { zh: '公司成立', en: 'Company Founded' } },
    { year: '2013', title: { zh: '拓展海外市场', en: 'Expanded Overseas' } },
    { year: '2016', title: { zh: '建立全球供应链', en: 'Global Supply Chain' } },
    { year: '2019', title: { zh: '年营业额突破1亿', en: 'Revenue Exceeded 100M' } },
    { year: '2022', title: { zh: '数字化转型', en: 'Digital Transformation' } },
    { year: '2024', title: { zh: '持续发展', en: 'Continued Growth' } },
  ];

  const values = [
    {
      icon: Target,
      title: t('about.mission'),
      description: t('about.missionDesc'),
    },
    {
      icon: Eye,
      title: t('about.vision'),
      description: t('about.visionDesc'),
    },
    {
      icon: Heart,
      title: t('about.values'),
      description: t('about.valuesDesc'),
    },
  ];

  const team = [
    {
      name: '张三',
      title: { zh: '首席执行官', en: 'CEO' },
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    },
    {
      name: '李四',
      title: { zh: '运营总监', en: 'COO' },
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    },
    {
      name: '王五',
      title: { zh: '技术总监', en: 'CTO' },
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    },
    {
      name: '赵六',
      title: { zh: '市场总监', en: 'CMO' },
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    },
  ];

  return (
    <div>
      <Banner
        title={t('about.title')}
        size="small"
      />

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {t('about.companyIntro')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('about.companyDesc')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {language === 'zh-CN'
                  ? '我们秉承"诚信为本、客户至上"的经营理念，不断优化产品结构，提升服务质量，为客户创造更大的价值。'
                  : 'We adhere to the business philosophy of "Integrity First, Customer Supreme", continuously optimizing our product structure and improving service quality to create greater value for our customers.'}
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
                alt="Office"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold">14+</div>
                <div className="text-sm">{language === 'zh-CN' ? '年行业经验' : 'Years Experience'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <SectionTitle title={t('about.ourHistory')} />
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200 hidden md:block" />
            <div className="space-y-8 md:space-y-0">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm inline-block">
                      <div className="text-primary-600 font-bold text-xl mb-1">
                        {milestone.year}
                      </div>
                      <div className="text-gray-900 font-medium">
                        {language === 'zh-CN' ? milestone.title.zh : milestone.title.en}
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <SectionTitle title={t('about.ourValues')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <SectionTitle title={t('about.ourTeam')} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'zh-CN' ? member.title.zh : member.title.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
