import { UserProfile, LearningActivity } from "../types";

const STORAGE_KEYS = {
  PROFILE: 'opsprep_user_profile',
  ACTIVITY: 'opsprep_user_activity'
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'Guest Engineer',
  title: 'DevOps Engineer',
  level: 'Level 1',
  experience_years: 0,
  target_role: 'Senior SRE',
  skills: ['Linux', 'Git'],
  streak_days: 1,
  last_active_date: new Date().toISOString()
};

export const StorageService = {
  // --- Profile Management ---
  getProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch (e) {
      console.error("Failed to load profile", e);
      return DEFAULT_PROFILE;
    }
  },

  updateProfile: (updates: Partial<UserProfile>): UserProfile => {
    const current = StorageService.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  // --- Activity Log (Simulating DB Table) ---
  getActivities: (): LearningActivity[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  logActivity: (activity: Omit<LearningActivity, 'id' | 'timestamp'>) => {
    const current = StorageService.getActivities();
    const newActivity: LearningActivity = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    // Prepend new activity
    const updated = [newActivity, ...current].slice(0, 100); // Keep last 100
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(updated));
    
    // Update streak logic
    const profile = StorageService.getProfile();
    const today = new Date().toDateString();
    const lastActive = new Date(profile.last_active_date).toDateString();
    
    if (today !== lastActive) {
        // Simple streak logic: if last active was yesterday, increment. Else reset.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        let newStreak = profile.streak_days;
        if (yesterday.toDateString() === lastActive) {
            newStreak++;
        } else {
            // Keep at 1 if played today, reset to 1 if skipped days
            newStreak = 1;
        }
        
        StorageService.updateProfile({ 
            streak_days: newStreak, 
            last_active_date: new Date().toISOString() 
        });
    }

    return newActivity;
  },

  // --- Readiness Calculation ---
  calculateReadiness: (): number => {
    const activities = StorageService.getActivities();
    if (activities.length === 0) return 10; // Base score

    // Simple algorithm: specific weight per activity type
    let score = 0;
    const weights = { interview: 20, question: 5, cheatsheet: 2 };
    
    activities.forEach(act => {
        const weight = weights[act.type as keyof typeof weights] || 1;
        // If interview has score, use it as multiplier
        const quality = act.score ? (act.score / 100) : 0.5;
        score += weight * quality;
    });

    // Cap at 100, log scale roughly
    return Math.min(Math.round(10 + Math.log(score + 1) * 15), 100);
  }
};