import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Newspaper, Mail, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../services/product.service';
import { getNewsList } from '../../services/news.service';
import { getContacts } from '../../services/contact.service';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    news: 0,
    contacts: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const [productsRes, newsRes, contactsRes] = await Promise.all([
        getProducts({ limit: 1 }),
        getNewsList({ limit: 1 }),
        getContacts({ limit: 100 }),
      ]);

      const unreadCount = contactsRes.data.filter((c) => c.status === 'unread').length;

      setStats({
        products: productsRes.pagination.total,
        news: newsRes.pagination.total,
        contacts: contactsRes.pagination.total,
        unreadContacts: unreadCount,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('admin.totalProducts'),
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: t('admin.totalNews'),
      value: stats.news,
      icon: Newspaper,
      color: 'bg-green-500',
    },
    {
      title: t('admin.totalContacts'),
      value: stats.contacts,
      icon: Mail,
      color: 'bg-purple-500',
    },
    {
      title: t('admin.unreadContacts'),
      value: stats.unreadContacts,
      icon: Eye,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t('admin.welcome')}, {user?.username}!
      </h1>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {t('admin.overview')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === 'zh-CN' ? '快速操作' : 'Quick Actions'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package className="w-5 h-5 mr-2" />
            {language === 'zh-CN' ? '管理产品' : 'Manage Products'}
          </button>
          <button
            onClick={() => navigate('/admin/news')}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Newspaper className="w-5 h-5 mr-2" />
            {language === 'zh-CN' ? '管理新闻' : 'Manage News'}
          </button>
          <button
            onClick={() => navigate('/admin/contacts')}
            className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            {language === 'zh-CN' ? '查看留言' : 'View Messages'}
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-5 h-5 mr-2" />
            {language === 'zh-CN' ? '系统设置' : 'Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
