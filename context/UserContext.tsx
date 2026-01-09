import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, LearningActivity } from '../types';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  activities: LearningActivity[];
  readiness: number;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addActivity: (type: LearningActivity['type'], topic: string, score?: number) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  name: 'New User',
  title: 'Cloud Engineer',
  level: 'Entry',
  experience_years: 0,
  target_role: 'SRE',
  skills: [],
  streak_days: 0,
  last_active_date: new Date().toISOString(),
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    let unsubscribeActivities: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Clean up previous listeners if user changes
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeActivities) unsubscribeActivities();

      if (currentUser) {
        setLoading(true);
        setError(null);

        const docRef = doc(db, 'users', currentUser.uid);
        
        // Use onSnapshot for real-time updates and better offline handling
        unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create initial profile if it doesn't exist
            const newProfile = { ...DEFAULT_PROFILE, id: currentUser.uid };
            setDoc(docRef, newProfile).catch(err => {
              console.error("Error creating initial profile:", err);
              if (err.code === 'permission-denied') {
                setError("Firestore permissions denied. Check your security rules.");
              }
            });
            setProfile(newProfile);
          }
          setLoading(false);
        }, (err) => {
          console.error("Error fetching user profile:", err);
          // If offline, Firestore onSnapshot doesn't necessarily throw "failed", 
          // it just waits or provides cache. If it DOES error:
          if (err.code !== 'unavailable') {
            setError(err.message || "Failed to connect to the database.");
          }
          setLoading(false);
        });

        // Fetch activities with onSnapshot
        const actRef = collection(db, 'users', currentUser.uid, 'activities');
        const q = query(actRef, orderBy('timestamp', 'desc'), limit(50));
        
        unsubscribeActivities = onSnapshot(q, (querySnapshot) => {
          const acts = querySnapshot.docs.map(doc => doc.data() as LearningActivity);
          setActivities(acts);
        }, (err) => {
          console.error("Error fetching activities:", err);
          // Activities failing isn't necessarily fatal for the app
        });

      } else {
        setProfile(null);
        setActivities([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeActivities) unsubscribeActivities();
    };
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    setProfile(prev => prev ? { ...prev, ...data } : null); // Optimistic update
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { ...data });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      if (error.code === 'permission-denied') {
        setError("Permission denied when saving profile.");
      }
    }
  };

  const addActivity = async (type: LearningActivity['type'], topic: string, score?: number) => {
    if (!user) return;
    const activity: LearningActivity = {
      id: Math.random().toString(36).substring(7),
      type,
      topic,
      score,
      timestamp: new Date().toISOString()
    };

    setActivities(prev => [activity, ...prev]); // Optimistic update

    try {
      const actRef = doc(collection(db, 'users', user.uid, 'activities'));
      await setDoc(actRef, activity);
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const readiness = activities.length > 0 
    ? Math.min(100, Math.round((activities.filter(a => (a.score || 0) > 70).length / activities.length) * 100))
    : 0;

  return (
    <UserContext.Provider value={{ user, profile, activities, readiness, loading, error, updateProfile, addActivity, logout }}>
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
