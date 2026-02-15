import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getProduct } from '../services/product.service';
import type { Product } from '../services/product.service';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await getProduct(id!);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="large" className="py-24" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20">
        <div className="container-custom py-24 text-center">
          <p className="text-gray-500">{t('products.noResults')}</p>
          <Link to="/products" className="btn-primary mt-4">
            {t('products.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  const name = language === 'zh-CN' ? product.name.zh : product.name.en;
  const description = language === 'zh-CN' ? product.description.zh : product.description.en;

  return (
    <div className="pt-20">
      <div className="container-custom py-12">
        <Link
          to="/products"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('products.backToList')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-w-4 aspect-h-3 mb-4 rounded-lg overflow-hidden bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {name}
            </h1>

            <p className="text-gray-600 text-lg mb-6">{description}</p>

            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('products.specifications')}
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between">
                        <dt className="text-gray-600">{spec.key}</dt>
                        <dd className="text-gray-900 font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn-primary flex-1 text-center">
                {t('products.inquiry')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
