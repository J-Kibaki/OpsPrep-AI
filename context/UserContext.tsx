import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, LearningActivity } from '../types';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

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

  const fetchUserData = useCallback(async (uid: string) => {
    setError(null);
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        // Create initial profile
        const newProfile = { ...DEFAULT_PROFILE, id: uid };
        try {
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        } catch (setErr: any) {
          console.error("Firestore SetDoc Error:", setErr);
          // If Firestore fails (e.g. rules), we'll still set the profile locally so the UI works
          setProfile(newProfile);
          if (setErr.code === 'permission-denied') {
            setError("Firestore permissions denied. Please check your security rules.");
          }
        }
      }

      // Fetch activities
      try {
        const actRef = collection(db, 'users', uid, 'activities');
        const q = query(actRef, orderBy('timestamp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const acts = querySnapshot.docs.map(doc => doc.data() as LearningActivity);
        setActivities(acts);
      } catch (actErr) {
        console.error("Error fetching activities:", actErr);
      }
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Failed to connect to the database.");
      // Fallback to default profile if we can't even get the doc
      setProfile({ ...DEFAULT_PROFILE, id: uid });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        setProfile(null);
        setActivities([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

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
