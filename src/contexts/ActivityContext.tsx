import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/api';
import type { Activity } from '../types/activity';

interface ActivityContextType {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refreshActivities: () => Promise<void>;
  addActivity: (activity: Activity) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivityProvider');
  }
  return context;
};

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/get-all-activities');
      setActivities(response.data);
    } catch (err: any) {
      console.error('获取活动列表失败:', err);
      setError('获取活动列表失败');
    } finally {
      setLoading(false);
    }
  };

  const refreshActivities = async () => {
    await fetchActivities();
  };

  const addActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const value: ActivityContextType = {
    activities,
    loading,
    error,
    refreshActivities,
    addActivity
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}; 