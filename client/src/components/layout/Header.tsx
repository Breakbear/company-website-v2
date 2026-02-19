import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, Wrench, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/products', label: t('nav.products') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-industrial-700/80 bg-industrial-950/95 backdrop-blur-lg'
          : 'border-industrial-800/50 bg-industrial-950/75 backdrop-blur'
      }`}
    >
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link to="/" className="group inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-400/50 bg-primary-500/15 text-primary-200">
              <Wrench className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-lg leading-none text-white md:text-xl">
                {language === 'zh-CN' ? '海岳液压扳手' : 'HydraTorque'}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-industrial-300">
                {language === 'zh-CN' ? '工业紧固系统' : 'Industrial Fastening Systems'}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  location.pathname === link.path ? 'text-primary-200' : 'text-industrial-100 hover:text-primary-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
              className="inline-flex items-center gap-1 rounded-full border border-industrial-700 bg-industrial-900/70 px-3 py-1.5 text-xs text-industrial-100 transition hover:border-primary-400/60 hover:text-primary-100"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'zh-CN' ? 'EN' : '中文'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-md border border-industrial-700 bg-industrial-900/70 p-2 text-industrial-100 transition hover:text-primary-100 md:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-industrial-800/80 bg-industrial-950 md:hidden">
          <nav className="container-custom flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-md px-3 py-2 text-sm ${
                  location.pathname === link.path ? 'bg-industrial-800 text-primary-100' : 'text-industrial-100 hover:bg-industrial-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
