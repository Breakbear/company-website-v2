import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import HeroSlider from '../components/common/HeroSlider';
import SectionTitle from '../components/common/SectionTitle';
import ProductCard from '../components/common/ProductCard';
import NewsCard from '../components/common/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getFeaturedProducts, Product } from '../services/product.service';
import { getLatestNews, News } from '../services/news.service';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, newsRes] = await Promise.all([
          getFeaturedProducts(),
          getLatestNews(3),
        ]);
        setProducts(productsRes.data);
        setNews(newsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const defaultSlides = [
    {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920',
      title: { zh: '专业贸易解决方案', en: 'Professional Trade Solutions' },
    },
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920',
      title: { zh: '全球供应链网络', en: 'Global Supply Chain Network' },
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920',
      title: { zh: '品质服务保障', en: 'Quality Service Guarantee' },
    },
  ];

  const features = [
    {
      icon: Shield,
      title: t('home.quality'),
      description: t('home.qualityDesc'),
    },
    {
      icon: Users,
      title: t('home.service'),
      description: t('home.serviceDesc'),
    },
    {
      icon: Globe,
      title: t('home.global'),
      description: t('home.globalDesc'),
    },
  ];

  return (
    <div>
      <HeroSlider slides={defaultSlides} />

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <SectionTitle
            title={t('home.whyChooseUs')}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <SectionTitle title={t('home.featuredProducts')} centered={false} />
            <Link
              to="/products"
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="large" className="py-12" />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-8 text-center md:hidden">
                <Link to="/products" className="btn-secondary">
                  {t('home.viewAll')}
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-12">
              {t('products.noResults')}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <SectionTitle title={t('home.latestNews')} centered={false} />
            <Link
              to="/news"
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="large" className="py-12" />
          ) : news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
              <div className="mt-8 text-center md:hidden">
                <Link to="/news" className="btn-secondary">
                  {t('home.viewAll')}
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-12">
              {t('news.noResults')}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('contact.getInTouch')}
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            {t('contact.getInTouchDesc')}
          </p>
          <Link to="/contact" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            {t('contact.form.submit')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
