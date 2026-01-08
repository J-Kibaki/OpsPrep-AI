export interface Question {
  id: string;
  role: string;
  level: string;
  topic_tags: string[];
  question_text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time_estimate_minutes: number;
}

export interface AnswerGuide {
  key_concepts: string[];
  ideal_outline: string[];
  technical_snippets?: { language: string; code: string; caption?: string }[];
  common_mistakes: string[];
  pro_tip: string;
  follow_up_questions: string[];
}

export interface Job {
  job_title: string;
  company_name: string;
  location_raw: string;
  work_mode: 'Remote' | 'Hybrid' | 'Onsite' | 'Unknown';
  seniority_level: 'Entry' | 'Mid' | 'Senior' | 'Principal' | 'Unknown';
  salary: {
    min: number | null;
    max: number | null;
    currency: string;
  };
  required_skills: string[];
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  extraction_confidence_score: number;
  source?: string;
  application_link?: string;
  posted_date?: string;
}

export interface CheatSheet {
  topic: string;
  introduction: string;
  sections: {
    title: string;
    items: {
      command: string;
      description: string;
    }[];
  }[];
}

export interface Taxonomy {
  categories: Record<string, string[]>;
}

export interface InterviewFeedback {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvement_tips: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  level: string; // e.g., "Lvl 4 • SRE II"
  experience_years: number;
  target_role: string;
  skills: string[];
  resume_text?: string;
  resume_last_updated?: string;
  streak_days: number;
  last_active_date: string;
}

export interface LearningActivity {
  id: string;
  type: 'interview' | 'question' | 'cheatsheet';
  topic: string;
  score?: number; // 0-100
  timestamp: string;
  details?: string;
}