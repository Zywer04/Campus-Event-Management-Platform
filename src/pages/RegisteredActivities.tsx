import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../utils/api';
import type { Activity } from '../types/activity';
import { STATUS_COLORS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types/activity';

const RegisteredActivities: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    fetchRegisteredActivities();
  }, []);

  const fetchRegisteredActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/query-registered-activities');
      console.log('🔍 已报名活动数据:', response.data);
      setActivities(response.data);
    } catch (err: any) {
      console.error('获取已报名活动失败:', err);
      setError('获取已报名活动失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = (activityId: number) => {
    setSelectedActivityId(activityId);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (selectedActivityId) {
      try {
        // 这里可以调用取消报名的API
        console.log('取消报名活动:', selectedActivityId);
        // 暂时从本地状态中移除
        setActivities(prev => prev.filter(activity => activity.id !== selectedActivityId));
        alert('取消报名成功');
      } catch (err) {
        console.error('取消报名失败:', err);
        alert('取消报名失败');
      }
    }
    setShowCancelModal(false);
    setSelectedActivityId(null);
  };

  const filteredActivities = activities.filter(activity =>
    statusFilter === 'all' ? true : activity.status === statusFilter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('zh-CN');
  };

  const getRegistrationProgress = (activity: Activity) => {
    return (activity.registered / activity.capacity) * 100;
  };

  // 处理导航
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // 判断当前路径是否匹配
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    if (path === '/') {
      return currentPath === '/' || currentPath === '/registered' || currentPath === '/activities/history';
    }
    return currentPath === path;
  };

  const myActivities = [
    { id: 'registered', name: '已报名活动', icon: 'fa-calendar-check', path: '/registered' },
    { id: 'history', name: '历史参与', icon: 'fa-history', path: '/activities/history' },
  ];

  const adminMenus = [
    { id: 'publish', name: '发布活动', icon: 'fa-plus-circle', path: '/publish' },
    { id: 'manage', name: '活动管理', icon: 'fa-tasks', path: '/ActivityManage' },
    { id: 'stats', name: '数据统计', icon: 'fa-chart-bar', path: '/Stats' },
    { id: 'audit', name: '审核活动', icon: 'fa-clipboard-check', path: '/AuditPage' },
  ];

  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog', path: '/ClubActivities' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line', path: '/ClubStats' },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature', path: '/ClubApply' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRegisteredActivities}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

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
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                aria-label="切换语言"
              >
                <i className="fas fa-globe"></i>
                <span>简体中文</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => setShowLanguageDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    aria-label="切换到英文"
                  >
                    English
                  </button>
                  <button
                    onClick={() => setShowLanguageDropdown(false)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    aria-label="切换到中文"
                  >
                    简体中文
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 左侧导航 */}
      <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6 space-y-8">
          {/* 我的活动 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">我的活动</h3>
            <div className="space-y-2">
              {myActivities.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => handleNavigation(menu.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                    isActive(menu.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  } text-left transition-colors cursor-pointer`}
                  aria-label={menu.name}
                >
                  <i className={`fas ${menu.icon}`}></i>
                  <span>{menu.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 管理员功能 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">管理员功能</h3>
            <div className="space-y-2">
              {adminMenus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => handleNavigation(menu.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                    isActive(menu.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  } text-left transition-colors cursor-pointer`}
                  aria-label={menu.name}
                >
                  <i className={`fas ${menu.icon}`}></i>
                  <span>{menu.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 社团功能 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团功能</h3>
            <div className="space-y-2">
              {clubMenus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => handleNavigation(menu.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                    isActive(menu.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  } text-left transition-colors cursor-pointer`}
                  aria-label={menu.name}
                >
                  <i className={`fas ${menu.icon}`}></i>
                  <span>{menu.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">已报名活动</h1>
            <p className="text-gray-600">查看您已报名的所有活动</p>
          </div>

          {/* 筛选和视图切换 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            {/* 状态筛选 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setStatusFilter('报名中')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === '报名中'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                报名中
              </button>
              <button
                onClick={() => setStatusFilter('审核中')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === '审核中'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                审核中
              </button>
              <button
                onClick={() => setStatusFilter('已结束')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === '已结束'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                已结束
              </button>
            </div>

            {/* 视图切换 */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="列表视图"
              >
                <i className="fas fa-list"></i>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="日历视图"
              >
                <i className="fas fa-calendar-alt"></i>
              </button>
            </div>
          </div>

          {/* 活动列表 */}
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* 活动图片 */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
                    {activity.image_url ? (
                      <img 
                        src={activity.image_url} 
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className={`${CATEGORY_ICONS[activity.category as keyof typeof CATEGORY_ICONS]} text-white text-4xl`}></i>
                      </div>
                    )}
                    
                    {/* 状态标签 */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS]}`}>
                        {activity.status}
                      </span>
                    </div>
                    
                    {/* 分类标签 */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[activity.category as keyof typeof CATEGORY_COLORS]}`}>
                        {activity.category}
                      </span>
                    </div>
                  </div>

                  {/* 活动信息 */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {activity.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <i className="fas fa-calendar-alt w-4 mr-2"></i>
                        <span>{formatDate(activity.date_start)} - {formatDate(activity.date_end)}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock w-4 mr-2"></i>
                        <span>{formatTime(activity.time_start)} - {formatTime(activity.time_end)}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt w-4 mr-2"></i>
                        <span>{activity.location}</span>
                      </div>
                    </div>

                    {/* 报名进度 */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>报名进度</span>
                        <span>{activity.registered}/{activity.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getRegistrationProgress(activity)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/activities/${activity.id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        查看详情
                      </button>
                      {activity.status === '报名中' && (
                        <button
                          onClick={() => handleCancelRegistration(activity.id)}
                          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          取消报名
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-calendar-times text-gray-400 text-6xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无已报名活动</h3>
              <p className="text-gray-600 mb-6">您还没有报名任何活动</p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                浏览活动
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 取消报名确认弹窗 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">确认取消报名</h3>
            <p className="text-gray-600 mb-6">确定要取消报名这个活动吗？此操作不可撤销。</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredActivities;
