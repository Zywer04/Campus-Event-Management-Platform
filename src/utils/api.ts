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

export default api; 