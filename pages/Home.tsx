import React from 'react';
import { ArrowRight, Code, ShieldCheck, Cloud, Database } from 'lucide-react';

export const Home = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">
          Welcome back, Engineer.
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Prepare for your next SRE or DevOps interview with AI-powered scenario questions, 
          automated job parsing, and realistic mock interviews.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <DashboardCard 
          title="Quick Practice" 
          description="Generate 5 random SRE scenario questions based on your gaps."
          icon={Code}
          onClick={() => onNavigate('questions')}
          actionText="Start Session"
        />
        <DashboardCard 
          title="Analyze Job" 
          description="Paste a JD to extract skills and find missing knowledge."
          icon={BriefcaseIcon}
          onClick={() => onNavigate('jobs')}
          actionText="Parse Job"
        />
        <DashboardCard 
          title="Mock Interview" 
          description="Simulate a live interview with our AI agent."
          icon={MessageSquareIcon}
          onClick={() => onNavigate('mock')}
          actionText="Join Room"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-200">Recommended Topics</h2>
          <button className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
            View Taxonomy <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TopicCard title="Kubernetes" count={42} icon={Cloud} color="text-blue-400" />
          <TopicCard title="Terraform" count={28} icon={Database} color="text-purple-400" />
          <TopicCard title="Incident Response" count={15} icon={ShieldCheck} color="text-red-400" />
          <TopicCard title="Observability" count={31} icon={EyeIcon} color="text-orange-400" />
        </div>
      </section>
    </div>
  );
};

const DashboardCard = ({ title, description, icon: Icon, onClick, actionText }: any) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all group">
    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
    <p className="text-slate-400 mb-6 text-sm h-10">{description}</p>
    <button 
      onClick={onClick}
      className="flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300"
    >
      {actionText} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

const TopicCard = ({ title, count, icon: Icon, color }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-slate-800 transition-colors">
    <div className={`p-2 rounded-md bg-slate-950 ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <h4 className="font-medium text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500">{count} questions</p>
    </div>
  </div>
);

// Icons helpers
const BriefcaseIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const MessageSquareIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const EyeIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
