import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/products', label: t('nav.products') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="border-t border-industrial-800 bg-industrial-950 text-industrial-200">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl text-white">
              {language === 'zh-CN' ? '海拓斯特液压科技' : 'HAITUOSTE TORQUE TECHNOLOGIES'}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-industrial-300">{t('footer.companyDesc')}</p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.18em] text-primary-200">{t('footer.quickLinks')}</h4>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-industrial-200 transition hover:text-primary-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.18em] text-primary-200">{t('footer.contactUs')}</h4>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary-200" />
                <span>{language === 'zh-CN' ? '中国上海市浦东新区张江工业园' : 'Zhangjiang Industrial Park, Pudong, Shanghai, China'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-200" />
                <span>+86 21 5033 8899</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-200" />
                <span>service@haituoste.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-industrial-800 pt-6 text-sm text-industrial-400">
          <p>
            © {currentYear} {language === 'zh-CN' ? '海拓斯特液压科技' : 'HAITUOSTE TORQUE TECHNOLOGIES'}.
            {' '}
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
