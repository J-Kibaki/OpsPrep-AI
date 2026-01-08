import React, { useState, useRef, useEffect } from 'react';
import { createMockInterviewSession } from '../services/gemini';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

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
  const [session, setSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <div>
           <h2 className="text-lg font-bold text-slate-100">Live Mock Interview</h2>
           <p className="text-xs text-slate-400">Session ID: #MOCK-{Math.floor(Math.random() * 10000)}</p>
        </div>
        <div className="px-3 py-1 bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-full animate-pulse">
           LIVE
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">
           AI can make mistakes. Verify important technical details.
        </p>
      </div>
    </div>
  );
};
