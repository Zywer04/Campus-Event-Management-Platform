// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createActivity } from '../utils/api'; // 确认路径

const App: React.FC = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    capacity: string;
    registrationDeadline: string;
    activitySummary: string;
    activityGoals: string;
    activityProcess: string;
    notes: string;
    tags: string;
    requirements: string;
    organizerContact: string;
    venueRequirements: string[];
    equipmentNeeds: { name: string; quantity: string; description: string }[];
  }>({
    title: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    capacity: '',
    registrationDeadline: '',
    activitySummary: '',
    activityGoals: '',
    activityProcess: '',
    notes: '',
    tags: '',
    requirements: '',
    organizerContact: '',
    venueRequirements: [],
    equipmentNeeds: [{ name: '', quantity: '', description: '' }]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
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
    { id: 'career', name: '职业发展' },
    { id: 'interest', name: '兴趣培养' }
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

  const handleVenueChange = (venueId: string) => {
    setFormData(prev => {
      const updatedVenues = prev.venueRequirements.includes(venueId)
        ? prev.venueRequirements.filter(id => id !== venueId)
        : [...prev.venueRequirements, venueId];
      
      return {
        ...prev,
        venueRequirements: updatedVenues
      };
    });
  };

  const handleEquipmentChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedEquipment = [...prev.equipmentNeeds];
      updatedEquipment[index] = {
        ...updatedEquipment[index],
        [field]: value
      };
      
      return {
        ...prev,
        equipmentNeeds: updatedEquipment
      };
    });
  };

  const addEquipmentItem = () => {
    setFormData(prev => ({
      ...prev,
      equipmentNeeds: [...prev.equipmentNeeds, { name: '', quantity: '', description: '' }]
    }));
  };

  const removeEquipmentItem = (index: number) => {
    setFormData(prev => {
      const updatedEquipment = [...prev.equipmentNeeds];
      updatedEquipment.splice(index, 1);
      
      return {
        ...prev,
        equipmentNeeds: updatedEquipment.length ? updatedEquipment : [{ name: '', quantity: '', description: '' }]
      };
    });
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPoster(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onload = () => {
        setPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 必填字段验证
    if (!formData.title.trim()) newErrors.title = '请输入活动名称';
    if (!formData.category) newErrors.category = '请选择活动类型';
    if (!formData.startDate) newErrors.startDate = '请选择开始日期';
    if (!formData.startTime) newErrors.startTime = '请选择开始时间';
    if (!formData.endDate) newErrors.endDate = '请选择结束日期';
    if (!formData.endTime) newErrors.endTime = '请选择结束时间';
    if (!formData.location.trim()) newErrors.location = '请输入活动地点';
    if (!formData.capacity) newErrors.capacity = '请输入人数限制';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = '请选择报名截止日期';
    if (!formData.activitySummary.trim()) newErrors.activitySummary = '请输入活动简介';
    
    // 验证日期逻辑
    if (formData.startDate && formData.endDate) {
      const start = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const end = new Date(`${formData.endDate}T${formData.endTime || '00:00'}`);
      
      if (end < start) {
        newErrors.endDate = '结束时间不能早于开始时间';
      }
    }
    
    if (formData.registrationDeadline && formData.startDate) {
      const deadline = new Date(formData.registrationDeadline);
      const start = new Date(formData.startDate);
      
      if (deadline > start) {
        newErrors.registrationDeadline = '报名截止日期不能晚于活动开始日期';
      }
    }
    
    // 验证人数限制为正整数
    if (formData.capacity && parseInt(formData.capacity) <= 0) {
      newErrors.capacity = '人数限制必须大于0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) {
      // 滚动到第一个错误字段
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // category映射：前端英文 -> 后端中文
    const categoryMapping: { [key: string]: string } = {
      'academic': '学术讲座',
      'sports': '文体活动',
      'volunteer': '志愿服务',
      'career': '职业发展',
      'interest': '兴趣培养'
    };

    // 组装数据，字段名和类型要和后端一致
    const submitData = {
      title: formData.title || '',
      category: categoryMapping[formData.category || ''] || '其他', // 映射category
      date_start: formData.startDate || '',
      date_end: formData.endDate || '',
      time_start: formData.startTime || '',
      time_end: formData.endTime || '',
      location: formData.location || '',
      capacity: parseInt(formData.capacity || '0', 10),
      description: formData.activitySummary || '',
      organizer_contact: formData.organizerContact || '',
      requirements: formData.requirements || '',
      registration_deadline: formData.registrationDeadline || '',
      activity_summary: formData.activitySummary || '',
      activity_goals: formData.activityGoals || '',
      activity_process: formData.activityProcess || '',
      notes: formData.notes || ''
      // image_url: ... // 如有图片URL可加
    };

    try {
      const activityId = await createActivity(submitData);
      alert(isDraft ? '已保存为草稿' : '申请已提交审核，活动ID: ' + activityId);
      // 跳转到管理页
      navigate('/ClubActivities');
    } catch (err) {
      alert('提交失败，请重试');
      console.error(err);
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
        const draft = JSON.parse(savedDraft);
        setFormData(prev => ({
          ...prev,
          ...draft
        }));
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
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <i className="fas fa-university text-purple-600 text-2xl"></i>
            <span className="text-lg font-semibold">校园活动管理平台</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索活动..."
                className="w-64 h-10 pl-10 pr-4 text-sm border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-globe"></i>
                <span>简体中文</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* 左侧导航 */}
      <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">活动分类</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-list-ul"></i>
                <span>全部活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/?category=academic')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  location.search === '?category=academic' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-chalkboard-teacher"></i>
                <span>学术讲座</span>
              </button>
              <button 
                onClick={() => handleNavigation('/?category=sports')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  location.search === '?category=sports' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-running"></i>
                <span>文体活动</span>
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">我的活动</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/registered')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/registered') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-calendar-check"></i>
                <span>已报名活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/activities/history')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/activities/history') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-history"></i>
                <span>历史参与</span>
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团管理员</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/publish')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/publish') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-plus-circle"></i>
                <span>发布活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/ActivityManage')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/ActivityManage') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-tasks"></i>
                <span>活动管理</span>
              </button>
              <button 
                onClick={() => handleNavigation('/AuditPage')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/AuditPage') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-clipboard-check"></i>
                <span>审核活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/Stats')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/Stats') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-chart-bar"></i>
                <span>数据统计</span>
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团负责人</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/ClubActivities')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/ClubActivities') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-users-cog"></i>
                <span>管理社团活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/ClubStats')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/ClubStats') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-chart-line"></i>
                <span>社团活动数据</span>
              </button>
              <button 
                onClick={() => handleNavigation('/ClubApply')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                  isActive('/ClubApply') ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-file-signature"></i>
                <span>申报活动</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-[1176px] mx-auto px-6 py-8">
          {/* 页面标题和返回按钮 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <a 
                href="https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/298d0870-45a5-4a28-bfa5-282f0ec5f272" 
                data-readdy="true"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <i className="fas fa-arrow-left text-purple-600"></i>
              </a>
              <h1 className="text-2xl font-bold text-gray-900">申报活动</h1>
            </div>
            
            <div className="text-sm text-gray-500">
              <span>上次保存时间：2025-05-29 10:30</span>
            </div>
          </div>
          
          {/* 表单内容 */}
          <div className="space-y-6 mb-24">
            {/* 基本信息模块 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-info-circle text-purple-600 mr-2"></i>
                基本信息
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 活动名称 */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    活动名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="请输入活动名称"
                    data-error={errors.title ? "true" : "false"}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
                
                {/* 活动类型 */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    活动类型 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 text-sm border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white`}
                      data-error={errors.category ? "true" : "false"}
                    >
                      <option value="">请选择活动类型</option>
                      {categorys.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>
                
                {/* 活动开始日期 */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    开始日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    data-error={errors.startDate ? "true" : "false"}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                  )}
                </div>
                
                {/* 活动开始时间 */}
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    开始时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.startTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    data-error={errors.startTime ? "true" : "false"}
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
                  )}
                </div>
                
                {/* 活动结束日期 */}
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    结束日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    data-error={errors.endDate ? "true" : "false"}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                  )}
                </div>
                
                {/* 活动结束时间 */}
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    结束时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.endTime ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    data-error={errors.endTime ? "true" : "false"}
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
                  )}
                </div>
                
                {/* 活动地点 */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    活动地点 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="请输入活动地点"
                    data-error={errors.location ? "true" : "false"}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>
                
                {/* 人数限制 */}
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    人数限制 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity || ''}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2 text-sm border ${errors.capacity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    placeholder="请输入人数限制"
                    data-error={errors.capacity ? "true" : "false"}
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-sm text-red-500">{errors.capacity}</p>
                  )}
                </div>
                
                {/* 报名截止日期 */}
                <div>
                  <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                    报名截止日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="registrationDeadline"
                    name="registrationDeadline"
                    value={formData.registrationDeadline || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.registrationDeadline ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    data-error={errors.registrationDeadline ? "true" : "false"}
                  />
                  {errors.registrationDeadline && (
                    <p className="mt-1 text-sm text-red-500">{errors.registrationDeadline}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* 活动详细描述模块 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-align-left text-purple-600 mr-2"></i>
                活动详细描述
              </h2>
              
              <div className="space-y-6">
                {/* 活动简介 */}
                <div>
                  <label htmlFor="activitySummary" className="block text-sm font-medium text-gray-700 mb-1">
                    活动简介 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="activitySummary"
                    name="activitySummary"
                    value={formData.activitySummary || ''}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 text-sm border ${errors.activitySummary ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="请简要描述活动内容和特点"
                    data-error={errors.activitySummary ? "true" : "false"}
                  ></textarea>
                  {errors.activitySummary && (
                    <p className="mt-1 text-sm text-red-500">{errors.activitySummary}</p>
                  )}
                </div>
                
                {/* 活动目标 */}
                <div>
                  <label htmlFor="activityGoals" className="block text-sm font-medium text-gray-700 mb-1">
                    活动目标
                  </label>
                  <textarea
                    id="activityGoals"
                    name="activityGoals"
                    value={formData.activityGoals || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="请描述活动的目标和预期效果"
                  ></textarea>
                </div>
                
                {/* 活动流程 */}
                <div>
                  <label htmlFor="activityProcess" className="block text-sm font-medium text-gray-700 mb-1">
                    活动流程
                  </label>
                  <textarea
                    id="activityProcess"
                    name="activityProcess"
                    value={formData.activityProcess || ''}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="请详细描述活动的流程安排"
                  ></textarea>
                </div>
                
                {/* 注意事项 */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    注意事项
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="请填写参与者需要注意的事项"
                  ></textarea>
                </div>

                {/* 参与要求 */}
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    参与要求
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="请填写参与要求（如有）"
                  ></textarea>
                </div>

                {/* 组织者联系方式 */}
                <div>
                  <label htmlFor="organizerContact" className="block text-sm font-medium text-gray-700 mb-1">
                    组织者联系方式
                  </label>
                  <input
                    type="text"
                    id="organizerContact"
                    name="organizerContact"
                    value={formData.organizerContact || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="请输入组织者联系方式"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* 底部操作栏 */}
          <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10">
            <div className="max-w-[1176px] mx-auto flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                提交审核
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
