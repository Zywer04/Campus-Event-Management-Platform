import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '', // 移除baseURL，直接使用相对路径
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 活动统计数据接口
export interface ActivityStats {
  total_activity_num: number;
  total_registered_num: number;
  avg_likes: number;
  category_breakdown: Record<string, number>;
}

// 获取活动统计数据
export const getActivityStats = async (): Promise<ActivityStats> => {
  try {
    const response = await api.get('/api/get-activity-statistic');
    return response.data;
  } catch (error) {
    console.error('获取活动统计数据失败:', error);
    throw error;
  }
};

// 活动创建接口
export interface ActivityCreateData {
  title: string;
  category: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  location: string;
  capacity: number;
  image_url?: string;
  description?: string;
  organizer_contact?: string;
  requirements?: string;
  registration_deadline: string;
  activity_summary?: string;
  activity_goals?: string;
  activity_process?: string;
  notes?: string;
}

// 创建活动（社团申报）
export const createActivity = async (activityData: ActivityCreateData): Promise<number> => {
  try {
    const response = await api.post('/api/create-activity', activityData);
    return response.data;
  } catch (error) {
    console.error('创建活动失败:', error);
    throw error;
  }
};

// 获取待审核活动列表
export const getPendingActivities = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/get-pending-activities');
    return response.data;
  } catch (error) {
    console.error('获取待审核活动失败:', error);
    throw error;
  }
};

// 更新活动状态（审核通过/拒绝）
export const updateActivityStatus = async (activityId: number, status: string): Promise<void> => {
  try {
    await api.patch(`/api/update-activity-status/${activityId}`, { status });
  } catch (error) {
    console.error('更新活动状态失败:', error);
    throw error;
  }
};

// 获取社团管理的活动
export const getManagedActivities = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/query-managed-activities');
    return response.data;
  } catch (error) {
    console.error('获取管理的活动失败:', error);
    throw error;
  }
};

export default api; 