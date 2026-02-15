import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Banner from '../components/common/Banner';
import NewsCard from '../components/common/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getNewsList } from '../services/news.service';
import type { News } from '../services/news.service';

const News: React.FC = () => {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { id: 'all', name: { zh: '全部', en: 'All' } },
    { id: 'company', name: { zh: '公司新闻', en: 'Company' } },
    { id: 'industry', name: { zh: '行业动态', en: 'Industry' } },
    { id: 'events', name: { zh: '活动资讯', en: 'Events' } },
  ];

  useEffect(() => {
    fetchNews();
  }, [currentPage, selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: 9,
      };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      const response = await getNewsList(params);
      setNews(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div>
      <Banner title={t('news.title')} size="small" />

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {language === 'zh-CN' ? category.name.zh : category.name.en}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner size="large" className="py-12" />
          ) : news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      {language === 'zh-CN' ? '上一页' : 'Previous'}
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      {language === 'zh-CN' ? '下一页' : 'Next'}
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">{language === 'zh-CN' ? '暂无新闻' : 'No news found'}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
