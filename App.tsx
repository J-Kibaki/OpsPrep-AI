import React, { useState } from 'react';
import { Terminal, BookOpen, Briefcase, MessageSquare, Menu, X, Cpu, FileText, FileCode, Layers, Zap, Award } from 'lucide-react';
import { Home } from './pages/Home';
import { QuestionBank } from './pages/QuestionBank';
import { JobParser } from './pages/JobParser';
import { MockInterview } from './pages/MockInterview';
import { Readme } from './pages/Readme';
import { CheatSheets } from './pages/CheatSheets';
import { TaxonomyExplorer } from './pages/TaxonomyExplorer';
import { Profile } from './pages/Profile';
import { UserProvider, useUser } from './context/UserContext';

type View = 'home' | 'questions' | 'jobs' | 'mock' | 'cheatsheets' | 'readme' | 'taxonomy' | 'profile';

const AppContent = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { profile, readiness, activities } = useUser();

  // Determine if user is a guest (hasn't set up profile)
  const isGuest = profile.name === 'Guest Engineer';

  const navigate = (view: View, params?: any) => {
    setCurrentView(view);
    if (params) {
      setViewParams(params);
    } else {
      setViewParams({});
    }
    // On mobile, auto-close sidebar after selection
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'questions': return <QuestionBank initialTopic={viewParams?.topic} />;
      case 'jobs': return <JobParser onNavigate={navigate} />;
      case 'mock': return <MockInterview />;
      case 'cheatsheets': return <CheatSheets />;
      case 'taxonomy': return <TaxonomyExplorer onNavigate={navigate} />;
      case 'readme': return <Readme />;
      case 'profile': return <Profile />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => navigate(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
        currentView === view 
          ? 'bg-indigo-600/20 text-indigo-400 border-r-2 border-indigo-500' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  // Calculate simple micro-chart data based on recent activities
  const chartData = activities.slice(0, 7).map(a => (a.score || 50));
  // Pad if empty
  while(chartData.length < 7) chartData.push(10);

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200 overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-md border border-slate-700 shadow-lg text-slate-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Cpu size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            OpsPrep AI
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem view="home" icon={Terminal} label="Dashboard" />
          {/* Profile NavItem removed to avoid duplication with Stats Module */}
          <NavItem view="questions" icon={BookOpen} label="Question Bank" />
          <NavItem view="taxonomy" icon={Layers} label="Skill Taxonomy" />
          <NavItem view="cheatsheets" icon={FileCode} label="Cheat Sheets" />
          <NavItem view="jobs" icon={Briefcase} label="Job Parser" />
          <NavItem view="mock" icon={MessageSquare} label="Mock Interview" />
          <div className="pt-4 mt-4 border-t border-slate-800">
             <NavItem view="readme" icon={FileText} label="Documentation" />
          </div>
        </nav>

        {/* User Stats Module - Only visible if user has created a profile (not guest) */}
        {!isGuest && (
          <div 
              className={`p-4 border-t border-slate-800 cursor-pointer transition-colors ${
                  currentView === 'profile' 
                  ? 'bg-indigo-900/10 border-t-indigo-500/30' 
                  : 'bg-slate-950/30 hover:bg-slate-900'
              }`}
              onClick={() => navigate('profile')}
          >
            <div className="flex items-center space-x-3 mb-4">
               <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 border border-slate-700">
                    <span className="text-xs">{profile.name.substring(0,2).toUpperCase()}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                     <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
               </div>
               <div className="overflow-hidden">
                  <div className="text-sm font-bold text-slate-200 truncate">{profile.name}</div>
                  <div className="text-xs text-indigo-400 font-medium flex items-center truncate">
                     {profile.level}
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               {/* Readiness Bar */}
               <div>
                 <div className="flex justify-between text-xs mb-1.5">
                   <span className="text-slate-500 font-medium flex items-center">
                      <Award size={12} className="mr-1 text-emerald-500" /> Readiness
                   </span>
                   <span className="text-emerald-400 font-bold">{readiness}%</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${readiness}%`}}></div>
                 </div>
               </div>

               {/* Activity & Streak */}
               <div className="flex items-center justify-between">
                  {/* Micro Chart */}
                  <div className="flex items-end space-x-1 h-8">
                     {chartData.map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 rounded-t-sm transition-all hover:bg-indigo-400 ${h > 40 ? 'bg-indigo-500/40' : 'bg-slate-800'}`} 
                          style={{ height: `${Math.min(h, 100)}%` }}
                        ></div>
                     ))}
                  </div>
                  
                  {/* Streak Badge */}
                  <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2 py-1 rounded text-xs text-amber-500 font-bold border border-slate-700/50 shadow-sm">
                     <Zap size={12} className="fill-amber-500" />
                     <span>{profile.streak_days}</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative w-full h-screen">
        {renderView()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}