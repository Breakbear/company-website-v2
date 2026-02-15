import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getSettings, updateSettings } from '../../services/settings.service';
import type { Settings } from '../../services/settings.service';

const AdminSettings: React.FC = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateSettings(settings);
      setMessage(language === 'zh-CN' ? '保存成功！' : 'Saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage(language === 'zh-CN' ? '保存失败' : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (path: string, value: string) => {
    setSettings((prev) => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: Record<string, unknown> = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Record<string, unknown>;
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'zh-CN' ? '系统设置' : 'System Settings'}
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary inline-flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving
            ? language === 'zh-CN'
              ? '保存中...'
              : 'Saving...'
            : language === 'zh-CN'
            ? '保存设置'
            : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('成功') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'zh-CN' ? '基本信息' : 'Basic Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                {language === 'zh-CN' ? '网站名称 (中文)' : 'Site Name (Chinese)'}
              </label>
              <input
                type="text"
                value={settings.siteName?.zh || ''}
                onChange={(e) => handleChange('siteName.zh', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                {language === 'zh-CN' ? '网站名称 (英文)' : 'Site Name (English)'}
              </label>
              <input
                type="text"
                value={settings.siteName?.en || ''}
                onChange={(e) => handleChange('siteName.en', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">
                {language === 'zh-CN' ? '网站描述 (中文)' : 'Site Description (Chinese)'}
              </label>
              <textarea
                value={settings.siteDescription?.zh || ''}
                onChange={(e) => handleChange('siteDescription.zh', e.target.value)}
                rows={3}
                className="input-field resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">
                {language === 'zh-CN' ? '网站描述 (英文)' : 'Site Description (English)'}
              </label>
              <textarea
                value={settings.siteDescription?.en || ''}
                onChange={(e) => handleChange('siteDescription.en', e.target.value)}
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'zh-CN' ? '联系方式' : 'Contact Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                {language === 'zh-CN' ? '公司地址 (中文)' : 'Address (Chinese)'}
              </label>
              <input
                type="text"
                value={settings.contact?.address?.zh || ''}
                onChange={(e) => handleChange('contact.address.zh', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                {language === 'zh-CN' ? '公司地址 (英文)' : 'Address (English)'}
              </label>
              <input
                type="text"
                value={settings.contact?.address?.en || ''}
                onChange={(e) => handleChange('contact.address.en', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                {language === 'zh-CN' ? '联系电话' : 'Phone'}
              </label>
              <input
                type="text"
                value={settings.contact?.phone || ''}
                onChange={(e) => handleChange('contact.phone', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                {language === 'zh-CN' ? '电子邮箱' : 'Email'}
              </label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) => handleChange('contact.email', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'zh-CN' ? '社交媒体' : 'Social Media'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">WeChat</label>
              <input
                type="text"
                value={settings.social?.wechat || ''}
                onChange={(e) => handleChange('social.wechat', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Weibo</label>
              <input
                type="text"
                value={settings.social?.weibo || ''}
                onChange={(e) => handleChange('social.weibo', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">LinkedIn</label>
              <input
                type="text"
                value={settings.social?.linkedin || ''}
                onChange={(e) => handleChange('social.linkedin', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Facebook</label>
              <input
                type="text"
                value={settings.social?.facebook || ''}
                onChange={(e) => handleChange('social.facebook', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
