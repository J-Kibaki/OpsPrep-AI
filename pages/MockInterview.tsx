import React, { useState, useRef, useEffect } from 'react';
import { createMockInterviewSession, evaluateInterview } from '../services/gemini';
import { Send, User, Bot, Loader2, StopCircle, Award, CheckCircle2, XCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { InterviewFeedback } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const MockInterview = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello. I'm your AI technical interviewer today. I'll be conducting a mock interview for a Senior SRE role. When you're ready, let me know, and we'll start with a quick introduction." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [session, setSession] = useState<Chat | null>(null);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setFeedback(result);
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
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <div>
           <h2 className="text-lg font-bold text-slate-100">Live Mock Interview</h2>
           <p className="text-xs text-slate-400">Session ID: #MOCK-{Math.floor(Math.random() * 10000)}</p>
        </div>
        <div className="flex items-center gap-3">
          {!feedback && (
              <div className="px-3 py-1 bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-full animate-pulse">
                LIVE
              </div>
          )}
          {feedback && (
             <button 
                onClick={handleRestart}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
             >
                Start New Session
             </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'model' ? 'bg-indigo-600' : 'bg-slate-600'
            }`}>
              {msg.role === 'model' ? <Bot size={16} text-white /> : <User size={16} text-white />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'model' 
                ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {loading && (
           <div className="flex items-start space-x-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
               <Bot size={16} className="text-white" />
             </div>
             <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
               <Loader2 className="animate-spin text-slate-400" size={18} />
             </div>
           </div>
        )}

        {/* Feedback Scorecard */}
        {feedback && (
          <div className="animate-fadeIn mt-8 mb-4">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Score Header */}
                <div className="bg-slate-800/50 p-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-2xl font-bold text-white">{feedback.score}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-100">Interview Evaluation</h3>
                            <p className="text-slate-400 text-sm">Completed {new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                       <ScoreBadge score={feedback.score} />
                    </div>
                </div>
                
                {/* Detailed Feedback */}
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                            <TrendingUp size={16} className="mr-2" /> Executive Summary
                        </h4>
                        <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
                            {feedback.summary}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-emerald-950/10 border border-emerald-900/20 p-4 rounded-xl">
                            <h4 className="text-emerald-400 font-bold mb-3 flex items-center text-sm">
                                <CheckCircle2 size={16} className="mr-2" /> Strengths
                            </h4>
                            <ul className="space-y-2">
                                {feedback.strengths.map((item, i) => (
                                    <li key={i} className="text-slate-400 text-xs flex items-start">
                                        <span className="mr-2 text-emerald-500/50">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-950/10 border border-red-900/20 p-4 rounded-xl">
                            <h4 className="text-red-400 font-bold mb-3 flex items-center text-sm">
                                <XCircle size={16} className="mr-2" /> Areas for Improvement
                            </h4>
                            <ul className="space-y-2">
                                {feedback.weaknesses.map((item, i) => (
                                    <li key={i} className="text-slate-400 text-xs flex items-start">
                                        <span className="mr-2 text-red-500/50">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-indigo-900/10 border border-indigo-900/30 p-5 rounded-xl">
                        <h4 className="text-indigo-400 font-bold mb-3 flex items-center text-sm">
                            <Lightbulb size={16} className="mr-2" /> Recommended Actions
                        </h4>
                        <ul className="space-y-2">
                            {feedback.improvement_tips.map((tip, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-start">
                                    <span className="min-w-[20px] text-indigo-500 font-bold mr-1">{i + 1}.</span>
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
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        {!feedback ? (
            <>
                <div className="relative mb-3">
                <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    placeholder="Type your answer..."
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
                
                <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">
                    AI can make mistakes. Verify important technical details.
                    </p>
                    <button 
                        onClick={handleEndInterview}
                        disabled={messages.length < 3 || loading || evaluating}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium border border-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {evaluating ? <Loader2 size={14} className="animate-spin" /> : <StopCircle size={14} />}
                        <span>{evaluating ? 'Generating Report...' : 'End & Evaluate'}</span>
                    </button>
                </div>
            </>
        ) : (
            <div className="text-center py-4 text-slate-400 text-sm">
                Session closed. Review your scorecard above.
            </div>
        )}
      </div>
    </div>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
    let color = 'bg-red-500';
    let label = 'Needs Work';
    
    if (score >= 90) { color = 'bg-emerald-500'; label = 'Excellent'; }
    else if (score >= 75) { color = 'bg-indigo-500'; label = 'Strong'; }
    else if (score >= 60) { color = 'bg-amber-500'; label = 'Competent'; }

    return (
        <span className={`${color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
            {label}
        </span>
    );
};