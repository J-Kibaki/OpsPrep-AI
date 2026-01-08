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

export const JobParser = ({ onNavigate }: { onNavigate?: (view: any, params?: any) => void }) => {
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
              // If job has max salary, check if it's at least the filter value
              // If only min salary, check that.
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
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Main Search Bar */}
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

            {/* Advanced Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase mr-2">
                    <Filter size={14} className="mr-1" /> Filters:
                </div>
                
                <select 
                    value={workModeFilter}
                    onChange={(e) => setWorkModeFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="All">All Work Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                </select>

                <select 
                    value={seniorityFilter}
                    onChange={(e) => setSeniorityFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="All">All Levels</option>
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Principal">Principal</option>
                </select>

                <div className="relative max-w-[140px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input 
                        type="number"
                        placeholder="Min Salary"
                        value={minSalaryFilter}
                        onChange={(e) => setMinSalaryFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg pl-6 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-600"
                    />
                </div>

                {hasActiveFilters && (
                    <button 
                        onClick={clearFilters}
                        className="text-xs text-indigo-400 hover:text-indigo-300 ml-auto flex items-center"
                    >
                        <X size={12} className="mr-1" /> Clear All
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/50 pt-3">
              <span>Found {filteredJobs.length} jobs</span>
              <span>Sorted by Relevance</span>
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
        <div className="flex flex-col items-end shrink-0 ml-4 space-y-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
            job.seniority_level === 'Senior' || job.seniority_level === 'Principal' 
            ? 'bg-purple-900/20 text-purple-300 border-purple-700/50'
            : 'bg-blue-900/20 text-blue-300 border-blue-700/50'
          }`}>
            {job.seniority_level}
          </span>
          {job.posted_date && (
            <span className="text-[10px] text-slate-500 flex items-center">
                <Calendar size={10} className="mr-1" /> {job.posted_date}
            </span>
          )}
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

      <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
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
        
        {job.source && (
            <span className="hidden sm:flex items-center text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800/50">
                <Globe size={10} className="mr-1" /> {job.source}
            </span>
        )}
      </div>
    </div>
  </div>
);

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
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-slate-100 leading-tight">{job.job_title}</h2>
                    {job.source && <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700">{job.source}</span>}
                </div>
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

          {/* Reusable Skill Map Component */}
          <SkillMap 
            skills={job.required_skills} 
            onNavigate={(view, params) => {
              // Close modal before navigating
              onClose();
              if (onNavigate) onNavigate(view, params);
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
                {job.application_link ? (
                    <a 
                        href={job.application_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center"
                    >
                        Apply Now <ExternalLink size={18} className="ml-2" />
                    </a>
                ) : (
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
                )}
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