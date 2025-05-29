import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ClubApply: React.FC = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [formData, setFormData] = useState({
    activityName: '',
    activityType: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    maxParticipants: '',
    registrationDeadline: '',
    activitySummary: '',
    activityGoals: '',
    activityProcess: '',
    notes: '',
    venueRequirements: [],
    equipmentNeeds: [{ name: '', quantity: '', description: '' }],
    budget: '',
    otherRequirements: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [poster, setPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const activityTypes = [
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
    if (!formData.activityName.trim()) newErrors.activityName = '请输入活动名称';
    if (!formData.activityType) newErrors.activityType = '请选择活动类型';
    if (!formData.startDate) newErrors.startDate = '请选择开始日期';
    if (!formData.startTime) newErrors.startTime = '请选择开始时间';
    if (!formData.endDate) newErrors.endDate = '请选择结束日期';
    if (!formData.endTime) newErrors.endTime = '请选择结束时间';
    if (!formData.location.trim()) newErrors.location = '请输入活动地点';
    if (!formData.maxParticipants) newErrors.maxParticipants = '请输入人数限制';
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
    if (formData.maxParticipants && parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = '人数限制必须大于0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (isDraft: boolean = false) => {
    if (!isDraft && !validateForm()) {
      // 滚动到第一个错误字段
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 在这里处理表单提交逻辑
    console.log('Form submitted:', { ...formData, poster, files, isDraft });

    // 模拟提交成功
    alert(isDraft ? '已保存为草稿' : '申请已提交审核');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-globe"></i>
                <span>简体中文</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                    English
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                    简体中文
                  </a>
                </div>
              )}
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
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button text-gray-600 hover:bg-gray-50`}
                >
                  <i className={`fas ${category.icon}`}></i>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">我的活动</h3>
            <div className="space-y-2">
              {myActivities.map(item => (
                <a
                  key={item.id}
                  href="#"
                  className="block"
                >
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团管理员</h3>
            <div className="space-y-2">
              {adminMenus.map(item => (
                <a
                  key={item.id}
                  href="#"
                  className="block"
                >
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团负责人</h3>
            <div className="space-y-2">
              {clubMenus.map(item => (
                <a
                  key={item.id}
                  href={item.id === 'clubStats' ? 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/298d0870-45a5-4a28-bfa5-282f0ec5f272' : '#'}
                  data-readdy={item.id === 'clubStats' ? 'true' : undefined}
                  className="block"
                >
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      item.active ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </a>
              ))}
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
                  <label htmlFor="activityName" className="block text-sm font-medium text-gray-700 mb-1">
                    活动名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="activityName"
                    name="activityName"
                    value={formData.activityName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 text-sm border ${errors.activityName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    placeholder="请输入活动名称"
                    data-error={errors.activityName ? "true" : "false"}
                  />
                  {errors.activityName && (
                    <p className="mt-1 text-sm text-red-500">{errors.activityName}</p>
                  )}
                </div>

                {/* 活动类型 */}
                <div>
                  <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 mb-1">
                    活动类型 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="activityType"
                      name="activityType"
                      value={formData.activityType}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 text-sm border ${errors.activityType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white`}
                      data-error={errors.activityType ? "true" : "false"}
                    >
                      <option value="">请选择活动类型</option>
                      {activityTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                  {errors.activityType && (
                    <p className="mt-1 text-sm text-red-500">{errors.activityType}</p>
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
                    value={formData.startDate}
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
                    value={formData.startTime}
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
                    value={formData.endDate}
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
                    value={formData.endTime}
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
                    value={formData.location}
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
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                    人数限制 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2 text-sm border ${errors.maxParticipants ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    placeholder="请输入人数限制"
                    data-error={errors.maxParticipants ? "true" : "false"}
                  />
                  {errors.maxParticipants && (
                    <p className="mt-1 text-sm text-red-500">{errors.maxParticipants}</p>
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
                    value={formData.registrationDeadline}
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
                    value={formData.activitySummary}
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
                    value={formData.activityGoals}
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
                    value={formData.activityProcess}
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
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="请填写参与者需要注意的事项"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 资源申请模块 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-cube text-purple-600 mr-2"></i>
                资源申请
              </h2>

              <div className="space-y-6">
                {/* 场地需求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    场地需求
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {venueOptions.map(venue => (
                      <div key={venue.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`venue_${venue.id}`}
                          checked={formData.venueRequirements.includes(venue.id)}
                          onChange={() => handleVenueChange(venue.id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`venue_${venue.id}`} className="ml-2 text-sm text-gray-700">
                          {venue.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 器材需求 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    器材需求
                  </label>
                  <div className="space-y-3">
                    {formData.equipmentNeeds.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleEquipmentChange(index, 'name', e.target.value)}
                            placeholder="器材名称"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleEquipmentChange(index, 'quantity', e.target.value)}
                            placeholder="数量"
                            min="1"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleEquipmentChange(index, 'description', e.target.value)}
                            placeholder="备注"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEquipmentItem(index)}
                          className="mt-2 text-red-500 hover:text-red-700 cursor-pointer whitespace-nowrap !rounded-button"
                          disabled={formData.equipmentNeeds.length === 1}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addEquipmentItem}
                      className="flex items-center text-sm text-purple-600 hover:text-purple-800 cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      添加器材
                    </button>
                  </div>
                </div>

                {/* 预算申请 */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    预算申请 (元)
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full md:w-1/3 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="请输入预算金额"
                  />
                </div>

                {/* 其他需求 */}
                <div>
                  <label htmlFor="otherRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                    其他需求
                  </label>
                  <textarea
                    id="otherRequirements"
                    name="otherRequirements"
                    value={formData.otherRequirements}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="请填写其他资源需求"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 附件上传模块 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-paperclip text-purple-600 mr-2"></i>
                附件上传
              </h2>

              <div className="space-y-6">
                {/* 活动海报上传 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    活动海报
                  </label>
                  <div className="flex items-start space-x-6">
                    <div
                      className={`w-40 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${posterPreview ? 'border-purple-300' : 'border-gray-300'}`}
                      onClick={() => posterInputRef.current?.click()}
                    >
                      {posterPreview ? (
                        <img
                          src={posterPreview}
                          alt="活动海报预览"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <i className="fas fa-image text-gray-400 text-3xl mb-2"></i>
                          <span className="text-sm text-gray-500">点击上传海报</span>
                        </>
                      )}
                      <input
                        type="file"
                        ref={posterInputRef}
                        onChange={handlePosterChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="text-sm text-gray-500 mb-2">
                        支持 JPG、PNG、GIF 格式，建议尺寸 800x1200 像素，文件大小不超过 2MB
                      </p>
                      {posterPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setPoster(null);
                            setPosterPreview('');
                          }}
                          className="text-sm text-red-500 hover:text-red-700 cursor-pointer whitespace-nowrap !rounded-button"
                        >
                          <i className="fas fa-trash-alt mr-1"></i>
                          删除海报
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 相关文件上传 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    相关文件
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <i className="fas fa-file-upload text-gray-400 text-3xl mb-2"></i>
                      <p className="text-sm text-gray-500 mb-2">
                        拖拽文件到此处，或
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-purple-600 hover:text-purple-800 mx-1 cursor-pointer whitespace-nowrap !rounded-button"
                        >
                          点击上传
                        </button>
                      </p>
                      <p className="text-xs text-gray-400">
                        支持多个文件上传，单个文件大小不超过 10MB
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* 已上传文件列表 */}
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">已上传文件</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <i className={`fas ${file.type.includes('pdf') ? 'fa-file-pdf text-red-500' : file.type.includes('word') ? 'fa-file-word text-blue-500' : file.type.includes('excel') ? 'fa-file-excel text-green-500' : 'fa-file text-gray-500'}`}></i>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 cursor-pointer whitespace-nowrap !rounded-button"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10">
            <div className="max-w-[1176px] mx-auto flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                保存草稿
              </button>
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

export default ClubApply;
