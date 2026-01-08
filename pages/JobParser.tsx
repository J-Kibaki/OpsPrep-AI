import React, { useState } from 'react';
import { parseJobDescription } from '../services/gemini';
import { Job } from '../types';
import { Loader2, ArrowRight, Building2, MapPin, DollarSign, Briefcase } from 'lucide-react';

export const JobParser = () => {
  const [rawText, setRawText] = useState('');
  const [parsedJob, setParsedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    const result = await parseJobDescription(rawText);
    setParsedJob(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Input Side */}
      <div className="flex-1 bg-slate-900 p-6 flex flex-col border-r border-slate-800">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Job Parser</h2>
        <p className="text-slate-400 mb-6">Paste a raw job description to extract structured data and skills.</p>
        
        <textarea
          className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          placeholder="Paste Job Description here..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleParse}
            disabled={loading || !rawText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg flex items-center transition-colors"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Analyze Job
            {!loading && <ArrowRight className="ml-2" size={18} />}
          </button>
        </div>
      </div>

      {/* Output Side */}
      <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
        {!parsedJob ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
             <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                <Briefcase size={32} />
             </div>
             <p className="text-lg">Parsed results will appear here.</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div>
                   <h3 className="text-2xl font-bold text-slate-100">{parsedJob.job_title}</h3>
                   <div className="flex items-center text-indigo-400 mt-1">
                      <Building2 size={16} className="mr-2" />
                      <span className="font-medium">{parsedJob.company_name}</span>
                   </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    parsedJob.seniority_level === 'Senior' || parsedJob.seniority_level === 'Principal' 
                    ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
                    : 'bg-blue-900/30 text-blue-400 border border-blue-800'
                  }`}>
                    {parsedJob.seniority_level}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center">
                  <MapPin size={18} className="text-slate-500 mr-3" />
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm font-medium text-slate-200">{parsedJob.location_raw} ({parsedJob.work_mode})</p>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center">
                  <DollarSign size={18} className="text-slate-500 mr-3" />
                  <div>
                    <p className="text-xs text-slate-500">Salary</p>
                    <p className="text-sm font-medium text-slate-200">
                      {parsedJob.salary.min ? `${parsedJob.salary.currency || '$'}${parsedJob.salary.min.toLocaleString()} - ` : ''}
                      {parsedJob.salary.max ? `${parsedJob.salary.max.toLocaleString()}` : 'Not listed'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div>
              <h4 className="text-sm uppercase font-semibold text-slate-500 mb-3 tracking-wider">Detected Skills</h4>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex flex-wrap gap-2">
                  {parsedJob.required_skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1.5 bg-indigo-950/30 border border-indigo-900/50 text-indigo-300 rounded-md text-sm font-medium hover:bg-indigo-900/40 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

             {/* Confidence Metric */}
            <div className="flex items-center justify-end text-xs text-slate-500">
               <span>AI Extraction Confidence: </span>
               <div className="w-24 h-1.5 bg-slate-800 rounded-full ml-2 overflow-hidden">
                 <div 
                    className="h-full bg-emerald-500" 
                    style={{width: `${(parsedJob.extraction_confidence_score || 0.85) * 100}%`}}
                 ></div>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
