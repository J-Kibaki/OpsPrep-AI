import React, { useState, useMemo } from 'react';
import { parseJobDescription } from '../services/gemini';
import { Job } from '../types';
import { Loader2, ArrowRight, Building2, MapPin, DollarSign, Search, X, CheckCircle2, List, Target, ShieldCheck, Briefcase, Zap, AlertCircle, BarChart2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const MOCK_JOBS: Job[] = [
  {
    job_title: "Senior Site Reliability Engineer",
    company_name: "TechFlow Systems",
    location_raw: "San Francisco, CA",
    work_mode: "Hybrid",
    seniority_level: "Senior",
    salary: { min: 160000, max: 210000, currency: "$" },
    required_skills: ["Kubernetes", "Go", "Terraform", "AWS", "Prometheus"],
    responsibilities: [
      "Design and implement scalable infrastructure using Terraform and AWS.",
      "Manage Kubernetes clusters in production environments (EKS).",
      "Improve system reliability and observability using Prometheus and Grafana.",
      "Lead incident response and conduct post-mortems."
    ],
    requirements: [
      "5+ years of experience in SRE or DevOps roles.",
      "Deep understanding of Linux internals and networking.",
      "Proficiency in Go or Python for automation.",
      "Experience with service mesh (Istio/Linkerd) is a plus."
    ],
    benefits: ["Equity package", "Unlimited PTO", "Health & Dental", "Remote-first culture"],
    extraction_confidence_score: 0.95
  },
  {
    job_title: "DevOps Engineer II",
    company_name: "CloudNative Corp",
    location_raw: "Remote",
    work_mode: "Remote",
    seniority_level: "Mid",
    salary: { min: 130000, max: 160000, currency: "$" },
    required_skills: ["Azure", "CI/CD", "Docker", "Python", "Ansible"],
    responsibilities: [
        "Build and maintain CI/CD pipelines using Azure DevOps.",
        "Containerize legacy applications using Docker.",
        "Automate configuration management with Ansible.",
        "Assist developers with troubleshooting deployment issues."
    ],
    requirements: [
        "3+ years experience with Cloud Infrastructure.",
        "Strong scripting skills (Python/Bash).",
        "Experience with Azure cloud services."
    ],
    benefits: ["401k Match", "Remote Stipend", "Learning Budget"],
    extraction_confidence_score: 0.92
  },
  {
    job_title: "Platform Engineer",
    company_name: "DataScale",
    location_raw: "New York, NY",
    work_mode: "Onsite",
    seniority_level: "Senior",
    salary: { min: 180000, max: 240000, currency: "$" },
    required_skills: ["GCP", "Kubernetes", "Istio", "Java", "ArgoCD"],
    responsibilities: [
        "Develop the internal developer platform (IDP).",
        "Manage GitOps workflows with ArgoCD.",
        "Ensure security compliance for all cloud resources."
    ],
    requirements: [
        "Experience building IDPs using Backstage or similar.",
        "Expert knowledge of GCP and GKE.",
        "Java experience is highly preferred."
    ],
    extraction_confidence_score: 0.89
  }
];

export const JobParser = ({ onNavigate }: { onNavigate?: (view: any, params?: any) => void }) => {
  const [rawText, setRawText] = useState('');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    const result = await parseJobDescription(rawText);
    if (result) {
      setJobs(prev => [result, ...prev]);
      setRawText('');
      setSelectedJob(result); // Auto-open the result
    }
    setLoading(false);
  };

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return jobs.filter(job => 
      job.job_title.toLowerCase().includes(query) ||
      job.company_name.toLowerCase().includes(query) ||
      job.location_raw.toLowerCase().includes(query) ||
      job.required_skills.some(skill => skill.toLowerCase().includes(query))
    );
  }, [jobs, searchQuery]);

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden relative">
      {/* Input Side */}
      <div className="flex-1 bg-slate-900 p-6 flex flex-col border-r border-slate-800 lg:max-w-md xl:max-w-lg">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Job Parser</h2>
        <p className="text-slate-400 mb-6">Paste a raw job description to extract structured data and skills.</p>
        
        <div className="flex-1 flex flex-col relative group">
           <textarea
            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4 transition-all"
            placeholder="Paste Job Description here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          {!rawText && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Briefcase size={64} />
             </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleParse}
            disabled={loading || !rawText.trim()}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/20"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Zap size={18} className="mr-2 fill-current" />}
            Analyze Job
          </button>
        </div>
      </div>

      {/* Output Side - Job Repository */}
      <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search by title, company, skill, or location..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Found {filteredJobs.length} jobs</span>
              <span>Showing newest first</span>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 opacity-60">
                 <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} />
                 </div>
                 <p className="text-lg">No jobs match your search.</p>
              </div>
            ) : (
              filteredJobs.map((job, idx) => (
                <JobCard key={idx} job={job} onClick={() => setSelectedJob(job)} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedJob && (
        <JobDetailModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
            onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

const JobCard: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 cursor-pointer transition-all group animate-fadeIn relative overflow-hidden transform hover:-translate-y-1"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div>
           <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{job.job_title}</h3>
           <div className="flex items-center text-indigo-400 mt-1">
              <Building2 size={16} className="mr-2" />
              <span className="font-medium">{job.company_name}</span>
           </div>
        </div>
        <div className="text-right shrink-0 ml-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
            job.seniority_level === 'Senior' || job.seniority_level === 'Principal' 
            ? 'bg-purple-900/20 text-purple-300 border-purple-700/50'
            : 'bg-blue-900/20 text-blue-300 border-blue-700/50'
          }`}>
            {job.seniority_level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <div className="flex items-center text-slate-400 text-sm">
          <MapPin size={16} className="mr-2 text-slate-500" />
          <span>{job.location_raw} ({job.work_mode})</span>
        </div>
        <div className="flex items-center text-slate-400 text-sm">
          <DollarSign size={16} className="mr-2 text-slate-500" />
          <span>
             {job.salary.min ? `${job.salary.currency || '$'}${job.salary.min.toLocaleString()} - ` : ''}
             {job.salary.max ? `${job.salary.max.toLocaleString()}` : 'Not listed'}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/50">
        <div className="flex flex-wrap gap-2">
          {job.required_skills.slice(0, 5).map((skill, i) => (
            <span 
              key={i}
              className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {job.required_skills.length > 5 && (
            <span className="px-2.5 py-1 text-slate-500 text-xs font-medium">+{job.required_skills.length - 5} more</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const SkillGapAnalysis = ({ skills, onPractice }: { skills: string[], onPractice: (skill: string) => void }) => {
    // Mock data generation: Assign a random "User Proficiency" score to each required skill
    const data = useMemo(() => {
        // Deterministic mock based on string char code for demo stability
        return skills.slice(0, 6).map(skill => {
            const mockScore = (skill.length * 7 + 23) % 100;
            return {
                subject: skill,
                required: 100,
                yours: mockScore
            };
        });
    }, [skills]);

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-100 flex items-center">
                    <BarChart2 className="mr-2 text-indigo-500" size={20} />
                    Skill Match Analysis
                </h3>
                <div className="flex gap-4 text-xs font-medium">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-500 mr-2"></span> Required</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500 mr-2"></span> Your Profile</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="h-[250px] w-full bg-slate-900/50 rounded-lg border border-slate-800/50 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Required" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                            <Radar name="You" dataKey="yours" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                                itemStyle={{ color: '#f1f5f9' }}
                                labelStyle={{ color: '#f8fafc' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Action Plan</h4>
                    <div className="space-y-3">
                        {data.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
                                <div>
                                    <div className="font-medium text-slate-200 text-sm">{item.subject}</div>
                                    <div className="text-xs text-slate-500 flex items-center mt-0.5">
                                        <div className="w-16 h-1.5 bg-slate-800 rounded-full mr-2 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${item.yours > 70 ? 'bg-emerald-500' : item.yours > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                                style={{ width: `${item.yours}%` }}
                                            />
                                        </div>
                                        <span>{item.yours}% Match</span>
                                    </div>
                                </div>
                                {item.yours < 70 ? (
                                    <button 
                                        onClick={() => onPractice(item.subject)}
                                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center shadow-lg shadow-indigo-900/20"
                                    >
                                        <Zap size={12} className="mr-1 fill-current" /> Practice
                                    </button>
                                ) : (
                                    <div className="text-emerald-500 flex items-center text-xs font-medium px-3 py-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                                        <CheckCircle2 size={12} className="mr-1" /> Strong
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobDetailModal: React.FC<{ job: Job; onClose: () => void; onNavigate?: (view: any, params?: any) => void }> = ({ job, onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-full overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-20 flex justify-between items-start shadow-sm">
          <div className="flex items-start space-x-4">
             <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 shrink-0">
               <Building2 size={28} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-100 leading-tight">{job.job_title}</h2>
                <div className="flex items-center text-slate-400 mt-1 space-x-3 text-sm">
                   <span className="font-medium text-indigo-400">{job.company_name}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                   <span>{job.location_raw}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                   <span>{job.work_mode}</span>
                </div>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950/30">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <StatBox icon={Briefcase} label="Level" value={job.seniority_level} />
             <StatBox icon={DollarSign} label="Salary" value={
                job.salary.max 
                ? `${job.salary.currency}${job.salary.min?.toLocaleString() || ''} - ${job.salary.max?.toLocaleString()}`
                : 'Competitive'
             } />
             <StatBox icon={ShieldCheck} label="AI Confidence" value={`${Math.round(job.extraction_confidence_score * 100)}%`} 
                valueColor={job.extraction_confidence_score > 0.8 ? 'text-emerald-400' : 'text-amber-400'} 
             />
             <StatBox icon={Target} label="Match Score" value="85% (Mock)" valueColor="text-indigo-400" />
          </div>

          {/* New Visual Skill Map */}
          <SkillGapAnalysis 
            skills={job.required_skills} 
            onPractice={(skill) => {
                if(onNavigate) {
                    onClose();
                    onNavigate('questions', { topic: skill });
                }
            }} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
               
               {/* Responsibilities */}
               <section>
                  <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center border-b border-slate-800 pb-2">
                    <List className="mr-2 text-indigo-500" size={20} />
                    Core Responsibilities
                  </h3>
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50">
                    <ul className="space-y-3">
                        {job.responsibilities?.map((item, i) => (
                        <li key={i} className="flex items-start text-slate-300 leading-relaxed text-sm">
                            <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0"></span>
                            {item}
                        </li>
                        )) || <li className="text-slate-500 italic">No responsibilities extracted.</li>}
                    </ul>
                  </div>
               </section>

               {/* Requirements */}
               <section>
                  <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center border-b border-slate-800 pb-2">
                    <CheckCircle2 className="mr-2 text-emerald-500" size={20} />
                    Requirements
                  </h3>
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50">
                    <ul className="space-y-3">
                        {job.requirements?.map((item, i) => (
                        <li key={i} className="flex items-start text-slate-300 leading-relaxed text-sm">
                            <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                            {item}
                        </li>
                        )) || <li className="text-slate-500 italic">No requirements extracted.</li>}
                    </ul>
                  </div>
               </section>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Tech Stack */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <Zap size={14} className="mr-1" /> Tech Stack
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {job.required_skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-md text-sm font-medium hover:bg-indigo-500/20 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Perks & Benefits</h4>
                   <ul className="space-y-2.5">
                      {job.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-slate-300">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mr-2.5"></div>
                           {benefit}
                        </li>
                      ))}
                   </ul>
                </div>
              )}

              {/* Missing Skills Alert (Mock) */}
              <div className="bg-amber-900/10 border border-amber-900/30 rounded-xl p-5">
                 <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center">
                    <AlertCircle size={14} className="mr-1" /> Potential Gaps
                 </h4>
                 <p className="text-xs text-slate-400 leading-relaxed">
                    This role requires <strong>Rust</strong> and <strong>Oracle Cloud</strong> which are not in your profile. Consider refreshing these topics.
                 </p>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 z-20 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-xs text-slate-500 hidden sm:block">
              Parsed by OpsPrep AI &bull; {new Date().toLocaleDateString()}
           </div>
           <div className="flex space-x-3 w-full sm:w-auto">
                <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition-colors border border-transparent hover:border-slate-700">
                    Close
                </button>
                <button 
                  onClick={() => {
                      if (onNavigate && job.required_skills.length > 0) {
                          onClose();
                          onNavigate('questions', { topic: job.required_skills[0] });
                      }
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center"
                >
                    Generate Study Plan <ArrowRight size={18} className="ml-2" />
                </button>
           </div>
        </div>

      </div>
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value, valueColor = 'text-slate-200' }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-4 shadow-sm">
        <div className="p-2.5 bg-slate-800 rounded-lg text-slate-400">
            <Icon size={20} />
        </div>
        <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
            <div className={`font-bold ${valueColor} truncate max-w-[150px]`}>{value}</div>
        </div>
    </div>
);