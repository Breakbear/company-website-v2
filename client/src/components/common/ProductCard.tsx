import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../services/product.service';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language } = useLanguage();

  return (
    <Link to={`/products/${product._id}`} className="card group">
      <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={language === 'zh-CN' ? product.name.zh : product.name.en}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {language === 'zh-CN' ? '推荐' : 'Featured'}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {language === 'zh-CN' ? product.name.zh : product.name.en}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {language === 'zh-CN' ? product.description.zh : product.description.en}
        </p>
        <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
          <span>{language === 'zh-CN' ? '查看详情' : 'View Details'}</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
