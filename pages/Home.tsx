import React from 'react';
import { ArrowRight, Code, ShieldCheck, Cloud, Database, Layers, Briefcase, MessageSquare, Sparkles, Zap, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const Home = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const { profile, activities, error } = useUser();

  if (!profile) return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="text-slate-500 font-medium animate-pulse">Loading profile...</div>
          </div>
      </div>
  );

  const isGuest = profile.name === 'New User';
  const hasHistory = activities.length > 0;
  const isReturning = !isGuest || hasHistory;
  
  const firstName = profile.name.split(' ')[0];

  return (
    <div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-8 sm:space-y-10">
      {error && (
          <div className="bg-amber-500/10 border border-amber-500/50 p-3 sm:p-4 rounded-xl flex items-start space-x-3 text-amber-500 mb-6 animate-fadeIn">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-sm">
                  <span className="font-bold">Sync Issue:</span> {error}
              </div>
          </div>
      )}

      {/* Hero Section */}
      <header className="mb-8 sm:mb-12 animate-fadeIn">
        <div className="flex items-center space-x-2 mb-4">
            {!isReturning && (
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center animate-pulse">
                    <Sparkles size={10} className="mr-1.5" /> Start Your Journey
                </span>
            )}
            {isReturning && (
                 <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center">
                    <Zap size={10} className="mr-1.5" /> Day Streak: {profile.streak_days}
                </span>
            )}
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 mb-4 tracking-tight leading-tight">
          {isReturning && profile.name !== 'New User' ? (
            <>
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{firstName}</span>.
            </>
          ) : (
            <>
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">OpsPrep AI</span>.
            </>
          )}
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          {isReturning 
            ? "Ready to level up? Continue mastering the modern DevOps stack with generated scenarios and real-time interview simulations."
            : "Your personal AI command center for DevOps & SRE interview preparation. Master architectural scenarios and simulate pressure tests."
          }
        </p>

        {!isReturning && (
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
                <button 
                    onClick={() => onNavigate('profile')}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center"
                >
                    Create Profile <ArrowRight size={18} className="ml-2" />
                </button>
            </div>
        )}
      </header>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <DashboardCard 
          title="Quick Practice" 
          description="Generate 5 random SRE scenario questions tailored to your skill gaps."
          icon={Code}
          iconColor="text-indigo-400"
          bg="bg-indigo-500/10"
          borderColor="hover:border-indigo-500/50"
          onClick={() => onNavigate('questions')}
          actionText="Start Session"
        />
        <DashboardCard 
          title="Skill Taxonomy" 
          description="Explore the comprehensive map of DevOps competencies and topics."
          icon={Layers}
          iconColor="text-emerald-400"
          bg="bg-emerald-500/10"
          borderColor="hover:border-emerald-500/50"
          onClick={() => onNavigate('taxonomy')}
          actionText="Explore Skills"
        />
        <DashboardCard 
          title="Mock Interview" 
          description="Simulate a live pressure test with our AI Principal Engineer persona."
          icon={MessageSquare}
          iconColor="text-pink-400"
          bg="bg-pink-500/10"
          borderColor="hover:border-pink-500/50"
          onClick={() => onNavigate('interview')}
          actionText="Join Room"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Job Parser Feature */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="p-3 bg-slate-800 rounded-xl inline-block mb-4 text-indigo-400 ring-1 ring-slate-700">
                  <Briefcase size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Job Description Parser</h2>
                <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                   Paste a JD to extract tech stack, and generate a custom study plan based on missing requirements.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('jobs')}
                className="w-full md:w-auto shrink-0 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-lg shadow-indigo-900/20"
              >
                Parse Job <ArrowRight size={18} className="ml-2" />
              </button>
           </div>
        </div>

        {/* Stats / Topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-slate-100">Trending</h2>
             <button onClick={() => onNavigate('taxonomy')} className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-wider">View All</button>
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

const DashboardCard = ({ title, description, icon: Icon, onClick, actionText, iconColor, bg, borderColor = "hover:border-slate-700" }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${borderColor} hover:shadow-xl group relative overflow-hidden`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${bg} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-slate-400 mb-8 h-12 leading-relaxed text-sm">{description}</p>
      
      <div className={`flex items-center font-bold text-sm ${iconColor} opacity-90 group-hover:opacity-100`}>
        {actionText} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const TopicRow = ({ title, count, icon: Icon, color, bg }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group border border-transparent hover:border-slate-700/50">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${bg} ${color}`}>
        <Icon size={16} />
      </div>
      <span className="font-semibold text-slate-300 group-hover:text-slate-200 transition-colors text-sm">{title}</span>
    </div>
    <span className="text-[10px] font-bold font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 group-hover:border-slate-700">{count}</span>
  </div>
);
