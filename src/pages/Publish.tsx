// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useActivityContext } from '../contexts/ActivityContext';
import api, { createActivity } from '../utils/api';
import type { ActivityCreateData } from '../utils/api';
import type { ActivityCreateForm } from '../types/activityCreate';
import { ACTIVITY_CATEGORIES, ACTIVITY_VALIDATION_RULES } from '../types/activityCreate';

const App: React.FC = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { user } = useUser();
  const { refreshActivities } = useActivityContext();
  const [formData, setFormData] = useState<ActivityCreateForm>({
    title: '',
    category: '',
    date_start: '',
    date_end: '',
    time_start: '',
    time_end: '',
    location: '',
    capacity: 0,
    image_url: '',
    description: '',
    organizer_contact: '',
    requirements: '',
    registration_deadline: '',
    activity_summary: '',
    activity_goals: '',
    activity_process: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categorys = [
    { id: 'academic', name: '学术讲座' },
    { id: 'sports', name: '文体活动' },
    { id: 'volunteer', name: '志愿服务' },
    { id: 'cultural', name: '文化节日' },
    { id: 'recruitment', name: '社团招新' },
    { id: 'other', name: '其他' }
  ];

  const venueOptions = [
    { id: 'lecture_hall', name: '大型讲堂' },
    { id: 'classroom', name: '普通教室' },
    { id: 'outdoor', name: '室外场地' },
    { id: 'sports_venue', name: '体育场馆' },
    { id: 'theater', name: '剧场/礼堂' },
    { id: 'meeting_room', name: '会议室' }
  ];

  const categories = [
    { id: 'all', name: '全部活动', icon: 'fa-list-ul' },
    { id: 'academic', name: '学术讲座', icon: 'fa-chalkboard-teacher' },
    { id: 'sports', name: '文体活动', icon: 'fa-running' },
  ];

  const myActivities = [
    { id: 'registered', name: '已报名活动', icon: 'fa-calendar-check' },
    { id: 'history', name: '历史参与', icon: 'fa-history' },
  ];

  const adminMenus = [
    { id: 'publish', name: '发布活动', icon: 'fa-plus-circle' },
    { id: 'manage', name: '活动管理', icon: 'fa-tasks' },
    { id: 'stats', name: '数据统计', icon: 'fa-chart-bar' },
  ];

  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line' },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature', active: true },
  ];

  // 检查用户权限
  if (!user || (user.role !== 'club' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">权限不足</h2>
          <p className="text-gray-600 mb-4">只有社团负责人和管理员可以发布活动</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除该字段的错误信息
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      image_url: value
    }));
    setImagePreview(value);
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => [...prev, file]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updatedFiles = [...prev];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 必填字段验证
    if (!formData.title.trim()) {
      newErrors.title = ACTIVITY_VALIDATION_RULES.title.required;
    } else if (formData.title.length < 2) {
      newErrors.title = ACTIVITY_VALIDATION_RULES.title.minLength.message;
    } else if (formData.title.length > 255) {
      newErrors.title = ACTIVITY_VALIDATION_RULES.title.maxLength.message;
    }

    if (!formData.category) {
      newErrors.category = ACTIVITY_VALIDATION_RULES.category.required;
    }

    if (!formData.date_start) {
      newErrors.date_start = ACTIVITY_VALIDATION_RULES.date_start.required;
    }

    if (!formData.date_end) {
      newErrors.date_end = ACTIVITY_VALIDATION_RULES.date_end.required;
    }

    if (!formData.time_start) {
      newErrors.time_start = ACTIVITY_VALIDATION_RULES.time_start.required;
    }

    if (!formData.time_end) {
      newErrors.time_end = ACTIVITY_VALIDATION_RULES.time_end.required;
    }

    if (!formData.location.trim()) {
      newErrors.location = ACTIVITY_VALIDATION_RULES.location.required;
    } else if (formData.location.length > 255) {
      newErrors.location = ACTIVITY_VALIDATION_RULES.location.maxLength.message;
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = ACTIVITY_VALIDATION_RULES.capacity.required;
    } else if (formData.capacity > 10000) {
      newErrors.capacity = ACTIVITY_VALIDATION_RULES.capacity.max.message;
    }

    if (!formData.registration_deadline) {
      newErrors.registration_deadline = ACTIVITY_VALIDATION_RULES.registration_deadline.required;
    }

    // 日期逻辑验证
    if (formData.date_start && formData.date_end) {
      const startDate = new Date(formData.date_start);
      const endDate = new Date(formData.date_end);
      if (endDate < startDate) {
        newErrors.date_end = '结束日期不能早于开始日期';
      }
    }

    if (formData.registration_deadline && formData.date_start) {
      const deadline = new Date(formData.registration_deadline);
      const startDate = new Date(formData.date_start);
      if (deadline > startDate) {
        newErrors.registration_deadline = '报名截止时间不能晚于活动开始时间';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // 准备提交的数据
      const submitData: ActivityCreateData = {
        ...formData,
        date_start: new Date(formData.date_start).toISOString(),
        date_end: new Date(formData.date_end).toISOString(),
        registration_deadline: new Date(formData.registration_deadline).toISOString(),
        capacity: parseInt(formData.capacity.toString())
      };

      // 调用后端API创建活动
      const activityId = await createActivity(submitData);
      
      alert(`活动申报成功！活动ID: ${activityId}`);
      
      // 清除草稿
      localStorage.removeItem('activityFormDraft');
      
      // 根据用户角色跳转到不同页面
      if (user?.role === 'club') {
        navigate('/ClubActivities'); // 跳转到社团活动管理页面
      } else {
        navigate('/'); // 管理员跳转到首页
      }
      
      refreshActivities();
      
    } catch (err: any) {
      console.error('申报活动失败:', err);
      const message = err.response?.data?.detail || '申报活动失败，请重试';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // 自动保存功能
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      localStorage.setItem('activityFormDraft', JSON.stringify(formData));
    }, 30000); // 每30秒自动保存一次

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  // 加载草稿
  useEffect(() => {
    const savedDraft = localStorage.getItem('activityFormDraft');
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // 处理导航
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // 判断当前路径是否匹配
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">发布活动</h1>
          <p className="mt-2 text-gray-600">创建新的校园活动，让更多同学参与进来</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          {/* 基本信息 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 活动标题 */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  活动标题 <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入活动标题"
                  aria-label="活动标题"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* 活动分类 */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  活动分类 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="选择活动分类"
                >
                  <option value="">请选择活动分类</option>
                  {ACTIVITY_CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              {/* 活动容量 */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                  活动容量 <span className="text-red-500">*</span>
                </label>
                <input
                  id="capacity"
                  type="number"
                  name="capacity"
                  value={formData.capacity || ''}
                  onChange={handleChange}
                  min="1"
                  max="10000"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入活动容量"
                  aria-label="活动容量"
                />
                {errors.capacity && <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>}
              </div>

              {/* 开始日期 */}
              <div>
                <label htmlFor="date_start" className="block text-sm font-medium text-gray-700 mb-2">
                  开始日期 <span className="text-red-500">*</span>
                </label>
                <input
                  id="date_start"
                  type="date"
                  name="date_start"
                  value={formData.date_start}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date_start ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="活动开始日期"
                />
                {errors.date_start && <p className="mt-1 text-sm text-red-500">{errors.date_start}</p>}
              </div>

              {/* 结束日期 */}
              <div>
                <label htmlFor="date_end" className="block text-sm font-medium text-gray-700 mb-2">
                  结束日期 <span className="text-red-500">*</span>
                </label>
                <input
                  id="date_end"
                  type="date"
                  name="date_end"
                  value={formData.date_end}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date_end ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="活动结束日期"
                />
                {errors.date_end && <p className="mt-1 text-sm text-red-500">{errors.date_end}</p>}
              </div>

              {/* 开始时间 */}
              <div>
                <label htmlFor="time_start" className="block text-sm font-medium text-gray-700 mb-2">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <input
                  id="time_start"
                  type="time"
                  name="time_start"
                  value={formData.time_start}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.time_start ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="活动开始时间"
                />
                {errors.time_start && <p className="mt-1 text-sm text-red-500">{errors.time_start}</p>}
              </div>

              {/* 结束时间 */}
              <div>
                <label htmlFor="time_end" className="block text-sm font-medium text-gray-700 mb-2">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <input
                  id="time_end"
                  type="time"
                  name="time_end"
                  value={formData.time_end}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.time_end ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="活动结束时间"
                />
                {errors.time_end && <p className="mt-1 text-sm text-red-500">{errors.time_end}</p>}
              </div>

              {/* 活动地点 */}
              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  活动地点 <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入活动地点"
                  aria-label="活动地点"
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* 报名截止时间 */}
              <div className="md:col-span-2">
                <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  报名截止时间 <span className="text-red-500">*</span>
                </label>
                <input
                  id="registration_deadline"
                  type="datetime-local"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.registration_deadline ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="报名截止时间"
                />
                {errors.registration_deadline && <p className="mt-1 text-sm text-red-500">{errors.registration_deadline}</p>}
              </div>
            </div>
          </div>

          {/* 活动详情 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">活动详情</h2>
            
            <div className="space-y-6">
              {/* 活动图片 */}
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                  活动图片URL
                </label>
                <input
                  id="image_url"
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleImageUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入活动图片URL"
                  aria-label="活动图片URL"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="预览" 
                      className="w-32 h-24 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 活动描述 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  活动描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请描述活动内容、特色等"
                  aria-label="活动描述"
                />
              </div>

              {/* 活动总结 */}
              <div>
                <label htmlFor="activity_summary" className="block text-sm font-medium text-gray-700 mb-2">
                  活动总结
                </label>
                <textarea
                  id="activity_summary"
                  name="activity_summary"
                  value={formData.activity_summary}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请简要总结活动要点"
                  aria-label="活动总结"
                />
              </div>

              {/* 活动目标 */}
              <div>
                <label htmlFor="activity_goals" className="block text-sm font-medium text-gray-700 mb-2">
                  活动目标
                </label>
                <textarea
                  id="activity_goals"
                  name="activity_goals"
                  value={formData.activity_goals}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请描述活动的目标和预期效果"
                  aria-label="活动目标"
                />
              </div>

              {/* 活动流程 */}
              <div>
                <label htmlFor="activity_process" className="block text-sm font-medium text-gray-700 mb-2">
                  活动流程
                </label>
                <textarea
                  id="activity_process"
                  name="activity_process"
                  value={formData.activity_process}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请详细描述活动流程和时间安排"
                  aria-label="活动流程"
                />
              </div>

              {/* 参与要求 */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  参与要求
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请说明参与活动的具体要求"
                  aria-label="参与要求"
                />
              </div>

              {/* 注意事项 */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  注意事项
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请说明活动注意事项"
                  aria-label="注意事项"
                />
              </div>

              {/* 联系方式 */}
              <div>
                <label htmlFor="organizer_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  联系方式
                </label>
                <input
                  id="organizer_contact"
                  type="text"
                  name="organizer_contact"
                  value={formData.organizer_contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入联系方式（电话、邮箱等）"
                  aria-label="联系方式"
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '发布中...' : '发布活动'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
