import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  defaultHomepageContent,
  getSettings,
  HomepageContent,
  updateSettings,
} from '../../services/settings.service';
import type { Settings } from '../../services/settings.service';

const cloneHomepageContent = (): HomepageContent =>
  typeof structuredClone === 'function'
    ? structuredClone(defaultHomepageContent)
    : (JSON.parse(JSON.stringify(defaultHomepageContent)) as HomepageContent);

const parsePath = (path: string): Array<string | number> =>
  path.split('.').map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));

const updateAtPath = (source: unknown, path: string, updater: (current: unknown) => unknown): unknown => {
  const segments = parsePath(path);

  const patch = (current: unknown, depth: number): unknown => {
    if (depth >= segments.length) {
      return updater(current);
    }

    const segment = segments[depth];
    if (typeof segment === 'number') {
      const nextArray = Array.isArray(current) ? [...current] : [];
      nextArray[segment] = patch(nextArray[segment], depth + 1);
      return nextArray;
    }

    const nextObject: Record<string, unknown> =
      current && typeof current === 'object' && !Array.isArray(current)
        ? { ...(current as Record<string, unknown>) }
        : {};
    nextObject[segment] = patch(nextObject[segment], depth + 1);
    return nextObject;
  };

  return patch(source, 0);
};

const sectionCardClass = 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm';
type HomePanel = 'hero' | 'metrics' | 'story' | 'milestones' | 'team' | 'cta';

