import React, { useState, useMemo } from 'react';
import { parseJobDescription } from '../services/gemini';
import { Job } from '../types';
import { 
  Loader2, ArrowRight, Building2, MapPin, DollarSign, Search, X, 
  CheckCircle2, List, Target, ShieldCheck, Briefcase, Zap, AlertCircle, 
  Filter, ExternalLink, Calendar, Globe 
} from 'lucide-react';
import { SkillMap } from '../components/SkillMap';

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
    extraction_confidence_score: 0.95,
    source: "LinkedIn",
    application_link: "https://linkedin.com/jobs",
    posted_date: "2 days ago"
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
    extraction_confidence_score: 0.92,
    source: "Indeed",
    application_link: "https://indeed.com",
    posted_date: "5 days ago"
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
    extraction_confidence_score: 0.89,
    source: "BuiltIn",
    application_link: "https://builtin.com",
    posted_date: "1 week ago"
  },
  {
    job_title: "Junior DevOps Engineer",
    company_name: "StartUp Inc",
    location_raw: "Austin, TX",
    work_mode: "Hybrid",
    seniority_level: "Entry",
    salary: { min: 90000, max: 120000, currency: "$" },
    required_skills: ["AWS", "Linux", "Python", "Git"],
    responsibilities: [
        "Assist with cloud infrastructure management.",
        "Write scripts to automate daily tasks.",
        "Manage version control workflows."
    ],
    requirements: [
        "Bachelor's degree in CS or related field.",
        "Basic understanding of AWS services.",
        "Strong Linux command line skills."
    ],
    extraction_confidence_score: 0.96,
    source: "Glassdoor",
    application_link: "https://glassdoor.com",
    posted_date: "Just now"
  },
  {
    job_title: "Principal SRE",
    company_name: "FinTech Global",
    location_raw: "London, UK",
    work_mode: "Remote",
    seniority_level: "Principal",
    salary: { min: 200000, max: 280000, currency: "£" },
    required_skills: ["Kubernetes", "Golang", "Distributed Systems", "Rust", "Kafka"],
    responsibilities: [
        "Architect global scale reliability systems.",
        "Mentor senior engineers.",
        "Define SLOs for critical banking infrastructure."
    ],
    requirements: [
        "10+ years experience in high-frequency trading or banking.",
        "Expertise in distributed systems consistency models."
    ],
    extraction_confidence_score: 0.85,
    source: "Direct",
    application_link: "https://careers.fintech.global",
    posted_date: "3 weeks ago"
  }
];

