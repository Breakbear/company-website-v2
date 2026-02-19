import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/common/ProductCard';
import NewsCard from '../components/common/NewsCard';
import Hero from '../components/home/Hero';
import StrengthMetrics from '../components/home/StrengthMetrics';
import BrandStoryBlock from '../components/home/BrandStoryBlock';
import MilestoneTimeline from '../components/home/MilestoneTimeline';
import TeamGrid from '../components/home/TeamGrid';
import PremiumCTA from '../components/home/PremiumCTA';
import { getFeaturedProducts, Product } from '../services/product.service';
import { getLatestNews, News } from '../services/news.service';
import { defaultHomepageContent, getSettings, Settings } from '../services/settings.service';

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes, newsRes] = await Promise.all([
          getSettings(),
          getFeaturedProducts(),
          getLatestNews(3),
        ]);
        setSettings(settingsRes.data);
        setProducts(productsRes.data);
        setNews(newsRes.data);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const homepageContent = useMemo(
    () => settings?.homepageContent ?? defaultHomepageContent,
    [settings?.homepageContent]
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-industrial-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="bg-industrial-950 text-white">
      <Hero slides={homepageContent.heroSlides} language={language} />
      <StrengthMetrics metrics={homepageContent.strengthMetrics} language={language} />
      <BrandStoryBlock story={homepageContent.brandStory} language={language} />
      <MilestoneTimeline milestones={homepageContent.milestones} language={language} />
      <TeamGrid team={homepageContent.team} language={language} />

      <section className="section-industrial">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">{language === 'zh-CN' ? '产品精选' : 'Featured Products'}</p>
              <h2 className="section-heading">{t('home.featuredProducts')}</h2>
            </div>
            <Link to="/products" className="hidden items-center gap-2 text-sm text-primary-200 transition hover:text-primary-100 sm:inline-flex">
              {t('home.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-6 text-center sm:hidden">
                <Link to="/products" className="btn-ghost">
                  {t('home.viewAll')}
                </Link>
              </div>
            </>
          ) : (
            <p className="py-6 text-industrial-300">{t('products.noResults')}</p>
          )}
        </div>
      </section>

      <section className="section-industrial-muted">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">{language === 'zh-CN' ? '新闻动态' : 'Newsroom'}</p>
              <h2 className="section-heading">{t('home.latestNews')}</h2>
            </div>
            <Link to="/news" className="hidden items-center gap-2 text-sm text-primary-200 transition hover:text-primary-100 sm:inline-flex">
              {t('home.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {news.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
              <div className="mt-6 text-center sm:hidden">
                <Link to="/news" className="btn-ghost">
                  {t('home.viewAll')}
                </Link>
              </div>
            </>
          ) : (
            <p className="py-6 text-industrial-300">{t('news.noResults')}</p>
          )}
        </div>
      </section>

      <PremiumCTA cta={homepageContent.cta} language={language} />
    </div>
  );
};

export default Home;
