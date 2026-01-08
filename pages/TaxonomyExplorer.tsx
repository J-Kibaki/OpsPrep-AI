import React, { useState } from 'react';
import { SKILL_TAXONOMY } from '../constants';
import { Hash, ArrowRight, Layers, Database, Cloud, Shield, Terminal, Activity, GitBranch, Globe, Server, Cpu } from 'lucide-react';

export const TaxonomyExplorer = ({ onNavigate }: { onNavigate: (view: any, params?: any) => void }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Cloud_Providers': return Cloud;
      case 'Operating_Systems': return Cpu;
      case 'Databases': return Database;
      case 'Security': return Shield;
      case 'Scripting': return Terminal;
      case 'Observability': return Activity;
      case 'CI_CD': return GitBranch;
      case 'Networking': return Globe;
      case 'Containerization': return Server;
      default: return Layers;
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-10 animate-fadeIn">
        <h1 className="text-2xl font-bold text-slate-100 mb-3 flex items-center">
          <Layers className="mr-3 text-indigo-400" /> 
          Skill Taxonomy
        </h1>
        <p className="text-slate-400 text-base max-w-2xl">
          Explore the canonical map of DevOps and SRE competencies. Select any topic to generate targeted interview scenarios.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
        {Object.entries(SKILL_TAXONOMY.categories).map(([category, skills], idx) => {
          const Icon = getIconForCategory(category);
          const isHovered = hoveredCategory === category;
          const formattedTitle = category.replace(/_/g, ' ');

          return (
            <div 
              key={category}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors duration-300 ${
                    isHovered ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {formattedTitle}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {skills.length} skills
                </span>
              </div>

              {/* Skill Grid */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => onNavigate('questions', { topic: skill })}
                    className="flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 
                      bg-slate-950 text-slate-400 border border-slate-800 
                      hover:bg-indigo-600 hover:text-white hover:border-indigo-500"
                  >
                    <Hash size={12} className="mr-1.5 opacity-50" />
                    {skill}
                  </button>
                ))}
              </div>

              {/* Action Footer */}
              <div className={`absolute bottom-4 right-4 transition-all duration-300 transform ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}>
                 <button 
                    onClick={() => onNavigate('questions', { topic: skills[0] })}
                    className="flex items-center text-xs font-bold text-indigo-400 hover:text-indigo-300"
                 >
                    Practice Category <ArrowRight size={14} className="ml-1" />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};