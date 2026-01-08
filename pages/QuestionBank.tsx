import React, { useState } from 'react';
import { generateQuestions, generateAnswerGuide } from '../services/gemini';
import { SKILL_TAXONOMY } from '../constants';
import { Question, AnswerGuide } from '../types';
import { Loader2, ChevronDown, ChevronUp, BookOpen, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  expanded: boolean;
  onToggle: () => void;
}

export const QuestionBank = () => {
  const [role, setRole] = useState('SRE');
  const [level, setLevel] = useState('Senior');
  const [cloud, setCloud] = useState('AWS');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Kubernetes']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (selectedTopics.length === 0) return;
    setLoading(true);
    setQuestions([]);
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
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Configuration Panel */}
      <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto shrink-0">
        <h2 className="text-xl font-bold text-slate-100 mb-6">Configuration</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Target Role</label>
            <select 
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option>SRE</option>
              <option>DevOps Engineer</option>
              <option>Platform Engineer</option>
              <option>Cloud Architect</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Seniority</label>
            <select 
              value={level} onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
              <option>Staff/Principal</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Cloud Provider</label>
            <select 
              value={cloud} onChange={(e) => setCloud(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option>AWS</option>
              <option>GCP</option>
              <option>Azure</option>
              <option>Hybrid/On-prem</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Focus Topics</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SKILL_TAXONOMY.categories).slice(0, 5).flatMap(([cat, tags]) => 
                tags.slice(0, 3).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTopic(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedTopics.includes(tag)
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center transition-colors"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Generate Questions'}
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {questions.length === 0 && !loading ? (
            <div className="text-center py-20 opacity-50">
              <BookOpen size={64} className="mx-auto mb-4 text-slate-600" />
              <p className="text-xl font-medium">Configure your session to generate interview scenarios.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <QuestionCard 
                  key={q.id || `q-${idx}`} 
                  question={q} 
                  expanded={expandedId === q.question_text} // Using text as ID if ID is missing or dup
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

  const fetchGuide = async () => {
    if (guide || loadingGuide) return;
    setLoadingGuide(true);
    const data = await generateAnswerGuide(question.question_text);
    setGuide(data);
    setLoadingGuide(false);
  };

  React.useEffect(() => {
    if (expanded && !guide) fetchGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  return (
    <div className={`bg-slate-900 border rounded-xl transition-all duration-300 ${expanded ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-800 hover:border-slate-700'}`}>
      <div 
        onClick={onToggle}
        className="p-6 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex space-x-2">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
              question.difficulty === 'Hard' ? 'bg-red-900/50 text-red-400' :
              question.difficulty === 'Medium' ? 'bg-amber-900/50 text-amber-400' :
              'bg-emerald-900/50 text-emerald-400'
            }`}>
              {question.difficulty}
            </span>
            <span className="flex items-center text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
              <Clock size={12} className="mr-1" /> {question.time_estimate_minutes} min
            </span>
          </div>
          {expanded ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
        </div>
        
        <h3 className="text-lg font-medium text-slate-200 leading-relaxed mb-4">
          {question.question_text}
        </h3>

        <div className="flex flex-wrap gap-2">
          {question.topic_tags?.map(tag => (
            <span key={tag} className="text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/30 p-6 animate-fadeIn">
          {loadingGuide ? (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <Loader2 className="animate-spin mr-3" /> Generating ideal answer outline...
            </div>
          ) : guide ? (
            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-400 flex items-center">
                  <CheckCircle size={16} className="mr-2" /> Ideal Answer Outline
                </h4>
                <ul className="list-disc list-outside pl-5 space-y-1 text-slate-300">
                  {guide.ideal_outline.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              {guide.technical_snippets && guide.technical_snippets.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-400">Example Command / Config</h4>
                  {guide.technical_snippets.map((snip, i) => (
                    <div key={i} className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                      <div className="bg-slate-900 px-3 py-1 text-xs text-slate-500 border-b border-slate-800 font-mono">
                        {snip.language}
                      </div>
                      <pre className="p-3 overflow-x-auto text-slate-300 font-mono text-xs">
                        <code>{snip.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-950/10 border border-red-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                    <AlertTriangle size={16} className="mr-2" /> Common Mistakes
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {guide.common_mistakes.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
                <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-400 mb-2">Pro Tip</h4>
                  <p className="text-slate-400 italic">"{guide.pro_tip}"</p>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-red-400">Failed to load answer guide.</div>
          )}
        </div>
      )}
    </div>
  );
};