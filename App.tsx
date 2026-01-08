import React, { useState } from 'react';
import { Terminal, BookOpen, Briefcase, MessageSquare, Menu, X, Cpu, FileText, FileCode } from 'lucide-react';
import { Home } from './pages/Home';
import { QuestionBank } from './pages/QuestionBank';
import { JobParser } from './pages/JobParser';
import { MockInterview } from './pages/MockInterview';
import { Readme } from './pages/Readme';
import { CheatSheets } from './pages/CheatSheets';

// Since we cannot use React Router's URL syncing in this environment easily, 
// we will use a simple state-based router for the MVP.
type View = 'home' | 'questions' | 'jobs' | 'mock' | 'cheatsheets' | 'readme';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onNavigate={setCurrentView} />;
      case 'questions': return <QuestionBank />;
      case 'jobs': return <JobParser />;
      case 'mock': return <MockInterview />;
      case 'cheatsheets': return <CheatSheets />;
      case 'readme': return <Readme />;
      default: return <Home onNavigate={setCurrentView} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        // On mobile, auto-close sidebar after selection
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
      }}
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
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Cpu size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            OpsPrep AI
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem view="home" icon={Terminal} label="Dashboard" />
          <NavItem view="questions" icon={BookOpen} label="Question Bank" />
          <NavItem view="cheatsheets" icon={FileCode} label="Cheat Sheets" />
          <NavItem view="jobs" icon={Briefcase} label="Job Parser" />
          <NavItem view="mock" icon={MessageSquare} label="Mock Interview" />
          <div className="pt-4 mt-4 border-t border-slate-800">
             <NavItem view="readme" icon={FileText} label="Documentation" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-2">My Stats</p>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Mastery</span>
              <span className="text-indigo-400">12%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[12%]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative w-full h-screen">
        {renderView()}
      </main>
    </div>
  );
}