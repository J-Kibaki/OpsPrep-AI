import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, LearningActivity } from '../types';
import { StorageService } from '../services/storage';

interface UserContextType {
  profile: UserProfile;
  activities: LearningActivity[];
  readiness: number;
  updateProfile: (data: Partial<UserProfile>) => void;
  addActivity: (type: LearningActivity['type'], topic: string, score?: number) => void;
  refreshStats: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [readiness, setReadiness] = useState(0);

  const refreshStats = useCallback(() => {
    setActivities(StorageService.getActivities());
    setReadiness(StorageService.calculateReadiness());
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const updateProfile = (data: Partial<UserProfile>) => {
    const updated = StorageService.updateProfile(data);
    setProfile(updated);
  };

  const addActivity = (type: LearningActivity['type'], topic: string, score?: number) => {
    StorageService.logActivity({ type, topic, score });
    refreshStats();
  };

  return (
    <UserContext.Provider value={{ profile, activities, readiness, updateProfile, addActivity, refreshStats }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};