const AdminSettings: React.FC = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<Partial<Settings>>(() => ({
    homepageContent: cloneHomepageContent(),
  }));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [activeHomePanel, setActiveHomePanel] = useState<HomePanel>('hero');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        setSettings({
          ...response.data,
          homepageContent: response.data.homepageContent ?? cloneHomepageContent(),
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const homepageContent = settings.homepageContent as HomepageContent;
  const homePanels: Array<{ key: HomePanel; label: string }> = [
    { key: 'hero', label: language === 'zh-CN' ? 'Hero 轮播' : 'Hero Slides' },
    { key: 'metrics', label: language === 'zh-CN' ? '企业实力' : 'Strength Metrics' },
    { key: 'story', label: language === 'zh-CN' ? '品牌故事' : 'Brand Story' },
    { key: 'milestones', label: language === 'zh-CN' ? '发展历程' : 'Milestones' },
    { key: 'team', label: language === 'zh-CN' ? '团队成员' : 'Team Members' },
    { key: 'cta', label: 'CTA' },
  ];

  const handleChange = (path: string, value: string) => {
    setSettings((prev) => updateAtPath(prev, path, () => value) as Partial<Settings>);
  };

  const addArrayItem = (path: string, newItem: unknown) => {
    setSettings(
      (prev) =>
        updateAtPath(prev, path, (current) => {
          const items = Array.isArray(current) ? [...current] : [];
          items.push(newItem);
          return items;
        }) as Partial<Settings>
    );
  };

  const removeArrayItem = (path: string, index: number) => {
    setSettings(
      (prev) =>
        updateAtPath(prev, path, (current) => {
          if (!Array.isArray(current)) {
            return current;
          }
          return current.filter((_, itemIndex) => itemIndex !== index);
        }) as Partial<Settings>
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setMessageType('');
    try {
      const payload = {
        ...settings,
        homepageContent,
      };
      await updateSettings(payload);
      setMessage(language === 'zh-CN' ? '保存成功！' : 'Saved successfully!');
      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage(language === 'zh-CN' ? '保存失败，请检查输入内容' : 'Save failed. Please check the form values.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{language === 'zh-CN' ? '系统设置' : 'System Settings'}</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? (language === 'zh-CN' ? '保存中...' : 'Saving...') : language === 'zh-CN' ? '保存设置' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`rounded-lg p-4 text-sm ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <section className={sectionCardClass}>
        <h2 className="text-lg font-semibold text-gray-900">{language === 'zh-CN' ? '基础信息' : 'Basic Information'}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">{language === 'zh-CN' ? '网站名称（中文）' : 'Site Name (Chinese)'}</label>
            <input className="input-field" value={settings.siteName?.zh || ''} onChange={(event) => handleChange('siteName.zh', event.target.value)} />
          </div>
          <div>
            <label className="label">{language === 'zh-CN' ? '网站名称（英文）' : 'Site Name (English)'}</label>
            <input className="input-field" value={settings.siteName?.en || ''} onChange={(event) => handleChange('siteName.en', event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">{language === 'zh-CN' ? '网站描述（中文）' : 'Site Description (Chinese)'}</label>
            <textarea rows={3} className="input-field resize-none" value={settings.siteDescription?.zh || ''} onChange={(event) => handleChange('siteDescription.zh', event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">{language === 'zh-CN' ? '网站描述（英文）' : 'Site Description (English)'}</label>
            <textarea rows={3} className="input-field resize-none" value={settings.siteDescription?.en || ''} onChange={(event) => handleChange('siteDescription.en', event.target.value)} />
          </div>
        </div>
      </section>

      <section className={sectionCardClass}>
        <h2 className="text-lg font-semibold text-gray-900">{language === 'zh-CN' ? '联系方式' : 'Contact Information'}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">{language === 'zh-CN' ? '地址（中文）' : 'Address (Chinese)'}</label>
            <input className="input-field" value={settings.contact?.address?.zh || ''} onChange={(event) => handleChange('contact.address.zh', event.target.value)} />
          </div>
          <div>
            <label className="label">{language === 'zh-CN' ? '地址（英文）' : 'Address (English)'}</label>
            <input className="input-field" value={settings.contact?.address?.en || ''} onChange={(event) => handleChange('contact.address.en', event.target.value)} />
          </div>
          <div>
            <label className="label">{language === 'zh-CN' ? '联系电话' : 'Phone'}</label>
            <input className="input-field" value={settings.contact?.phone || ''} onChange={(event) => handleChange('contact.phone', event.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" value={settings.contact?.email || ''} onChange={(event) => handleChange('contact.email', event.target.value)} />
          </div>
        </div>
      </section>

      <section className={sectionCardClass}>
        <h2 className="text-lg font-semibold text-gray-900">{language === 'zh-CN' ? '首页内容管理' : 'Homepage Content'}</h2>
        <div className="mt-4 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {homePanels.map((panel) => (
            <button
              key={panel.key}
              type="button"
              onClick={() => {
                setActiveHomePanel(panel.key);
                const target = document.getElementById(`home-${panel.key}`);
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`rounded-full px-4 py-2 text-sm ${
                activeHomePanel === panel.key
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {panel.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-8">
          <div id="home-hero" className="scroll-mt-24">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{language === 'zh-CN' ? 'Hero 轮播' : 'Hero Slides'}</h3>
              <button
                type="button"
                onClick={() =>
                  addArrayItem('homepageContent.heroSlides', {
                    image: '',
                    title: { zh: '', en: '' },
                    subtitle: { zh: '', en: '' },
                    ctaText: { zh: '', en: '' },
                    ctaLink: '/contact',
                  })
                }
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                {language === 'zh-CN' ? '新增' : 'Add'}
              </button>
            </div>
            <div className="space-y-4">
              {homepageContent.heroSlides.map((slide, index) => (
                <div key={`hero-slide-${index}`} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium text-gray-900">Slide #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('homepageContent.heroSlides', index)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      {language === 'zh-CN' ? '删除' : 'Delete'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="label">Image URL</label>
                      <input className="input-field" value={slide.image} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.image`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '标题（中文）' : 'Title (Chinese)'}</label>
                      <input className="input-field" value={slide.title.zh} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.title.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '标题（英文）' : 'Title (English)'}</label>
                      <input className="input-field" value={slide.title.en} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.title.en`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '副标题（中文）' : 'Subtitle (Chinese)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={slide.subtitle.zh} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.subtitle.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '副标题（英文）' : 'Subtitle (English)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={slide.subtitle.en} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.subtitle.en`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '按钮文案（中文）' : 'Button Text (Chinese)'}</label>
                      <input className="input-field" value={slide.ctaText.zh} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.ctaText.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '按钮文案（英文）' : 'Button Text (English)'}</label>
                      <input className="input-field" value={slide.ctaText.en} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.ctaText.en`, event.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">CTA Link</label>
                      <input className="input-field" value={slide.ctaLink} onChange={(event) => handleChange(`homepageContent.heroSlides.${index}.ctaLink`, event.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="home-metrics" className="scroll-mt-24">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{language === 'zh-CN' ? '企业实力指标' : 'Strength Metrics'}</h3>
              <button
                type="button"
                onClick={() =>
                  addArrayItem('homepageContent.strengthMetrics', {
                    value: '',
                    label: { zh: '', en: '' },
                    description: { zh: '', en: '' },
                  })
                }
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                {language === 'zh-CN' ? '新增' : 'Add'}
              </button>
            </div>
            <div className="space-y-4">
              {homepageContent.strengthMetrics.map((metric, index) => (
                <div key={`metric-${index}`} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium text-gray-900">Metric #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('homepageContent.strengthMetrics', index)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      {language === 'zh-CN' ? '删除' : 'Delete'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="label">{language === 'zh-CN' ? '数值' : 'Value'}</label>
                      <input className="input-field" value={metric.value} onChange={(event) => handleChange(`homepageContent.strengthMetrics.${index}.value`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '标签（中文）' : 'Label (Chinese)'}</label>
                      <input className="input-field" value={metric.label.zh} onChange={(event) => handleChange(`homepageContent.strengthMetrics.${index}.label.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '标签（英文）' : 'Label (English)'}</label>
                      <input className="input-field" value={metric.label.en} onChange={(event) => handleChange(`homepageContent.strengthMetrics.${index}.label.en`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '说明（中文）' : 'Description (Chinese)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={metric.description.zh} onChange={(event) => handleChange(`homepageContent.strengthMetrics.${index}.description.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '说明（英文）' : 'Description (English)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={metric.description.en} onChange={(event) => handleChange(`homepageContent.strengthMetrics.${index}.description.en`, event.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="home-story" className="scroll-mt-24 rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">{language === 'zh-CN' ? '品牌故事' : 'Brand Story'}</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="label">{language === 'zh-CN' ? '标题（中文）' : 'Title (Chinese)'}</label>
                <input className="input-field" value={homepageContent.brandStory.title.zh} onChange={(event) => handleChange('homepageContent.brandStory.title.zh', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '标题（英文）' : 'Title (English)'}</label>
                <input className="input-field" value={homepageContent.brandStory.title.en} onChange={(event) => handleChange('homepageContent.brandStory.title.en', event.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Image URL</label>
                <input className="input-field" value={homepageContent.brandStory.image} onChange={(event) => handleChange('homepageContent.brandStory.image', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '描述（中文）' : 'Description (Chinese)'}</label>
                <textarea rows={4} className="input-field resize-none" value={homepageContent.brandStory.description.zh} onChange={(event) => handleChange('homepageContent.brandStory.description.zh', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '描述（英文）' : 'Description (English)'}</label>
                <textarea rows={4} className="input-field resize-none" value={homepageContent.brandStory.description.en} onChange={(event) => handleChange('homepageContent.brandStory.description.en', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '高亮语（中文）' : 'Highlight (Chinese)'}</label>
                <input className="input-field" value={homepageContent.brandStory.highlight.zh} onChange={(event) => handleChange('homepageContent.brandStory.highlight.zh', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '高亮语（英文）' : 'Highlight (English)'}</label>
                <input className="input-field" value={homepageContent.brandStory.highlight.en} onChange={(event) => handleChange('homepageContent.brandStory.highlight.en', event.target.value)} />
              </div>
            </div>
          </div>

          <div id="home-milestones" className="scroll-mt-24">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{language === 'zh-CN' ? '发展历程' : 'Milestones'}</h3>
              <button
                type="button"
                onClick={() =>
                  addArrayItem('homepageContent.milestones', {
                    year: '',
                    title: { zh: '', en: '' },
                    description: { zh: '', en: '' },
                  })
                }
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                {language === 'zh-CN' ? '新增' : 'Add'}
              </button>
            </div>
            <div className="space-y-4">
              {homepageContent.milestones.map((milestone, index) => (
                <div key={`milestone-${index}`} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium text-gray-900">Milestone #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('homepageContent.milestones', index)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      {language === 'zh-CN' ? '删除' : 'Delete'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="label">{language === 'zh-CN' ? '年份' : 'Year'}</label>
                      <input className="input-field" value={milestone.year} onChange={(event) => handleChange(`homepageContent.milestones.${index}.year`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '标题（中文）' : 'Title (Chinese)'}</label>
                      <input className="input-field" value={milestone.title.zh} onChange={(event) => handleChange(`homepageContent.milestones.${index}.title.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '标题（英文）' : 'Title (English)'}</label>
                      <input className="input-field" value={milestone.title.en} onChange={(event) => handleChange(`homepageContent.milestones.${index}.title.en`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '描述（中文）' : 'Description (Chinese)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={milestone.description.zh} onChange={(event) => handleChange(`homepageContent.milestones.${index}.description.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '描述（英文）' : 'Description (English)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={milestone.description.en} onChange={(event) => handleChange(`homepageContent.milestones.${index}.description.en`, event.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="home-team" className="scroll-mt-24">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{language === 'zh-CN' ? '团队成员' : 'Team Members'}</h3>
              <button
                type="button"
                onClick={() =>
                  addArrayItem('homepageContent.team', {
                    image: '',
                    name: { zh: '', en: '' },
                    role: { zh: '', en: '' },
                    bio: { zh: '', en: '' },
                  })
                }
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
                {language === 'zh-CN' ? '新增' : 'Add'}
              </button>
            </div>
            <div className="space-y-4">
              {homepageContent.team.map((member, index) => (
                <div key={`team-${index}`} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium text-gray-900">Member #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('homepageContent.team', index)}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      {language === 'zh-CN' ? '删除' : 'Delete'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="label">Image URL</label>
                      <input className="input-field" value={member.image} onChange={(event) => handleChange(`homepageContent.team.${index}.image`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '姓名（中文）' : 'Name (Chinese)'}</label>
                      <input className="input-field" value={member.name.zh} onChange={(event) => handleChange(`homepageContent.team.${index}.name.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '姓名（英文）' : 'Name (English)'}</label>
                      <input className="input-field" value={member.name.en} onChange={(event) => handleChange(`homepageContent.team.${index}.name.en`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '职位（中文）' : 'Role (Chinese)'}</label>
                      <input className="input-field" value={member.role.zh} onChange={(event) => handleChange(`homepageContent.team.${index}.role.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '职位（英文）' : 'Role (English)'}</label>
                      <input className="input-field" value={member.role.en} onChange={(event) => handleChange(`homepageContent.team.${index}.role.en`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '简介（中文）' : 'Bio (Chinese)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={member.bio.zh} onChange={(event) => handleChange(`homepageContent.team.${index}.bio.zh`, event.target.value)} />
                    </div>
                    <div>
                      <label className="label">{language === 'zh-CN' ? '简介（英文）' : 'Bio (English)'}</label>
                      <textarea rows={2} className="input-field resize-none" value={member.bio.en} onChange={(event) => handleChange(`homepageContent.team.${index}.bio.en`, event.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="home-cta" className="scroll-mt-24 rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">{language === 'zh-CN' ? '联系 CTA' : 'Contact CTA'}</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="label">{language === 'zh-CN' ? '标题（中文）' : 'Title (Chinese)'}</label>
                <input className="input-field" value={homepageContent.cta.title.zh} onChange={(event) => handleChange('homepageContent.cta.title.zh', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '标题（英文）' : 'Title (English)'}</label>
                <input className="input-field" value={homepageContent.cta.title.en} onChange={(event) => handleChange('homepageContent.cta.title.en', event.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Background Image URL</label>
                <input className="input-field" value={homepageContent.cta.backgroundImage} onChange={(event) => handleChange('homepageContent.cta.backgroundImage', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '描述（中文）' : 'Description (Chinese)'}</label>
                <textarea rows={3} className="input-field resize-none" value={homepageContent.cta.description.zh} onChange={(event) => handleChange('homepageContent.cta.description.zh', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '描述（英文）' : 'Description (English)'}</label>
                <textarea rows={3} className="input-field resize-none" value={homepageContent.cta.description.en} onChange={(event) => handleChange('homepageContent.cta.description.en', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '按钮文案（中文）' : 'Button Text (Chinese)'}</label>
                <input className="input-field" value={homepageContent.cta.buttonText.zh} onChange={(event) => handleChange('homepageContent.cta.buttonText.zh', event.target.value)} />
              </div>
              <div>
                <label className="label">{language === 'zh-CN' ? '按钮文案（英文）' : 'Button Text (English)'}</label>
                <input className="input-field" value={homepageContent.cta.buttonText.en} onChange={(event) => handleChange('homepageContent.cta.buttonText.en', event.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="label">Button Link</label>
                <input className="input-field" value={homepageContent.cta.buttonLink} onChange={(event) => handleChange('homepageContent.cta.buttonLink', event.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSettings;
