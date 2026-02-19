import React from 'react';
import type { StrengthMetric } from '../../services/settings.service';

interface StrengthMetricsProps {
  metrics: StrengthMetric[];
  language: 'zh-CN' | 'en-US';
}

const StrengthMetrics: React.FC<StrengthMetricsProps> = ({ metrics, language }) => {
  return (
    <section className="section-industrial">
      <div className="container-custom">
        <div className="mb-10 max-w-3xl">
          <p className="section-kicker">{language === 'zh-CN' ? '企业实力' : 'Company Capability'}</p>
          <h2 className="section-heading">
            {language === 'zh-CN' ? '用可量化交付，保障关键工序可靠执行' : 'Quantified Delivery for Critical Operation Reliability'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <div
              key={`${metric.value}-${index}`}
              className="industrial-card angle-cut bg-[linear-gradient(155deg,rgba(20,26,36,0.98),rgba(8,11,18,0.92))] p-6"
            >
              <p className="font-display text-4xl font-semibold text-primary-200">{metric.value}</p>
              <p className="mt-2 text-lg font-medium text-white">
                {language === 'zh-CN' ? metric.label.zh : metric.label.en}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-industrial-200">
                {language === 'zh-CN' ? metric.description.zh : metric.description.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrengthMetrics;
