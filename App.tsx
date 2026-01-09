import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  BookOpen, 
  Target, 
  Trophy, 
  Settings, 
  ChevronRight,
  Search,
  Cpu,
  LayoutDashboard,
  BrainCircuit,
  FileText,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Loader2
} from 'lucide-react';
import { Home } from './pages/Home';
import QuestionBank from './pages/QuestionBank';
import JobParser from './pages/JobParser';
import TaxonomyExplorer from './pages/TaxonomyExplorer';
import CheatSheets from './pages/CheatSheets';
import MockInterview from './pages/MockInterview';
import Profile from './pages/Profile';
import { useUser } from './context/UserContext';
import Login from './pages/Login';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [navParams, setNavParams] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, loading, logout } = useUser();

  // Handle scroll to top on tab change
  useEffect(() => {
    const mainArea = document.querySelector('main');
    if (mainArea) mainArea.scrollTop = 0;
  }, [activeTab]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleNavigate = (view: string, params?: any) => {
    setActiveTab(view);
    setNavParams(params);
    setSidebarOpen(false);
  };

  const navItems = [
    { id: 'dashboard', icon: Terminal, label: 'Dashboard' },
    { id: 'questions', icon: BrainCircuit, label: 'Question Bank' },
    { id: 'interview', icon: MessageSquare, label: 'Mock Interview' },
    { id: 'jobs', icon: Target, label: 'Job Analysis' },
    { id: 'cheatsheets', icon: BookOpen, label: 'Cheat Sheets' },
    { id: 'taxonomy', icon: Search, label: 'Skill Map' },
    { id: 'profile', icon: Settings, label: 'Profile' },
  ];

  return (
    <div className="h-screen bg-slate-950 flex font-sans text-slate-200 overflow-hidden selection:bg-indigo-500/30">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl text-slate-200 active:scale-90 transition-transform"
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-300 ease-out flex flex-col shadow-2xl lg:shadow-none
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Cpu className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            OpsPrep AI
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar overscroll-contain">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavigate(item.id, null);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 font-bold shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : 'opacity-70'} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3 p-3 bg-slate-800/40 rounded-2xl border border-slate-700/30 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
              {profile?.name.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate">{profile?.name || 'User'}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{profile?.title || 'Engineer'}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-800/60 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/30 text-slate-400 rounded-xl transition-all text-xs font-bold border border-slate-700/50"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar overscroll-contain bg-slate-950 scroll-smooth">
        <div className="max-w-7xl mx-auto pb-20">
          {activeTab === 'dashboard' && <Home onNavigate={handleNavigate} />}
          {activeTab === 'questions' && <QuestionBank initialTopic={navParams?.topic} />}
          {activeTab === 'interview' && <MockInterview />}
          {activeTab === 'jobs' && <JobParser onNavigate={handleNavigate} />}
          {activeTab === 'cheatsheets' && <CheatSheets />}
          {activeTab === 'taxonomy' && <TaxonomyExplorer onNavigate={handleNavigate} />}
          {activeTab === 'profile' && <Profile />}
        </div>
      </main>
    </div>
  );
};

export default App;