const JobParser = ({ onNavigate }: { onNavigate?: (view: any, params?: any) => void }) => {
  const [rawText, setRawText] = useState('');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Filters
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [seniorityFilter, setSeniorityFilter] = useState('All');
  const [minSalaryFilter, setMinSalaryFilter] = useState<string>('');

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
    return jobs.filter(job => {
      // Text Search
      const matchesQuery = 
        job.job_title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query) ||
        job.location_raw.toLowerCase().includes(query) ||
        job.required_skills.some(skill => skill.toLowerCase().includes(query));
      
      // Work Mode Filter
      const matchesWorkMode = workModeFilter === 'All' || job.work_mode === workModeFilter;
      
      // Seniority Filter
      const matchesSeniority = seniorityFilter === 'All' || job.seniority_level === seniorityFilter;
      
      // Salary Filter (Check if job max salary >= filter min)
      let matchesSalary = true;
      if (minSalaryFilter) {
          const filterVal = parseInt(minSalaryFilter.replace(/,/g, ''), 10);
          if (!isNaN(filterVal)) {
              const jobMax = job.salary.max || job.salary.min || 0;
              matchesSalary = jobMax >= filterVal;
          }
      }

      return matchesQuery && matchesWorkMode && matchesSeniority && matchesSalary;
    });
  }, [jobs, searchQuery, workModeFilter, seniorityFilter, minSalaryFilter]);

  const clearFilters = () => {
      setWorkModeFilter('All');
      setSeniorityFilter('All');
      setMinSalaryFilter('');
      setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || workModeFilter !== 'All' || seniorityFilter !== 'All' || minSalaryFilter !== '';

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden relative bg-slate-950">
      {/* Input Side - Stays relatively fixed on LG+ screens */}
      <div className="flex-none lg:h-full bg-slate-900 p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 lg:w-[400px] xl:w-[450px]">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Job Parser</h2>
        <p className="text-slate-400 mb-6 text-sm">Paste a raw job description to extract structured data and skills.</p>
        
        <div className="flex-1 min-h-[200px] flex flex-col relative group mb-4">
           <textarea
            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition-all custom-scrollbar"
            placeholder="Paste Job Description here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          {!rawText && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <Briefcase size={80} />
             </div>
          )}
        </div>
        
        <div className="flex-none">
          <button
            onClick={handleParse}
            disabled={loading || !rawText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/10 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Zap size={20} className="mr-2 fill-current" />}
            Analyze Job
          </button>
        </div>
      </div>

      {/* Output Side - Independent Scrollable Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Search Header - Sticky-like */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex-none">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Main Search Bar */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search by title, company, skill..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-2 items-center">
                <select 
                    value={workModeFilter}
                    onChange={(e) => setWorkModeFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                    <option value="All">All Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                </select>

                <select 
                    value={seniorityFilter}
                    onChange={(e) => setSeniorityFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                    <option value="All">All Levels</option>
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Principal">Principal</option>
                </select>

                <div className="relative max-w-[120px]">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                    <input 
                        type="number"
                        placeholder="Min Salary"
                        value={minSalaryFilter}
                        onChange={(e) => setMinSalaryFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg pl-5 pr-2 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-600 outline-none"
                    />
                </div>

                {hasActiveFilters && (
                    <button 
                        onClick={clearFilters}
                        className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 ml-auto flex items-center bg-indigo-500/5 px-2 py-1.5 rounded-lg border border-indigo-500/10"
                    >
                        Reset
                    </button>
                )}
            </div>
          </div>
        </div>

        {/* List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-4 pb-12">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-600 opacity-60">
                 <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                    <Search size={24} />
                 </div>
                 <p className="text-lg">No jobs match your criteria.</p>
                 <button onClick={clearFilters} className="text-indigo-500 hover:text-indigo-400 mt-2 text-sm">Clear filters</button>
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
    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-indigo-500/50 hover:bg-slate-900/80 cursor-pointer transition-all group animate-fadeIn relative overflow-hidden transform hover:-translate-y-1 active:scale-[0.99]"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
           <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors leading-tight">{job.job_title}</h3>
           <div className="flex items-center text-indigo-400 mt-1.5 text-sm">
              <Building2 size={14} className="mr-2" />
              <span className="font-semibold">{job.company_name}</span>
           </div>
        </div>
        <div className="flex flex-col items-end shrink-0 ml-4 space-y-2">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
            job.seniority_level === 'Senior' || job.seniority_level === 'Principal' 
            ? 'bg-purple-900/20 text-purple-300 border-purple-700/30'
            : 'bg-blue-900/20 text-blue-300 border-blue-700/30'
          }`}>
            {job.seniority_level}
          </span>
          {job.posted_date && (
            <span className="text-[10px] text-slate-500 flex items-center font-medium">
                <Calendar size={10} className="mr-1" /> {job.posted_date}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
        <div className="flex items-center text-slate-400 text-xs">
          <MapPin size={14} className="mr-2 text-slate-500" />
          <span>{job.location_raw} ({job.work_mode})</span>
        </div>
        <div className="flex items-center text-slate-400 text-xs sm:justify-end">
          <DollarSign size={14} className="mr-1 text-emerald-500/50" />
          <span className="font-medium text-slate-300">
             {job.salary.min ? `${job.salary.currency || '$'}${job.salary.min.toLocaleString()} - ` : ''}
             {job.salary.max ? `${job.salary.max.toLocaleString()}` : 'Not listed'}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {job.required_skills.slice(0, 4).map((skill, i) => (
            <span 
              key={i}
              className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-md text-[10px] font-medium"
            >
              {skill}
            </span>
          ))}
          {job.required_skills.length > 4 && (
            <span className="text-slate-500 text-[10px] font-bold">+{job.required_skills.length - 4}</span>
          )}
        </div>
        
        {job.source && (
            <span className="hidden sm:flex items-center text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/50 uppercase tracking-tighter">
                {job.source}
            </span>
        )}
      </div>
    </div>
  </div>
);

const JobDetailModal: React.FC<{ job: Job; onClose: () => void; onNavigate?: (view: any, params?: any) => void }> = ({ job, onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-full lg:h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header - Fixed */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex-none flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
               <Building2 size={24} />
             </div>
             <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{job.job_title}</h2>
                <p className="text-sm font-semibold text-indigo-400">{job.company_name}</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content - Independently Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 custom-scrollbar bg-slate-950/20">
          <div className="space-y-10 max-w-4xl mx-auto">
            
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
               <StatBox icon={Target} label="Location" value={job.location_raw} />
            </div>

            {/* Reusable Skill Map Component */}
            <SkillMap 
              skills={job.required_skills} 
              onNavigate={(view, params) => {
                onClose();
                if (onNavigate) onNavigate(view, params);
              }} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-10">
                 
                 {/* Responsibilities */}
                 <section>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <List className="mr-3 text-indigo-500" size={20} />
                      Core Responsibilities
                    </h3>
                    <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/50">
                      <ul className="space-y-4">
                          {job.responsibilities?.map((item, i) => (
                          <li key={i} className="flex items-start text-slate-300 leading-relaxed text-sm">
                              <span className="mr-4 mt-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0"></span>
                              {item}
                          </li>
                          )) || <li className="text-slate-500 italic">No responsibilities extracted.</li>}
                      </ul>
                    </div>
                 </section>

                 {/* Requirements */}
                 <section>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <CheckCircle2 className="mr-3 text-emerald-500" size={20} />
                      Requirements
                    </h3>
                    <div className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800/50">
                      <ul className="space-y-4">
                          {job.requirements?.map((item, i) => (
                          <li key={i} className="flex items-start text-slate-300 leading-relaxed text-sm">
                              <span className="mr-4 mt-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                              {item}
                          </li>
                          )) || <li className="text-slate-500 italic">No requirements extracted.</li>}
                      </ul>
                    </div>
                 </section>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-8">
                
                {/* Tech Stack */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center">
                      <Zap size={14} className="mr-2" /> Key Tech Stack
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {job.required_skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                   </div>
                </div>

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm">
                     <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">Perks & Benefits</h4>
                     <ul className="space-y-3">
                        {job.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm text-slate-300">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mr-3"></div>
                             {benefit}
                          </li>
                        ))}
                     </ul>
                  </div>
                )}

                {/* Missing Skills Alert */}
                <div className="bg-amber-900/10 border border-amber-900/20 rounded-2xl p-6">
                   <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center">
                      <AlertCircle size={14} className="mr-2" /> Potential Gaps
                   </h4>
                   <p className="text-xs text-slate-400 leading-relaxed">
                      This role requires <strong>Rust</strong> which is not in your profile.
                   </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="p-6 sm:p-8 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md flex-none flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hidden sm:block">
              Parsed by OpsPrep AI &bull; {new Date().toLocaleDateString()}
           </div>
           <div className="flex space-x-3 w-full sm:w-auto">
                <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-bold transition-all border border-transparent hover:border-slate-700">
                    Close
                </button>
                {job.application_link ? (
                    <a 
                        href={job.application_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center active:scale-95"
                    >
                        Apply <ExternalLink size={18} className="ml-2" />
                    </a>
                ) : (
                    <button 
                    onClick={() => {
                        if (onNavigate && job.required_skills.length > 0) {
                            onClose();
                            onNavigate('questions', { topic: job.required_skills[0] });
                        }
                    }}
                    className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center active:scale-95"
                    >
                        Study Plan <ArrowRight size={18} className="ml-2" />
                    </button>
                )}
           </div>
        </div>

      </div>
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value, valueColor = 'text-slate-200' }: any) => (
    <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
        <div className="p-3 bg-slate-800 rounded-xl text-indigo-400">
            <Icon size={20} />
        </div>
        <div className="overflow-hidden">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
            <div className={`font-bold ${valueColor} truncate leading-tight`}>{value}</div>
        </div>
    </div>
);

export default JobParser;
