import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { parseResume } from '../services/gemini';
import { 
    User, Save, Upload, FileText, Loader2, Award, 
    Calendar, TrendingUp, Cpu, Hash, MapPin, 
    Briefcase, Shield, History
} from 'lucide-react';

export const Profile = () => {
  const { profile, updateProfile, activities, readiness } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    level: profile.level,
    target_role: profile.target_role,
    experience_years: profile.experience_years
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      // In a real app, this would read a PDF/Docx. 
      // For this demo, we assume the user might copy-paste text or we simulate a read.
      // Here we just simulate reading a text file for simplicity.
      const file = e.target.files?.[0];
      if (!file) return;

      setIsParsing(true);
      const text = await file.text(); // Simple text read
      setResumeText(text);
      
      const parsedData = await parseResume(text);
      
      if (parsedData) {
          updateProfile({
              name: parsedData.name || profile.name,
              title: parsedData.title || profile.title,
              level: parsedData.level || profile.level,
              experience_years: parsedData.experience_years || profile.experience_years,
              skills: parsedData.skills || profile.skills,
              resume_text: text,
              resume_last_updated: new Date().toISOString()
          });
          
          // Sync form data
          setFormData(prev => ({
              ...prev,
              name: parsedData.name || prev.name,
              title: parsedData.title || prev.title,
              level: parsedData.level || prev.level,
              experience_years: parsedData.experience_years || prev.experience_years
          }));
      }
      setIsParsing(false);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Engineer Profile</h1>
            <p className="text-slate-400">Manage your professional identity and track your learning journey.</p>
         </div>
         <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                isEditing 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20'
            }`}
         >
            {isEditing ? <Save size={18} /> : <User size={18} />}
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
         </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Details & Resume */}
         <div className="lg:col-span-2 space-y-8">
            {/* Identity Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-slate-800 shrink-0">
                        {formData.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 w-full space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Full Name" 
                                value={formData.name} 
                                onChange={(v: string) => setFormData({...formData, name: v})} 
                                disabled={!isEditing} 
                            />
                            <InputField 
                                label="Current Title" 
                                value={formData.title} 
                                onChange={(v: string) => setFormData({...formData, title: v})} 
                                disabled={!isEditing} 
                            />
                            <InputField 
                                label="Experience (Years)" 
                                type="number"
                                value={formData.experience_years} 
                                onChange={(v: string) => setFormData({...formData, experience_years: Number(v)})} 
                                disabled={!isEditing} 
                            />
                            <InputField 
                                label="Target Role" 
                                value={formData.target_role} 
                                onChange={(v: string) => setFormData({...formData, target_role: v})} 
                                disabled={!isEditing} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
                    <FileText className="mr-2 text-indigo-400" /> Resume & Skills
                </h2>
                
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 mb-6 text-center border-dashed hover:border-indigo-500/50 transition-colors group">
                    <input 
                        type="file" 
                        accept=".txt,.md,.json" // Simple text based for demo
                        onChange={handleResumeUpload}
                        className="hidden" 
                        id="resume-upload" 
                        disabled={isParsing}
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                        {isParsing ? (
                            <Loader2 size={32} className="text-indigo-500 animate-spin mb-2" />
                        ) : (
                            <Upload size={32} className="text-slate-500 group-hover:text-indigo-400 mb-2 transition-colors" />
                        )}
                        <span className="text-slate-300 font-medium">
                            {isParsing ? 'Analyzing Resume...' : 'Upload Resume (Text/Markdown)'}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">AI will parse your skills and seniority automatically.</p>
                    </label>
                </div>

                {profile.skills.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Detected Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700 flex items-center">
                                    <Hash size={12} className="mr-1 opacity-50" /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
                    <History className="mr-2 text-indigo-400" /> Recent Activity
                </h2>
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <p className="text-slate-500 italic text-sm">No activity recorded yet.</p>
                    ) : (
                        activities.slice(0, 5).map(act => (
                            <div key={act.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded ${
                                        act.type === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                                        act.type === 'question' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                        {act.type === 'interview' ? <Briefcase size={16} /> : 
                                         act.type === 'question' ? <Cpu size={16} /> : <FileText size={16} />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-200">{act.topic}</div>
                                        <div className="text-xs text-slate-500 capitalize">{act.type} &bull; {new Date(act.timestamp).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {act.score && (
                                    <div className="text-sm font-bold text-emerald-400">{act.score}%</div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
         </div>

         {/* Right Column: Stats */}
         <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center">
                    <Award className="mr-2 text-amber-400" /> Career Stats
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Readiness Score</span>
                            <span className="text-white font-bold">{readiness}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${readiness}%` }}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white mb-1">{profile.streak_days}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Day Streak</div>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-white mb-1">{activities.length}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Activities</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Security Notice
                </h3>
                <div className="flex items-start space-x-3 text-sm text-slate-500">
                    <Shield size={16} className="shrink-0 mt-0.5" />
                    <p>
                        This is a client-side demo environment. Your data is stored in your browser's LocalStorage. 
                        Clearing your cache will reset your progress. Do not upload sensitive PII.
                    </p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, disabled, type = "text" }: any) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
        <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
    </div>
);