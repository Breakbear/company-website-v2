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
    <Link to={`/news/${news._id}`} className="industrial-card group block overflow-hidden bg-industrial-900/75">
      <div className="relative overflow-hidden">
        {news.coverImage ? (
          <img
            src={news.coverImage}
            alt={language === 'zh-CN' ? news.title.zh : news.title.en}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-industrial-800 to-industrial-950">
            <span className="text-lg font-medium text-primary-100">
              {language === 'zh-CN' ? '新闻' : 'News'}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-industrial-950/35 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center text-sm text-industrial-300">
          <Calendar className="mr-1 h-4 w-4" />
          <span>{formatDate(news.publishedAt)}</span>
          {news.category && (
            <>
              <span className="mx-2">•</span>
              <span>{news.category}</span>
            </>
          )}
        </div>
        <h3 className="line-clamp-2 text-lg font-semibold text-white">
          {language === 'zh-CN' ? news.title.zh : news.title.en}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-industrial-200">
          {language === 'zh-CN' ? news.summary?.zh || news.content.zh : news.summary?.en || news.content.en}
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-primary-200 group-hover:text-primary-100">
          <span>{language === 'zh-CN' ? '阅读更多' : 'Read More'}</span>
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
