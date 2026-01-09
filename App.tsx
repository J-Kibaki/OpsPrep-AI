import React, { useState } from 'react';
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
import { Login } from './pages/Login';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, loading, logout } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

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
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200 overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-md border border-slate-700 shadow-lg text-slate-200"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-300 flex flex-col shadow-xl lg:shadow-none
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Cpu className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            OpsPrep AI
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${activeTab === item.id 
                  ? 'bg-indigo-600/20 text-indigo-400 border-r-2 border-indigo-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : ''} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-inner">
              {profile?.name.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{profile?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.title || 'Engineer'}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-700"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Home onNavigate={setActiveTab} />}
          {activeTab === 'questions' && <QuestionBank />}
          {activeTab === 'interview' && <MockInterview />}
          {activeTab === 'jobs' && <JobParser />}
          {activeTab === 'cheatsheets' && <CheatSheets />}
          {activeTab === 'taxonomy' && <TaxonomyExplorer />}
          {activeTab === 'profile' && <Profile />}
        </div>
      </main>
    </div>
  );
};

export default App;