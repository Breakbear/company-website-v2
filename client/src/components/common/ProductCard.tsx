import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../services/product.service';
import { buildUnsplashSrcSet, optimizeImageUrl } from '../../utils/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useLanguage();
  const imageUrl = product.images?.[0] || '';
  const optimizedImageUrl = optimizeImageUrl(imageUrl, { width: 800, quality: 74 });
  const imageSrcSet = buildUnsplashSrcSet(imageUrl, [480, 800, 1200], 74);

  return (
    <Link to={`/products/${product._id}`} className="industrial-card group block overflow-hidden bg-industrial-900/75">
      <div className="relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={optimizedImageUrl}
            srcSet={imageSrcSet}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            alt={language === 'zh-CN' ? product.name.zh : product.name.en}
            loading="lazy"
            decoding="async"
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-industrial-800">
            <span className="text-sm text-industrial-300">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-industrial-950/40 via-transparent to-transparent" />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-500/90 px-2.5 py-1 text-xs text-industrial-950">
            {language === 'zh-CN' ? '推荐' : 'Featured'}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-white">
          {language === 'zh-CN' ? product.name.zh : product.name.en}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-industrial-200">
          {language === 'zh-CN' ? product.description.zh : product.description.en}
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-primary-200 group-hover:text-primary-100">
          <span>{language === 'zh-CN' ? '查看详情' : 'View Details'}</span>
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
