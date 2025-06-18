// 活动创建类型定义
export interface ActivityCreate {
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

// 活动创建表单数据（用于前端表单）
export interface ActivityCreateForm {
  title: string;
  category: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  location: string;
  capacity: number;
  image_url: string;
  description: string;
  organizer_contact: string;
  requirements: string;
  registration_deadline: string;
  activity_summary: string;
  activity_goals: string;
  activity_process: string;
  notes: string;
}

// 活动分类选项
export const ACTIVITY_CATEGORIES = [
  { value: '学术讲座', label: '学术讲座' },
  { value: '文体活动', label: '文体活动' },
  { value: '志愿服务', label: '志愿服务' },
  { value: '职业发展', label: '职业发展' },
  { value: '兴趣培养', label: '兴趣培养' }
] as const;

// 表单验证规则
export const ACTIVITY_VALIDATION_RULES = {
  title: {
    required: '活动标题不能为空',
    minLength: { value: 2, message: '标题至少2个字符' },
    maxLength: { value: 255, message: '标题不能超过255个字符' }
  },
  category: {
    required: '请选择活动分类'
  },
  date_start: {
    required: '请选择开始日期'
  },
  date_end: {
    required: '请选择结束日期'
  },
  time_start: {
    required: '请选择开始时间'
  },
  time_end: {
    required: '请选择结束时间'
  },
  location: {
    required: '活动地点不能为空',
    maxLength: { value: 255, message: '地点不能超过255个字符' }
  },
  capacity: {
    required: '请输入活动容量',
    min: { value: 1, message: '容量至少为1人' },
    max: { value: 10000, message: '容量不能超过10000人' }
  },
  registration_deadline: {
    required: '请选择报名截止时间'
  }
}; 