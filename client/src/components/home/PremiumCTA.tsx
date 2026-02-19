import React from 'react';
import { Link } from 'react-router-dom';
import type { HomepageCta } from '../../services/settings.service';

interface PremiumCTAProps {
  cta: HomepageCta;
  language: 'zh-CN' | 'en-US';
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ cta, language }) => {
  return (
    <section className="section-industrial pb-20">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-3xl border border-industrial-700/60">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${cta.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,10,18,0.95),rgba(17,22,33,0.85),rgba(212,175,55,0.25))]" />
          <div className="relative px-6 py-14 sm:px-10 md:px-14">
            <p className="section-kicker">{language === 'zh-CN' ? '联系合作' : 'Start Collaboration'}</p>
            <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
              {language === 'zh-CN' ? cta.title.zh : cta.title.en}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-industrial-100">
              {language === 'zh-CN' ? cta.description.zh : cta.description.en}
            </p>
            <div className="mt-8">
              <Link to={cta.buttonLink} className="btn-primary">
                {language === 'zh-CN' ? cta.buttonText.zh : cta.buttonText.en}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumCTA;
