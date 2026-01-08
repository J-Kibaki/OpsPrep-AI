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
}

export interface Taxonomy {
  categories: Record<string, string[]>;
}
