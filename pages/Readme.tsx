import React from 'react';
import { Terminal, Cpu, Database, Shield, FileText, Info } from 'lucide-react';

export const Readme = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12 animate-fadeIn">
        {/* Header */}
        <div className="border-b border-slate-800 pb-8">
            <div className="flex items-center space-x-3 mb-4">
                 <div className="p-2 bg-indigo-600 rounded-lg">
                    <Cpu size={32} className="text-white" />
                 </div>
                 <h1 className="text-4xl font-bold text-slate-100">OpsPrep AI</h1>
            </div>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                An intelligent interview preparation platform for DevOps and Site Reliability Engineers, powered by Google Gemini.
            </p>
        </div>

        {/* Features */}
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-200 flex items-center">
                <Database className="mr-3 text-indigo-400" /> Core Capabilities
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <FeatureCard 
                    icon={Terminal}
                    title="Scenario Question Generator"
                    desc="Generate role-specific technical questions based on seniority, cloud provider (AWS/GCP/Azure), and topics like Kubernetes, Terraform, and Observability."
                />
                <FeatureCard 
                    icon={FileText}
                    title="Intelligent Job Parser"
                    desc="Paste raw job descriptions to extract structured data, salary ranges, and required skills, mapping them to a canonical taxonomy."
                />
                <FeatureCard 
                    icon={Shield}
                    title="Deep Answer Guides"
                    desc="Get detailed answer outlines with key concepts, architecture diagrams (text-based), common pitfalls, and senior-level 'Pro Tips'."
                />
                 <FeatureCard 
                    icon={Cpu}
                    title="Live Mock Interview"
                    desc="Engage in a chat-based mock interview with an AI persona that adapts to your responses and probes for deeper understanding."
                />
            </div>
        </section>

        {/* Tech Stack */}
         <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-200 flex items-center">
                <Terminal className="mr-3 text-emerald-400" /> Technical Architecture
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <ul className="space-y-4">
                    <li className="flex flex-col sm:flex-row sm:items-start">
                        <span className="font-mono text-indigo-400 min-w-[140px] font-semibold">Frontend</span>
                        <span className="text-slate-300">React 18, TypeScript, Tailwind CSS, Lucide Icons</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-start">
                        <span className="font-mono text-indigo-400 min-w-[140px] font-semibold">AI Model</span>
                        <span className="text-slate-300">Google Gemini 2.5 Flash (via @google/genai SDK)</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-start">
                        <span className="font-mono text-indigo-400 min-w-[140px] font-semibold">State Mgmt</span>
                        <span className="text-slate-300">Local React State (Context-free for MVP simplicity)</span>
                    </li>
                     <li className="flex flex-col sm:flex-row sm:items-start">
                        <span className="font-mono text-indigo-400 min-w-[140px] font-semibold">Styling</span>
                        <span className="text-slate-300">Mobile-first responsive design, Dark mode default</span>
                    </li>
                </ul>
            </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-amber-900/10 border border-amber-900/30 p-6 rounded-xl">
             <h3 className="text-amber-400 font-bold mb-2 flex items-center">
                <Info size={18} className="mr-2" /> AI Disclaimer
             </h3>
             <p className="text-slate-400 text-sm leading-relaxed">
                This application uses Large Language Models (LLMs) to generate content. While designed to provide high-quality training data, the AI models can occasionally hallucinate commands, syntax, or facts. Always verify critical technical details with official documentation (e.g., Kubernetes docs, AWS Whitepapers) before applying them in production environments.
             </p>
        </section>
        
        <footer className="pt-8 text-center text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} OpsPrep AI. Built for the Google AI Studio Hackathon.
        </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/30 transition-colors">
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
            <Icon size={20} />
        </div>
        <h3 className="font-bold text-slate-200 mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
);
