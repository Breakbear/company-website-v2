import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { News } from '../../services/news.service';

interface NewsCardProps {
  news: News;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'zh-CN' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/news/${news._id}`} className="card group">
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        {news.coverImage ? (
          <img
            src={news.coverImage}
            alt={language === 'zh-CN' ? news.title.zh : news.title.en}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white text-lg font-medium">
              {language === 'zh-CN' ? '新闻' : 'News'}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(news.publishedAt)}</span>
          {news.category && (
            <>
              <span className="mx-2">•</span>
              <span>{news.category}</span>
            </>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {language === 'zh-CN' ? news.title.zh : news.title.en}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {language === 'zh-CN' ? news.summary?.zh || news.content.zh : news.summary?.en || news.content.en}
        </p>
        <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
          <span>{language === 'zh-CN' ? '阅读更多' : 'Read More'}</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
