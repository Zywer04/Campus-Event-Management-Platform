import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/api';
import { getActivityStats } from '../utils/api';
import type { ActivityStats } from '../utils/api';
import type { Activity } from '../types/activity';

interface ActivityContextType {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refreshActivities: () => Promise<void>;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: number, updates: Partial<Activity>) => void;
  removeActivity: (id: number) => void;
  stats: ActivityStats | null;
  loadingStats: boolean;
  refreshStats: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivityContext = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivityContext must be used within an ActivityProvider');
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
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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

  const updateActivity = (id: number, updates: Partial<Activity>) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  };

  const removeActivity = (id: number) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const refreshStats = async () => {
    try {
      setLoadingStats(true);
      const data = await getActivityStats();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    refreshStats();
  }, []);

  const value: ActivityContextType = {
    activities,
    loading,
    error,
    refreshActivities,
    addActivity,
    updateActivity,
    removeActivity,
    stats,
    loadingStats,
    refreshStats,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}; 