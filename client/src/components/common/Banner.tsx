import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  size?: 'small' | 'medium' | 'large';
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  showCta = false,
  ctaText = 'Learn More',
  ctaLink = '/about',
  size = 'large',
}) => {
  const heightClasses = {
    small: 'h-64 md:h-80',
    medium: 'h-80 md:h-96',
    large: 'h-screen max-h-[700px] min-h-[500px]',
  };

  return (
    <section
      className={`relative ${heightClasses[size]} flex items-center justify-center overflow-hidden`}
    >
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {showCta && (
          <Link
            to={ctaLink}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/70" />
      </div>
    </section>
  );
};

const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default Banner;
