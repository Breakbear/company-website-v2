import React from 'react';
import type { MilestoneItem } from '../../services/settings.service';

interface MilestoneTimelineProps {
  milestones: MilestoneItem[];
  language: 'zh-CN' | 'en-US';
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones, language }) => {
  return (
    <section className="section-industrial">
      <div className="container-custom">
        <div className="mb-10 max-w-3xl">
          <p className="section-kicker">{language === 'zh-CN' ? '发展历程' : 'Milestones'}</p>
          <h2 className="section-heading">
            {language === 'zh-CN' ? '从技术沉淀到场景落地的持续进化' : 'Continuous Evolution from Technical Depth to Field Delivery'}
          </h2>
        </div>
        <div className="relative pl-6 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-industrial-700/80">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={`${milestone.year}-${index}`} className="relative">
                <span className="absolute -left-[1.6rem] top-2 h-3 w-3 rounded-full bg-primary-300 shadow-[0_0_0_6px_rgba(244,139,0,0.16)]" />
                <div className="industrial-card angle-cut bg-industrial-900/65 p-5">
                  <p className="font-display text-primary-300">{milestone.year}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {language === 'zh-CN' ? milestone.title.zh : milestone.title.en}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-industrial-200">
                    {language === 'zh-CN' ? milestone.description.zh : milestone.description.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestoneTimeline;
