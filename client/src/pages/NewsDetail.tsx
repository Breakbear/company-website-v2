import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getNews } from '../services/news.service';
import type { News } from '../services/news.service';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await getNews(id!);
      setNews(response.data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size="large" className="py-24" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="pt-20">
        <div className="container-custom py-24 text-center">
          <p className="text-gray-500">{language === 'zh-CN' ? '新闻不存在' : 'News not found'}</p>
          <Link to="/news" className="btn-primary mt-4">
            {t('news.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  const title = language === 'zh-CN' ? news.title.zh : news.title.en;
  const content = language === 'zh-CN' ? news.content.zh : news.content.en;

  return (
    <div className="pt-20">
      <article className="py-12">
        <div className="container-custom">
          <Link
            to="/news"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('news.backToList')}
          </Link>

          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(news.publishedAt)}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{news.author}</span>
                </div>
                {news.category && (
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                    {news.category}
                  </span>
                )}
              </div>
            </header>

            {news.coverImage && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={news.coverImage}
                  alt={title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;
