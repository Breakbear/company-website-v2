import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HomepageHeroSlide } from '../../services/settings.service';
import { optimizeImageUrl } from '../../utils/image';

interface HeroProps {
  slides: HomepageHeroSlide[];
  language: 'zh-CN' | 'en-US';
}

const Hero: React.FC<HeroProps> = ({ slides, language }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[activeIndex];
  const heroImageUrl = optimizeImageUrl(currentSlide.image, { width: 1920, quality: 72 });

  useEffect(() => {
    const nextSlide = slides[(activeIndex + 1) % slides.length];
    if (!nextSlide) {
      return;
    }

    const preloaded = new Image();
    preloaded.src = optimizeImageUrl(nextSlide.image, { width: 1920, quality: 72 });
  }, [activeIndex, slides]);

  return (
    <section className="relative isolate min-h-[82vh] overflow-hidden border-b border-industrial-800/80">
      <div className="absolute inset-0 -z-20 bg-industrial-950" />
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-industrial-950/95 via-industrial-950/70 to-industrial-900/50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(244,139,0,0.24),transparent_33%),radial-gradient(circle_at_82%_72%,rgba(255,188,87,0.18),transparent_38%)]" />
      <div className="grid-overlay absolute inset-0 -z-10 opacity-30" />
      <div className="noise-overlay absolute inset-0 -z-10 opacity-35" />

      <div className="container-custom relative flex min-h-[82vh] items-center py-24">
        <div className="max-w-3xl animate-[fade-in-up_700ms_ease-out]">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="panel-stripe block h-2 w-14 rounded-sm" />
            <p className="inline-flex items-center rounded-sm border border-primary-400/60 bg-primary-500/15 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-primary-100">
              {language === 'zh-CN' ? '海拓斯特 Haituoste' : 'HAITUOSTE TORQUE'}
            </p>
            <span className="panel-stripe block h-2 w-8 rounded-sm" />
          </div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-industrial-200">
            {language === 'zh-CN' ? '工业液压扭矩系统解决方案' : 'Industrial Hydraulic Torque Solutions'}
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {language === 'zh-CN' ? currentSlide.title.zh : currentSlide.title.en}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-industrial-100 sm:text-lg">
            {language === 'zh-CN' ? currentSlide.subtitle.zh : currentSlide.subtitle.en}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to={currentSlide.ctaLink} className="btn-primary">
              {language === 'zh-CN' ? currentSlide.ctaText.zh : currentSlide.ctaText.en}
            </Link>
            <Link to="/contact" className="btn-ghost">
              {language === 'zh-CN' ? '申请技术评估' : 'Request Engineering Review'}
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-8">
          <div className="container-custom flex items-center justify-between">
            <div className="pointer-events-auto flex gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-12 bg-primary-300' : 'w-6 bg-white/35 hover:bg-white/65'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="pointer-events-auto hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                className="rounded-full border border-white/25 bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
                className="rounded-full border border-white/25 bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
