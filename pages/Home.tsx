import React from 'react';
import { ArrowRight, Code, ShieldCheck, Cloud, Database, Layers, Briefcase, MessageSquare } from 'lucide-react';

export const Home = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-8">
      <header className="mb-10 animate-fadeIn">
        <h1 className="text-3xl font-bold text-slate-100 mb-3">
          Welcome back, Engineer.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Ready to level up? Master the modern DevOps stack with our AI-driven scenario generator and real-time interview simulator.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Quick Practice" 
          description="Generate 5 random SRE scenario questions tailored to your skill gaps."
          icon={Code}
          iconColor="text-indigo-400"
          bg="bg-indigo-500/10"
          onClick={() => onNavigate('questions')}
          actionText="Start Session"
        />
        <DashboardCard 
          title="Skill Taxonomy" 
          description="Explore the comprehensive map of DevOps competencies and topics."
          icon={Layers}
          iconColor="text-emerald-400"
          bg="bg-emerald-500/10"
          onClick={() => onNavigate('taxonomy')}
          actionText="Explore Skills"
        />
        <DashboardCard 
          title="Mock Interview" 
          description="Simulate a live pressure test with our AI Principal Engineer persona."
          icon={MessageSquare}
          iconColor="text-pink-400"
          bg="bg-pink-500/10"
          onClick={() => onNavigate('mock')}
          actionText="Join Room"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Parser Feature */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="p-3 bg-slate-800 rounded-lg inline-block mb-4 text-indigo-400">
                  <Briefcase size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Job Description Parser</h2>
                <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                   Paste a JD to extract salary ranges, tech stack, and generate a custom study plan based on missing requirements.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('jobs')}
                className="shrink-0 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-lg shadow-indigo-900/20"
              >
                Parse Job <ArrowRight size={18} className="ml-2" />
              </button>
           </div>
        </div>

        {/* Stats / Topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-slate-100">Trending Topics</h2>
             <button onClick={() => onNavigate('taxonomy')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">View All</button>
           </div>
           <div className="space-y-3">
              <TopicRow title="Kubernetes" count={42} icon={Cloud} color="text-blue-400" bg="bg-blue-500/10" />
              <TopicRow title="Terraform" count={28} icon={Database} color="text-purple-400" bg="bg-purple-500/10" />
              <TopicRow title="Observability" count={31} icon={ShieldCheck} color="text-orange-400" bg="bg-orange-500/10" />
           </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, icon: Icon, onClick, actionText, iconColor, bg }: any) => {
  return (
    <div 
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg group"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 ${bg} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-3">{title}</h3>
      <p className="text-slate-400 mb-8 h-12 leading-relaxed text-sm">{description}</p>
      <div className={`flex items-center font-medium text-sm ${iconColor} opacity-80 group-hover:opacity-100`}>
        {actionText} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const TopicRow = ({ title, count, icon: Icon, color, bg }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-md ${bg} ${color}`}>
        <Icon size={16} />
      </div>
      <span className="font-medium text-slate-300 group-hover:text-slate-200 transition-colors text-sm">{title}</span>
    </div>
    <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">{count}</span>
  </div>
);