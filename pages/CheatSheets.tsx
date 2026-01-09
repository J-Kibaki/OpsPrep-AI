import React, { useState } from 'react';
import { generateCheatSheet } from '../services/gemini';
import { CheatSheet } from '../types';
import { SKILL_TAXONOMY } from '../constants';
import { Loader2, Terminal, Copy, Check, FileCode, Layers, Search } from 'lucide-react';

const CheatSheets = () => {
    const [topic, setTopic] = useState('Linux Networking');
    const [cheatSheet, setCheatSheet] = useState<CheatSheet | null>(null);
    const [loading, setLoading] = useState(false);
    const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setCheatSheet(null);
        const result = await generateCheatSheet(topic);
        setCheatSheet(result);
        setLoading(false);
    };

    const handleCopy = (cmd: string) => {
        navigator.clipboard.writeText(cmd);
        setCopiedCmd(cmd);
        setTimeout(() => setCopiedCmd(null), 2000);
    };

    const suggestedTopics = [
        "Kubectl Debugging", "Git Flow", "Docker Lifecycle", 
        "Linux Performance (BCC/BPF)", "Terraform CLI", "AWS S3 Commands"
    ];

    return (
        <div className="h-full flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 bg-slate-900 border-r border-slate-800 p-6 flex flex-col shrink-0">
                <div className="flex items-center space-x-2 mb-6 text-indigo-400">
                    <FileCode size={24} />
                    <h2 className="text-xl font-bold text-slate-100">Cheat Sheets</h2>
                </div>
                
                <p className="text-slate-400 text-sm mb-6">
                    Generate instant, production-grade reference guides for any DevOps tool or concept.
                </p>

                <div className="space-y-4 mb-8">
                    <div>
                        <label className="text-sm font-medium text-slate-400 mb-1 block">Custom Topic</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="e.g. Nginx Config"
                            />
                            <Search className="absolute right-3 top-2.5 text-slate-600" size={16} />
                        </div>
                    </div>
                    
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Generate Guide'}
                    </button>
                </div>

                <div className="space-y-2">
                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Popular Topics</p>
                     <div className="flex flex-wrap gap-2">
                        {suggestedTopics.map(t => (
                            <button 
                                key={t}
                                onClick={() => setTopic(t)}
                                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700 transition-colors text-left"
                            >
                                {t}
                            </button>
                        ))}
                     </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-10 relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-950/50 backdrop-blur-sm">
                        <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                        <p className="text-slate-400 animate-pulse">Consulting the documentation...</p>
                    </div>
                )}

                {!cheatSheet && !loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
                        <FileCode size={64} className="mb-4" />
                        <p className="text-lg font-medium">Select a topic to generate a cheat sheet.</p>
                    </div>
                ) : cheatSheet ? (
                    <div className="max-w-4xl mx-auto animate-fadeIn pb-10">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-slate-100 mb-2">{cheatSheet.topic}</h1>
                            <p className="text-lg text-slate-400 border-l-4 border-indigo-500 pl-4">
                                {cheatSheet.introduction}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {cheatSheet.sections.map((section, idx) => (
                                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                    <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex items-center">
                                        <Layers size={18} className="text-indigo-400 mr-2" />
                                        <h3 className="font-bold text-slate-200">{section.title}</h3>
                                    </div>
                                    <div className="divide-y divide-slate-800">
                                        {section.items.map((item, itemIdx) => (
                                            <div key={itemIdx} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-start group">
                                                <div className="flex-1 min-w-0 mr-4 mb-2 sm:mb-0">
                                                    <div className="flex items-center mb-1">
                                                        <code className="text-emerald-400 font-mono text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800 break-all">
                                                            {item.command}
                                                        </code>
                                                        <button 
                                                            onClick={() => handleCopy(item.command)}
                                                            className="ml-2 text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Copy command"
                                                        >
                                                            {copiedCmd === item.command ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="sm:w-1/2 text-sm text-slate-400 pt-1">
                                                    {item.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default CheatSheets;
