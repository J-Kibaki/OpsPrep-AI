import React, { useState, useRef, useEffect } from 'react';
import { createMockInterviewSession, evaluateInterview } from '../services/gemini';
import { Send, User, Bot, Loader2, StopCircle, Award, CheckCircle2, XCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { InterviewFeedback } from '../types';
import { useUser } from '../context/UserContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const MockInterview = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello. I'm your AI technical interviewer today. I'll be conducting a mock interview for a Senior SRE role. When you're ready, let me know, and we'll start with a quick introduction." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [session, setSession] = useState<Chat | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { addActivity } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, feedback]);

  // Initialize chat session once
  useEffect(() => {
    const sysPrompt = `You are a strict but fair Principal Site Reliability Engineer at Google conducting a technical interview. 
    1. Start by asking the candidate to introduce themselves.
    2. Then, move to technical questions about Linux, Networking, and Kubernetes.
    3. If the candidate answers vaguely, probe deeper with "Why?" or "Can you explain how that works under the hood?".
    4. Keep your responses relatively short (under 150 words) to keep the conversation flowing naturally.
    5. Be professional, slightly intimidating but constructive.`;
    
    setSession(createMockInterviewSession(sysPrompt));
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !session) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response: GenerateContentResponse = await session.sendMessage({
          message: userMsg
      });
      const text = response.text || "I apologize, I didn't catch that.";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    if (messages.length < 3) return; // Don't evaluate empty sessions
    setEvaluating(true);
    const result = await evaluateInterview(messages);
    if (result) {
        setFeedback(result);
        // Log to backend/context
        addActivity('interview', 'Mock SRE Interview', result.score);
    }
    setEvaluating(false);
  };

  const handleRestart = () => {
    setMessages([
      { role: 'model', text: "Hello. I'm your AI technical interviewer today. I'll be conducting a mock interview for a Senior SRE role. When you're ready, let me know, and we'll start with a quick introduction." }
    ]);
    setFeedback(null);
    setInput('');
    const sysPrompt = `You are a strict but fair Principal Site Reliability Engineer at Google conducting a technical interview. 
    1. Start by asking the candidate to introduce themselves.
    2. Then, move to technical questions about Linux, Networking, and Kubernetes.
    3. If the candidate answers vaguely, probe deeper with "Why?" or "Can you explain how that works under the hood?".
    4. Keep your responses relatively short (under 150 words) to keep the conversation flowing naturally.
    5. Be professional, slightly intimidating but constructive.`;
    setSession(createMockInterviewSession(sysPrompt));
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex flex-col">
           <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate max-w-[150px] sm:max-w-none">Live Mock Interview</h2>
           <p className="text-[10px] sm:text-xs text-slate-300">Principal SRE Persona</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {!feedback && (
              <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] sm:text-xs rounded-full animate-pulse font-bold">
                LIVE
              </div>
          )}
          {feedback && (
             <button 
                onClick={handleRestart}
                className="text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors whitespace-nowrap"
             >
                New Session
             </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start space-x-2 sm:space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
              msg.role === 'model' ? 'bg-indigo-600' : 'bg-slate-600'
            }`}>
              {msg.role === 'model' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-white" />}
            </div>
            <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
              msg.role === 'model' 
                ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700' 
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
           <div className="flex items-start space-x-3">
             <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center">
               <Bot size={14} className="text-white" />
             </div>
             <div className="bg-slate-800 p-3 sm:p-4 rounded-2xl rounded-tl-none border border-slate-700">
               <Loader2 className="animate-spin text-slate-300" size={16} />
             </div>
           </div>
        )}

        {/* Feedback Scorecard */}
        {feedback && (
          <div className="animate-fadeIn mt-8 mb-4">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Score Header */}
                <div className="bg-slate-800/50 p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-950 border-4 border-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                            <span className="text-xl sm:text-2xl font-bold text-white">{feedback.score}</span>
                        </div>
                        <div>
                            <h3 className="text-base sm:text-xl font-bold text-slate-100">Evaluation</h3>
                            <p className="text-slate-300 text-[10px] sm:text-sm">Completed {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                       <ScoreBadge score={feedback.score} />
                    </div>
                </div>
                
                {/* Detailed Feedback */}
                <div className="p-4 sm:p-6 space-y-6">
                    <div>
                        <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                            <TrendingUp size={14} className="mr-2" /> Executive Summary
                        </h4>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed border-l-2 border-slate-700 pl-4 italic">
                            {feedback.summary}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-emerald-950/10 border border-emerald-900/20 p-3 sm:p-4 rounded-xl">
                            <h4 className="text-emerald-400 font-bold mb-3 flex items-center text-xs sm:text-sm">
                                <CheckCircle2 size={14} className="mr-2" /> Strengths
                            </h4>
                            <ul className="space-y-2">
                                {feedback.strengths.map((item, i) => (
                                    <li key={i} className="text-slate-300 text-[11px] sm:text-xs flex items-start">
                                        <span className="mr-2 text-emerald-500/50 mt-0.5">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-950/10 border border-red-900/20 p-3 sm:p-4 rounded-xl">
                            <h4 className="text-red-400 font-bold mb-3 flex items-center text-xs sm:text-sm">
                                <XCircle size={14} className="mr-2" /> Improvements
                            </h4>
                            <ul className="space-y-2">
                                {feedback.weaknesses.map((item, i) => (
                                    <li key={i} className="text-slate-300 text-[11px] sm:text-xs flex items-start">
                                        <span className="mr-2 text-red-500/50 mt-0.5">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-indigo-900/10 border border-indigo-900/30 p-4 sm:p-5 rounded-xl">
                        <h4 className="text-indigo-400 font-bold mb-3 flex items-center text-xs sm:text-sm">
                            <Lightbulb size={14} className="mr-2" /> Action Plan
                        </h4>
                        <ul className="space-y-3">
                            {feedback.improvement_tips.map((tip, i) => (
                                <li key={i} className="text-slate-200 text-[11px] sm:text-sm flex items-start">
                                    <span className="min-w-[18px] text-indigo-400 font-bold mr-1">{i + 1}.</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
             </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Controls */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 sticky bottom-0">
        {!feedback ? (
            <>
                <div className="relative mb-3">
                <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    placeholder="Your answer..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading || evaluating}
                />
                <button 
                    onClick={handleSend}
                    disabled={loading || evaluating || !input.trim()}
                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[10px] text-slate-400 text-center sm:text-left order-2 sm:order-1">
                        Use specific examples for a better score.
                    </p>
                    <button 
                        onClick={handleEndInterview}
                        disabled={messages.length < 3 || loading || evaluating}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                    >
                        {evaluating ? <Loader2 size={14} className="animate-spin" /> : <StopCircle size={14} />}
                        <span>{evaluating ? 'Analyzing...' : 'End Interview'}</span>
                    </button>
                </div>
            </>
        ) : (
            <div className="text-center py-2 text-slate-400 text-[11px] font-medium">
                Review your scorecard above and start a new session when ready.
            </div>
        )}
      </div>
    </div>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
    let color = 'bg-red-600';
    let label = 'Needs Work';
    
    if (score >= 90) { color = 'bg-emerald-600'; label = 'Excellent'; }
    else if (score >= 75) { color = 'bg-indigo-600'; label = 'Strong'; }
    else if (score >= 60) { color = 'bg-amber-600'; label = 'Competent'; }

    return (
        <span className={`${color} text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
            {label}
        </span>
    );
};

export default MockInterview;
