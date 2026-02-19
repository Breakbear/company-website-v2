import React from 'react';
import type { TeamMember } from '../../services/settings.service';

interface TeamGridProps {
  team: TeamMember[];
  language: 'zh-CN' | 'en-US';
}

const TeamGrid: React.FC<TeamGridProps> = ({ team, language }) => {
  return (
    <section className="section-industrial-muted">
      <div className="container-custom">
        <div className="mb-10 max-w-3xl">
          <p className="section-kicker">{language === 'zh-CN' ? '核心团队' : 'Core Team'}</p>
          <h2 className="section-heading">
            {language === 'zh-CN' ? '工程、交付、服务三位一体' : 'Integrated Expertise Across Engineering, Delivery, and Service'}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {team.map((member, index) => (
            <article key={`${member.name.en}-${index}`} className="industrial-card angle-cut overflow-hidden bg-industrial-900/70">
              <img
                src={member.image}
                alt={language === 'zh-CN' ? member.name.zh : member.name.en}
                className="h-64 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white">{language === 'zh-CN' ? member.name.zh : member.name.en}</h3>
                <p className="mt-1 text-sm text-primary-200">{language === 'zh-CN' ? member.role.zh : member.role.en}</p>
                <p className="mt-3 text-sm leading-relaxed text-industrial-200">
                  {language === 'zh-CN' ? member.bio.zh : member.bio.en}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
