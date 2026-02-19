import React from 'react';
import { Link } from 'react-router-dom';
import type { HomepageCta } from '../../services/settings.service';
import { optimizeImageUrl } from '../../utils/image';

interface PremiumCTAProps {
  cta: HomepageCta;
  language: 'zh-CN' | 'en-US';
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ cta, language }) => {
  const backgroundImageUrl = optimizeImageUrl(cta.backgroundImage, { width: 1920, quality: 72 });

  return (
    <section className="section-industrial pb-20">
      <div className="container-custom">
        <div className="industrial-card angle-cut relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,10,18,0.95),rgba(17,22,33,0.86),rgba(244,139,0,0.28))]" />
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
