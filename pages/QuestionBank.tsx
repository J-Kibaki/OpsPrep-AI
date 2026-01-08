import React, { useState } from 'react';
import { generateQuestions, generateAnswerGuide } from '../services/gemini';
import { SKILL_TAXONOMY } from '../constants';
import { Question, AnswerGuide } from '../types';
import { 
  Loader2, ChevronDown, ChevronUp, BookOpen, Clock, 
  AlertTriangle, CheckCircle, Copy, Check, Lightbulb, 
  Hash, ListChecks, ArrowRightCircle 
} from 'lucide-react';

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
            <div className="space-y-8 text-sm">
              
              {/* Key Concepts - Pills */}
              {guide.key_concepts && guide.key_concepts.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mr-2">Key Concepts:</span>
                  {guide.key_concepts.map((concept, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      <Hash size={10} className="mr-1 opacity-50" />{concept}
                    </span>
                  ))}
                </div>
              )}

              {/* Answer Outline - Timeline Style */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-200 flex items-center text-base">
                  <ListChecks size={18} className="mr-2 text-indigo-400" /> Ideal Answer Flow
                </h4>
                <div className="pl-4 border-l-2 border-slate-800 space-y-6">
                  {guide.ideal_outline.map((step, i) => (
                    <div key={i} className="relative pl-6">
                      <span className="absolute -left-[21px] top-0 h-3 w-3 rounded-full bg-slate-700 ring-4 ring-slate-900 border-2 border-indigo-500/50" />
                      <p className="text-slate-300 leading-relaxed text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Snippets - Terminal Style */}
              {guide.technical_snippets && guide.technical_snippets.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-200 flex items-center text-base">
                     <BookOpen size={18} className="mr-2 text-emerald-400" /> Technical Implementation
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {guide.technical_snippets.map((snip, i) => (
                      <div key={i} className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden group">
                        <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800">
                           <div className="flex items-center space-x-2">
                             <div className="flex space-x-1">
                               <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                             </div>
                             <span className="text-xs text-slate-500 font-mono ml-2 uppercase">{snip.language}</span>
                             {snip.caption && <span className="text-xs text-slate-500 border-l border-slate-700 pl-2 ml-2 truncate max-w-[200px]">{snip.caption}</span>}
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleCopy(snip.code, i); }}
                             className="text-slate-500 hover:text-white transition-colors p-1"
                           >
                             {copiedIndex === i ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} />}
                           </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-slate-300 font-mono text-xs leading-relaxed bg-slate-950/50">
                          <code>{snip.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Red Flags */}
                <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-5">
                  <h4 className="font-bold text-red-400 mb-3 flex items-center">
                    <AlertTriangle size={18} className="mr-2" /> Red Flags
                  </h4>
                  <ul className="space-y-2">
                    {guide.common_mistakes.map((m, i) => (
                      <li key={i} className="text-slate-400 text-xs flex items-start">
                        <span className="mr-2 text-red-500/50">•</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Pro Tip */}
                <div className="relative bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-indigo-500/30 rounded-xl p-5 overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Lightbulb size={64} className="text-indigo-400" />
                  </div>
                  <h4 className="font-bold text-indigo-400 mb-2 flex items-center relative z-10">
                    <Lightbulb size={18} className="mr-2" /> Principal Engineer Tip
                  </h4>
                  <p className="text-slate-300 italic relative z-10 leading-relaxed border-l-2 border-indigo-500/50 pl-3">
                    "{guide.pro_tip}"
                  </p>
                </div>
              </div>

              {/* Follow Up */}
              {guide.follow_up_questions && guide.follow_up_questions.length > 0 && (
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="font-bold text-slate-200 mb-3 flex items-center text-sm">
                    <ArrowRightCircle size={16} className="mr-2 text-slate-500" /> Digging Deeper (Follow-ups)
                  </h4>
                  <div className="flex flex-col space-y-2">
                     {guide.follow_up_questions.map((q, i) => (
                       <div key={i} className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer text-xs flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-2"></span>
                          {q}
                       </div>
                     ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-8 text-red-400 space-y-2">
                <AlertTriangle size={24} />
                <p>Failed to load answer guide. Please try again.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
