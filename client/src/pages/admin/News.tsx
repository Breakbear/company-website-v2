import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getNewsList, deleteNews } from '../../services/news.service';
import type { News } from '../../services/news.service';
import NewsModal from '../../components/admin/NewsModal';

const AdminNews: React.FC = () => {
  const { language } = useLanguage();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await getNewsList({ page: currentPage, limit: 10 });
      setNews(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'zh-CN' ? '确定要删除此新闻吗？' : 'Are you sure you want to delete this news?')) {
      return;
    }
    try {
      await deleteNews(id);
      fetchNews();
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'zh-CN' ? 'zh-CN' : 'en-US');
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleEditNews = (item: News) => {
    setEditingNews(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          {language === 'zh-CN' ? '新闻管理' : 'News Management'}
        </h1>
        <button onClick={handleAddNews} className="btn-primary inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          {language === 'zh-CN' ? '添加新闻' : 'Add News'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'zh-CN' ? '标题' : 'Title'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'zh-CN' ? '分类' : 'Category'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'zh-CN' ? '浏览量' : 'Views'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'zh-CN' ? '发布日期' : 'Published'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === 'zh-CN' ? '操作' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {news.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                              <Newspaper className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="ml-4">
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {language === 'zh-CN' ? item.title.zh : item.title.en}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{item.category}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-gray-600">
                          <Eye className="w-4 h-4 mr-1" />
                          {item.views}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {formatDate(item.publishedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEditNews(item)} className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-4 py-3 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {language === 'zh-CN' ? `第 ${currentPage} 页，共 ${totalPages} 页` : `Page ${currentPage} of ${totalPages}`}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                  >
                    {language === 'zh-CN' ? '上一页' : 'Previous'}
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                  >
                    {language === 'zh-CN' ? '下一页' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={fetchNews}
        news={editingNews}
      />
    </div>
  );
};

const Newspaper = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

export default AdminNews;
