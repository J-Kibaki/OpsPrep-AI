import React, { useState, useMemo } from 'react';
import { parseJobDescription } from '../services/gemini';
import { Job } from '../types';
import { Loader2, ArrowRight, Building2, MapPin, DollarSign, Search, X, CheckCircle2, List, Target, ShieldCheck } from 'lucide-react';

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

export const JobParser = () => {
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
        
        <textarea
          className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4"
          placeholder="Paste Job Description here..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />
        
        <div className="flex justify-end">
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

      {/* Output Side - Job Repository */}
      <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text"
                placeholder="Search by title, company, skill, or location..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
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
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

const JobCard: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 cursor-pointer transition-all group animate-fadeIn relative overflow-hidden"
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
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            job.seniority_level === 'Senior' || job.seniority_level === 'Principal' 
            ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
            : 'bg-blue-900/30 text-blue-400 border border-blue-800'
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
            <span className="px-2.5 py-1 text-slate-500 text-xs">+{job.required_skills.length - 5} more</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const JobDetailModal: React.FC<{ job: Job; onClose: () => void }> = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50 sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-100">{job.job_title}</h2>
              <span className={`px-3 py-0.5 rounded-full text-xs font-medium border ${
                job.seniority_level === 'Senior' || job.seniority_level === 'Principal' 
                ? 'bg-purple-900/30 text-purple-400 border-purple-800'
                : 'bg-blue-900/30 text-blue-400 border-blue-800'
              }`}>
                {job.seniority_level}
              </span>
            </div>
            <div className="flex items-center text-indigo-400 font-medium">
              <Building2 size={18} className="mr-2" /> {job.company_name}
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
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center">
                <MapPin className="text-slate-500 mr-3" />
                <div>
                   <div className="text-xs text-slate-500">Location</div>
                   <div className="text-slate-200 font-medium">{job.location_raw} ({job.work_mode})</div>
                </div>
             </div>
             <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center">
                <DollarSign className="text-slate-500 mr-3" />
                <div>
                   <div className="text-xs text-slate-500">Salary Range</div>
                   <div className="text-slate-200 font-medium">
                      {job.salary.min ? `${job.salary.currency || '$'}${job.salary.min.toLocaleString()} - ` : ''}
                      {job.salary.max ? `${job.salary.max.toLocaleString()}` : 'Competitive'}
                   </div>
                </div>
             </div>
             <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center">
                <ShieldCheck className="text-slate-500 mr-3" />
                <div>
                   <div className="text-xs text-slate-500">Extraction Confidence</div>
                   <div className="flex items-center">
                      <div className="w-20 h-1.5 bg-slate-800 rounded-full mr-2 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${job.extraction_confidence_score * 100}%` }}></div>
                      </div>
                      <span className="text-slate-200 font-medium">{Math.round(job.extraction_confidence_score * 100)}%</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               {/* Responsibilities */}
               <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                    <List className="mr-2 text-indigo-400" size={20} />
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3">
                    {job.responsibilities?.map((item, i) => (
                      <li key={i} className="flex items-start text-slate-300 leading-relaxed">
                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0"></span>
                        {item}
                      </li>
                    )) || <li className="text-slate-500 italic">No responsibilities extracted.</li>}
                  </ul>
               </div>

               {/* Requirements */}
               <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                    <CheckCircle2 className="mr-2 text-indigo-400" size={20} />
                    Requirements
                  </h3>
                  <ul className="space-y-3">
                    {job.requirements?.map((item, i) => (
                      <li key={i} className="flex items-start text-slate-300 leading-relaxed">
                         <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                         {item}
                      </li>
                    )) || <li className="text-slate-500 italic">No requirements extracted.</li>}
                  </ul>
               </div>
            </div>

            <div className="space-y-6">
              {/* Tech Stack */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Tech Stack</h4>
                 <div className="flex flex-wrap gap-2">
                    {job.required_skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-indigo-950/30 border border-indigo-900/50 text-indigo-300 rounded text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Benefits</h4>
                   <ul className="space-y-2">
                      {job.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-slate-300">
                           <Target size={14} className="text-emerald-500 mr-2" />
                           {benefit}
                        </li>
                      ))}
                   </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end space-x-4">
           <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 font-medium transition-colors">
              Close
           </button>
           <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all flex items-center">
              Apply Now <ArrowRight size={18} className="ml-2" />
           </button>
        </div>

      </div>
    </div>
  );
};
