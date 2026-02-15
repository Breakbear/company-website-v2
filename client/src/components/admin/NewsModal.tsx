import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { News, createNews, updateNews } from '../../services/news.service';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  news?: News | null;
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, onSave, news }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: { zh: '', en: '' },
    content: { zh: '', en: '' },
    summary: { zh: '', en: '' },
    category: '',
    coverImage: '',
    author: '',
    status: 'published',
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        summary: news.summary,
        category: news.category,
        coverImage: news.coverImage,
        author: news.author,
        status: news.status,
      });
    } else {
      setFormData({
        title: { zh: '', en: '' },
        content: { zh: '', en: '' },
        summary: { zh: '', en: '' },
        category: '',
        coverImage: '',
        author: '',
        status: 'published',
      });
    }
  }, [news, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        publishedAt: news?.publishedAt || new Date().toISOString(),
      };

      if (news) {
        await updateNews(news._id, data);
      } else {
        await createNews(data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {news
                ? (language === 'zh-CN' ? '编辑新闻' : 'Edit News')
                : (language === 'zh-CN' ? '添加新闻' : 'Add News')}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '新闻标题 (中文)' : 'Title (Chinese)'}
                </label>
                <input
                  type="text"
                  value={formData.title.zh}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: { ...prev.title, zh: e.target.value } }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '新闻标题 (英文)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '摘要 (中文)' : 'Summary (Chinese)'}
                </label>
                <textarea
                  value={formData.summary.zh}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: { ...prev.summary, zh: e.target.value } }))}
                  className="input-field min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '摘要 (英文)' : 'Summary (English)'}
                </label>
                <textarea
                  value={formData.summary.en}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: { ...prev.summary, en: e.target.value } }))}
                  className="input-field min-h-[80px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '分类' : 'Category'}
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '作者' : 'Author'}
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh-CN' ? '封面图片链接' : 'Cover Image URL'}
              </label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                className="input-field"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '内容 (中文)' : 'Content (Chinese)'}
                </label>
                <textarea
                  value={formData.content.zh}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, zh: e.target.value } }))}
                  className="input-field min-h-[200px]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-CN' ? '内容 (英文)' : 'Content (English)'}
                </label>
                <textarea
                  value={formData.content.en}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: { ...prev.content, en: e.target.value } }))}
                  className="input-field min-h-[200px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'zh-CN' ? '状态' : 'Status'}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="input-field"
              >
                <option value="published">{language === 'zh-CN' ? '已发布' : 'Published'}</option>
                <option value="draft">{language === 'zh-CN' ? '草稿' : 'Draft'}</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {language === 'zh-CN' ? '取消' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading
                  ? (language === 'zh-CN' ? '保存中...' : 'Saving...')
                  : (language === 'zh-CN' ? '保存' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
