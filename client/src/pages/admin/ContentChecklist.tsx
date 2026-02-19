import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface ChecklistItem {
  module: string;
  field: string;
  zhExample: string;
  enExample: string;
  note: string;
}

const AdminContentChecklist: React.FC = () => {
  const { language } = useLanguage();

  const checklist: ChecklistItem[] = [
    {
      module: language === 'zh-CN' ? 'Hero 轮播' : 'Hero Slides',
      field: 'heroSlides[].title / subtitle / ctaText / image',
      zhExample: '示例: 工业级液压扳手系统解决方案',
      enExample: 'Example: Industrial Hydraulic Torque Solutions',
      note: language === 'zh-CN' ? '建议 2-4 张图，突出行业场景与产品价值。' : 'Use 2-4 slides focusing on use cases and product value.',
    },
    {
      module: language === 'zh-CN' ? '企业实力' : 'Strength Metrics',
      field: 'strengthMetrics[].value / label / description',
      zhExample: '示例: 20+ 年行业经验',
      enExample: 'Example: 20+ Years in Industry',
      note: language === 'zh-CN' ? '优先填写可量化指标，避免笼统表述。' : 'Prioritize quantifiable metrics instead of vague statements.',
    },
    {
      module: language === 'zh-CN' ? '品牌故事' : 'Brand Story',
      field: 'brandStory.title / description / highlight / image',
      zhExample: '示例: 以扭矩精度定义工业执行力',
      enExample: 'Example: Defining Industrial Execution with Torque Precision',
      note: language === 'zh-CN' ? '突出技术路线、服务能力与行业经验。' : 'Highlight technical path, service capability, and domain experience.',
    },
    {
      module: language === 'zh-CN' ? '发展历程' : 'Milestones',
      field: 'milestones[].year / title / description',
      zhExample: '示例: 2018 平台升级',
      enExample: 'Example: 2018 Platform Upgrade',
      note: language === 'zh-CN' ? '建议按时间递增，控制 4-8 条。' : 'Keep in chronological order, ideally 4-8 items.',
    },
    {
      module: language === 'zh-CN' ? '团队成员' : 'Team',
      field: 'team[].name / role / bio / image',
      zhExample: '示例: 刘工 - 首席技术官',
      enExample: 'Example: Liu - Chief Technology Officer',
      note: language === 'zh-CN' ? '建议展示 3-6 位核心成员，聚焦职责与经验。' : 'Show 3-6 core members with clear role and expertise.',
    },
    {
      module: 'CTA',
      field: 'cta.title / description / buttonText / buttonLink / backgroundImage',
      zhExample: '示例: 获取专属方案',
      enExample: 'Example: Get a Tailored Solution',
      note: language === 'zh-CN' ? '按钮链接建议固定到 /contact 或落地咨询页。' : 'Point CTA button to /contact or a dedicated inquiry page.',
    },
  ];

  const assetRules = [
    language === 'zh-CN' ? 'Hero 图片建议比例 16:9，推荐宽度 >= 1920px。' : 'Hero image ratio: 16:9, recommended width >= 1920px.',
    language === 'zh-CN' ? '团队头像建议 1:1，推荐宽度 >= 640px。' : 'Team image ratio: 1:1, recommended width >= 640px.',
    language === 'zh-CN' ? 'CTA 背景建议 1920x900，避免文字区域高对比细节。' : 'CTA background: around 1920x900, avoid high-contrast detail behind text.',
    language === 'zh-CN' ? '单图体积建议 <= 500KB，优先 WebP。' : 'Target image size <= 500KB, prefer WebP.',
    language === 'zh-CN' ? '图片 URL 仅支持 http(s) 或 /uploads/...。' : 'Image URLs must be http(s) or /uploads/...',
  ];

  const publishChecks = [
    language === 'zh-CN' ? '中英文文案都已填写，不依赖自动回退。' : 'Both Chinese and English copy are filled (no fallback dependency).',
    language === 'zh-CN' ? '所有 CTA 链接都可访问，且跳转目标正确。' : 'All CTA links are reachable and point to correct destinations.',
    language === 'zh-CN' ? '首页在 375px 与 1440px 下排版正常。' : 'Homepage layout is verified at 375px and 1440px.',
    language === 'zh-CN' ? '产品精选和新闻动态至少各有 3 条有效内容。' : 'Featured products and news each have at least 3 valid items.',
    language === 'zh-CN' ? '修改后已点击“保存设置”并刷新首页确认生效。' : 'Changes are saved and validated on homepage after refresh.',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'zh-CN' ? '首页内容替换清单' : 'Homepage Content Replacement Checklist'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {language === 'zh-CN'
            ? '用于运营/市场同学按模块准备素材与文案，然后在“系统设置 -> 首页内容管理”中录入。'
            : 'Use this checklist to prepare assets and copy, then fill them in Settings -> Homepage Content.'}
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          {language === 'zh-CN' ? '模块字段清单' : 'Module Field Checklist'}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {language === 'zh-CN' ? '模块' : 'Module'}
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Field</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {language === 'zh-CN' ? '中文示例' : 'ZH Example'}
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {language === 'zh-CN' ? '英文示例' : 'EN Example'}
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {language === 'zh-CN' ? '填写要点' : 'Notes'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {checklist.map((item, index) => (
                <tr key={`${item.module}-${index}`} className="align-top">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.module}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{item.field}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.zhExample}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.enExample}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'zh-CN' ? '素材规格建议' : 'Asset Specification Suggestions'}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {assetRules.map((rule, index) => (
              <li key={`asset-rule-${index}`}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'zh-CN' ? '发布前检查' : 'Pre-Publish Checks'}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {publishChecks.map((check, index) => (
              <li key={`publish-check-${index}`}>{check}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminContentChecklist;
