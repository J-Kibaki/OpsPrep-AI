import React, { useMemo } from 'react';
import { 
  BarChart2, Zap, FileCode, CheckCircle2, 
  TrendingUp, AlertTriangle, BookOpen 
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';

interface SkillMapProps {
  skills: string[];
  onNavigate: (view: any, params?: any) => void;
  className?: string;
}

export const SkillMap: React.FC<SkillMapProps> = ({ skills, onNavigate, className }) => {
  // Generate deterministic mock proficiency data based on skill name characters
  const data = useMemo(() => {
    return skills.slice(0, 6).map(skill => {
      const mockScore = (skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 7) % 100;
      // Ensure at least one skill is "low" for demo purposes
      const adjustedScore = Math.max(20, mockScore); 
      return {
        subject: skill,
        required: 100,
        yours: adjustedScore,
        gap: 100 - adjustedScore
      };
    });
  }, [skills]);

  const criticalGaps = data.filter(d => d.yours < 60);

  return (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center">
            <TrendingUp className="mr-2 text-indigo-500" size={20} />
            Skill Taxonomy Map
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visual analysis of your profile vs. job requirements
          </p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-500 mr-2"></span> 
            Target
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500 mr-2"></span> 
            You
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="relative">
          <div className="h-[280px] w-full bg-slate-900/50 rounded-lg border border-slate-800/50 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar 
                  name="Required" 
                  dataKey="required" 
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.1} 
                />
                <Radar 
                  name="You" 
                  dataKey="yours" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.4} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                  itemStyle={{ color: '#f1f5f9' }}
                  labelStyle={{ color: '#f8fafc' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stat */}
          <div className="absolute top-2 right-2 flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs backdrop-blur-sm">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-slate-300">{criticalGaps.length} Critical Gaps</span>
          </div>
        </div>
        
        {/* Action List Section */}
        <div className="flex flex-col h-[280px]">
          <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider mb-3 flex items-center justify-between">
            <span>Tactical Breakdown</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Action Required</span>
          </h4>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {data.map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-slate-200 text-sm flex items-center">
                    {item.subject}
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {item.yours}% Mastery
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mb-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.yours > 70 ? 'bg-emerald-500' : item.yours > 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${item.yours}%` }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onNavigate('questions', { topic: item.subject })}
                    className="flex-1 flex items-center justify-center text-xs bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/30 px-3 py-1.5 rounded transition-all"
                  >
                    <Zap size={12} className="mr-1.5" /> Practice
                  </button>
                  <button 
                    onClick={() => onNavigate('cheatsheets', { topic: item.subject })}
                    className="flex-1 flex items-center justify-center text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-all border border-slate-700"
                  >
                    <FileCode size={12} className="mr-1.5" /> Cheat Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};