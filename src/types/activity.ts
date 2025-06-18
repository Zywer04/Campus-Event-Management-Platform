// 活动类型定义
export interface Activity {
  id: number;
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
  registered: number;
  rating_total: number;
  rating_count: number;
  status: string;
}

// 活动分类
export const ACTIVITY_CATEGORIES = [
  '学术讲座',
  '文体活动', 
  '志愿服务',
  '职业发展',
  '兴趣培养'
] as const;

export type ActivityCategory = typeof ACTIVITY_CATEGORIES[number];

// 活动状态
export const ACTIVITY_STATUS = [
  '报名中',
  '审核中',
  '已结束',
  '未开始',
  '已驳回'
] as const;

export type ActivityStatus = typeof ACTIVITY_STATUS[number];

// 活动状态颜色映射
export const STATUS_COLORS: Record<ActivityStatus, string> = {
  '报名中': 'bg-green-100 text-green-800',
  '审核中': 'bg-yellow-100 text-yellow-800',
  '已结束': 'bg-gray-100 text-gray-800',
  '未开始': 'bg-blue-100 text-blue-800',
  '已驳回': 'bg-red-100 text-red-800'
};

// 活动分类图标映射
export const CATEGORY_ICONS: Record<ActivityCategory, string> = {
  '学术讲座': 'fas fa-chalkboard-teacher',
  '文体活动': 'fas fa-music',
  '志愿服务': 'fas fa-hands-helping',
  '职业发展': 'fas fa-briefcase',
  '兴趣培养': 'fas fa-palette'
};

// 活动分类颜色映射
export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  '学术讲座': 'bg-purple-100 text-purple-800',
  '文体活动': 'bg-pink-100 text-pink-800',
  '志愿服务': 'bg-green-100 text-green-800',
  '职业发展': 'bg-blue-100 text-blue-800',
  '兴趣培养': 'bg-orange-100 text-orange-800'
}; 