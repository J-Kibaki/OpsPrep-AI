import React, { useState, useEffect } from 'react';
import { generateQuestions, generateAnswerGuide } from '../services/gemini';
import { SKILL_TAXONOMY } from '../constants';
import { Question, AnswerGuide } from '../types';
import { 
  Loader2, ChevronDown, ChevronUp, BookOpen, Clock, 
  AlertTriangle, CheckCircle, Copy, Check, Lightbulb, 
  Hash, ListChecks, ArrowRightCircle, Filter, X
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  expanded: boolean;
  onToggle: () => void;
}

const QuestionBank = ({ initialTopic }: { initialTopic?: string }) => {
  const [role, setRole] = useState('SRE');
  const [level, setLevel] = useState('Senior');
  const [cloud, setCloud] = useState('AWS');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Kubernetes']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false); // For mobile

  useEffect(() => {
    if (initialTopic) {
        setSelectedTopics([initialTopic]);
    }
  }, [initialTopic]);

  const handleGenerate = async () => {
    if (selectedTopics.length === 0) return;
    setLoading(true);
    setQuestions([]);
    setShowConfig(false); // Close drawer on mobile
    const result = await generateQuestions(role, level, cloud, selectedTopics);
    setQuestions(result);
    setLoading(false);
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
      
      {/* Mobile Header/Filter Toggle */}
      <div className="lg:hidden p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-20">
         <h2 className="font-bold text-slate-100 flex items-center">
            <BookOpen size={18} className="mr-2 text-indigo-400" /> Question Bank
         </h2>
         <button 
            onClick={() => setShowConfig(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold text-white"
         >
            <Filter size={14} /> <span>Configure</span>
         </button>
      </div>

      {/* Configuration Panel (Desktop & Mobile Drawer) */}
      <div className={`
        fixed lg:static inset-0 lg:inset-auto z-40 w-full lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0
        transform transition-transform duration-300 ${showConfig ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 lg:p-6 border-b border-slate-800 lg:border-none flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100">Settings</h2>
            <button onClick={() => setShowConfig(false)} className="lg:hidden text-slate-400 p-2">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Target Role</label>
            <select 
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option>SRE</option>
              <option>DevOps Engineer</option>
              <option>Platform Engineer</option>
              <option>Cloud Architect</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Seniority</label>
            <select 
              value={level} onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
              <option>Staff/Principal</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Focus Topics</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SKILL_TAXONOMY.categories).slice(0, 4).flatMap(([cat, tags]) => 
                tags.slice(0, 3).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTopic(tag)}
                    className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                      selectedTopics.includes(tag)
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || selectedTopics.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Generate Scenarios'}
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {questions.length === 0 && !loading ? (
            <div className="text-center py-16 sm:py-24 opacity-40">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="text-lg font-medium">Configure settings to start.</p>
              {initialTopic && (
                 <p className="text-xs text-indigo-400 mt-2 font-bold">Recommended: {initialTopic}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {questions.map((q, idx) => (
                <QuestionCard 
                  key={q.id || `q-${idx}`} 
                  question={q} 
                  expanded={expandedId === q.question_text} 
                  onToggle={() => setExpandedId(expandedId === q.question_text ? null : q.question_text)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, expanded, onToggle }) => {
  const [guide, setGuide] = useState<AnswerGuide | null>(null);
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchGuide = async () => {
    if (guide || loadingGuide) return;
    setLoadingGuide(true);
    const data = await generateAnswerGuide(question.question_text);
    setGuide(data);
    setLoadingGuide(false);
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  React.useEffect(() => {
    if (expanded && !guide) fetchGuide();
  }, [expanded]);

  return (
    <div className={`bg-slate-900 border rounded-2xl transition-all duration-300 ${expanded ? 'border-indigo-500 ring-1 ring-indigo-500/30 shadow-2xl' : 'border-slate-800 hover:border-slate-700'}`}>
      <div 
        onClick={onToggle}
        className="p-4 sm:p-6 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              question.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {question.difficulty}
            </span>
            <span className="flex items-center text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full font-medium">
              <Clock size={10} className="mr-1" /> {question.time_estimate_minutes}m
            </span>
          </div>
          {expanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
        </div>
        
        <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed mb-4">
          {question.question_text}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {question.topic_tags?.map(tag => (
            <span key={tag} className="text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/40 p-4 sm:p-6 animate-fadeIn">
          {loadingGuide ? (
            <div className="flex items-center justify-center py-10 text-slate-500 text-xs sm:text-sm">
              <Loader2 className="animate-spin mr-3" size={18} /> Consulting reference material...
            </div>
          ) : guide ? (
            <div className="space-y-8">
              
              {/* Key Concepts */}
              {guide.key_concepts && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mr-2">Core Concepts:</span>
                  {guide.key_concepts.map((concept, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {concept}
                    </span>
                  ))}
                </div>
              )}

              {/* Outline */}
              <div className="space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center">
                  <ListChecks size={16} className="mr-2 text-indigo-400" /> Strategic Response Flow
                </h4>
                <div className="pl-3 border-l-2 border-slate-800 space-y-4">
                  {guide.ideal_outline.map((step, i) => (
                    <div key={i} className="relative pl-5">
                      <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-slate-700 ring-2 ring-slate-900" />
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code */}
              {guide.technical_snippets && guide.technical_snippets.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center">
                     <BookOpen size={16} className="mr-2 text-emerald-400" /> Implementation Example
                  </h4>
                  <div className="space-y-4">
                    {guide.technical_snippets.map((snip, i) => (
                      <div key={i} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                        <div className="bg-slate-900/50 px-3 py-2 flex items-center justify-between border-b border-slate-800">
                           <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest">{snip.language}</span>
                           <button 
                             onClick={() => handleCopy(snip.code, i)}
                             className="text-slate-500 hover:text-white p-1 transition-colors"
                           >
                             {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                           </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-slate-300 font-mono text-[10px] sm:text-xs leading-relaxed custom-scrollbar">
                          <code>{snip.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                  <h4 className="text-red-400 font-bold mb-3 flex items-center text-[11px] sm:text-xs uppercase">
                    <AlertTriangle size={14} className="mr-2" /> Red Flags
                  </h4>
                  <ul className="space-y-2">
                    {guide.common_mistakes.map((m, i) => (
                      <li key={i} className="text-slate-500 text-[11px] sm:text-xs flex items-start">
                        <span className="mr-2 text-red-500/50">•</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4">
                  <h4 className="text-indigo-400 font-bold mb-3 flex items-center text-[11px] sm:text-xs uppercase">
                    <Lightbulb size={14} className="mr-2" /> Principal Tip
                  </h4>
                  <p className="text-slate-300 text-[11px] sm:text-xs italic leading-relaxed">
                    "{guide.pro_tip}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center py-6 text-red-400 text-xs font-bold">
                Generation failed. Please retry.
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
