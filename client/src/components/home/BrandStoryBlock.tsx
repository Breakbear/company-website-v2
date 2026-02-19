import React from 'react';
import type { BrandStoryContent } from '../../services/settings.service';

interface BrandStoryBlockProps {
  story: BrandStoryContent;
  language: 'zh-CN' | 'en-US';
}

const BrandStoryBlock: React.FC<BrandStoryBlockProps> = ({ story, language }) => {
  return (
    <section className="section-industrial-muted">
      <div className="container-custom grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="industrial-card angle-cut relative overflow-hidden">
          <img src={story.image} alt={language === 'zh-CN' ? story.title.zh : story.title.en} className="h-[360px] w-full object-cover md:h-[420px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-industrial-950/70 via-transparent to-transparent" />
        </div>
        <div>
          <p className="section-kicker">{language === 'zh-CN' ? '品牌故事' : 'Brand Story'}</p>
          <h2 className="section-heading">{language === 'zh-CN' ? story.title.zh : story.title.en}</h2>
          <p className="mt-5 text-base leading-relaxed text-industrial-200">
            {language === 'zh-CN' ? story.description.zh : story.description.en}
          </p>
          <div className="mt-6 inline-flex rounded-sm border border-primary-400/50 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            {language === 'zh-CN' ? story.highlight.zh : story.highlight.en}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStoryBlock;
