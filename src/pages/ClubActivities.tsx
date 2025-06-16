// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const App: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('clubActivities');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: '',
    end: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailSidebar, setShowDetailSidebar] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedActivity, setEditedActivity] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');
  const [showBatchStatusModal, setShowBatchStatusModal] = useState(false);
  const [batchStatus, setBatchStatus] = useState('报名中');
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'startTime', 'endTime', 'location', 'status', 'registered']);
  const handleExport = () => {
    setIsExporting(true);
    // Simulate export progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setExportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsExporting(false);
        setShowExportModal(false);
        setExportProgress(0);
        // Simulate file download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `activities_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        link.click();
      }
    }, 500);
  };
  const handleEditClick = (e: React.MouseEvent, activity: any) => {
    e.stopPropagation();
    setEditedActivity({ ...activity });
    setShowEditModal(true);
  };
  const handleSaveEdit = () => {
    const updatedActivities = activities.map(activity =>
      activity.id === editedActivity.id ? editedActivity : activity
    );
    setActivities(updatedActivities); // <--- 这一步非常关键
    if (currentActivity?.id === editedActivity.id) {
      setCurrentActivity(editedActivity);
    }
    setShowEditModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // 分类菜单
  const categories = [
    { id: 'all', name: '全部活动', icon: 'fa-list-ul' },
    { id: 'academic', name: '学术讲座', icon: 'fa-chalkboard-teacher' },
    { id: 'sports', name: '文体活动', icon: 'fa-running' },
  ];
  // 我的活动菜单
  const myActivities = [
    { id: 'registered', name: '已报名活动', icon: 'fa-calendar-check' },
    { id: 'history', name: '历史参与', icon: 'fa-history' },
  ];
  // 社团管理员菜单
  const adminMenus = [
    { id: 'publish', name: '发布活动', icon: 'fa-plus-circle' },
    { id: 'manage', name: '活动管理', icon: 'fa-tasks', url: 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/2246067d-c87d-46c4-9c5a-e7eeb8acbb91' },
    { id: 'stats', name: '数据统计', icon: 'fa-chart-bar' },
  ];
  // 社团负责人菜单
  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog', url: 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line' },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature' },
  ];
  // 模拟活动数据
  const [activities, setActivities] = useState([
    {
      id: '1',
      title: '校园文化节专场演出',
      startTime: '2025-06-15 14:00',
      endTime: '2025-06-15 17:00',
      location: '大学生活动中心',
      status: '报名中',
      statusColor: 'green',
      organizer: '学生会文艺部',
      registered: 120,
      capacity: 200,
      description: '校园文化节专场演出将展示我校学生的才艺，包括歌舞表演、器乐演奏、相声小品等多种形式。欢迎全校师生前来观看！',
    },
    {
      id: '2',
      title: '创新创业大赛决赛',
      startTime: '2025-06-20 09:00',
      endTime: '2025-06-20 18:00',
      location: '图书馆报告厅',
      status: '审核中',
      statusColor: 'yellow',
      organizer: '创新创业学院',
      registered: 45,
      capacity: 50,
      description: '本次大赛旨在培养学生的创新精神和创业能力，参赛项目涵盖人工智能、生物医药、新能源等多个领域。决赛将评选出金、银、铜奖项目。',
    },
    {
      id: '3',
      title: '校园马拉松',
      startTime: '2025-06-25 08:00',
      endTime: '2025-06-25 12:00',
      location: '校园环形跑道',
      status: '已结束',
      statusColor: 'gray',
      organizer: '体育部',
      registered: 300,
      capacity: 300,
      description: '校园马拉松分为5公里和10公里两个组别，沿校园环形跑道进行。参与者将获得纪念T恤和完赛奖牌。',
    },
    {
      id: '4',
      title: '人工智能前沿讲座',
      startTime: '2025-07-05 15:00',
      endTime: '2025-07-05 17:00',
      location: '计算机学院报告厅',
      status: '报名中',
      statusColor: 'green',
      organizer: '计算机学院学生会',
      registered: 78,
      capacity: 150,
      description: '邀请行业专家分享人工智能最新研究成果和应用案例，内容涵盖深度学习、计算机视觉、自然语言处理等热门领域。',
    },
    {
      id: '5',
      title: '社团招新嘉年华',
      startTime: '2025-09-10 10:00',
      endTime: '2025-09-10 16:00',
      location: '校园中心广场',
      status: '未开始',
      statusColor: 'blue',
      organizer: '校团委',
      registered: 0,
      capacity: 2000,
      description: '全校各社团集中展示特色活动，招募新成员。现场设有表演区、展示区和互动区，为新生提供了解校园社团文化的平台。',
    },
    {
      id: '6',
      title: '毕业生晚会',
      startTime: '2025-06-30 19:00',
      endTime: '2025-06-30 22:00',
      location: '大学生活动中心',
      status: '已驳回',
      statusColor: 'red',
      organizer: '毕业生委员会',
      registered: 0,
      capacity: 500,
      description: '为2025届毕业生举办的告别晚会，内容包括精彩节目表演、毕业感言分享、师生互动环节等，为大学生活画上圆满句号。',
    },
  ]);
  // 处理全选/取消全选
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedActivities(activities.map(activity => activity.id));
    } else {
      setSelectedActivities([]);
    }
  };
  // 处理单个选择
  const handleSelectActivity = (id: string) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(item => item !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };
  // 处理删除操作
  const handleDelete = () => {
    const updated = activities.filter(activity => !selectedActivities.includes(activity.id));
    setActivities(updated);
    setShowDeleteModal(false);
    setSelectedActivities([]);
    setCurrentActivity(null);

  };

  // 处理查看详情
  const handleViewDetail = (activity: any) => {
    setCurrentActivity(activity);
    setShowDetailSidebar(true);
  };
  // 获取状态标签的样式
  const getStatusStyle = (statusColor: string) => {
    const baseStyle = "px-2 py-1 rounded-full text-xs font-medium";
    switch (statusColor) {
      case 'green':
        return `${baseStyle} bg-green-100 text-green-800`;
      case 'yellow':
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case 'red':
        return `${baseStyle} bg-red-100 text-red-800`;
      case 'blue':
        return `${baseStyle} bg-blue-100 text-blue-800`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };
  // 过滤活动列表
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    if (!matchesStatus) return false;
    const matchesLocation = selectedLocation === 'all' || activity.location === selectedLocation;
    if (!matchesLocation) return false;
    const activityDate = new Date(activity.startTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (dateRange) {
      case 'today':
        return activityDate >= today && activityDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      case 'week': {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return activityDate >= weekStart && activityDate < weekEnd;
      }
      case 'month': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return activityDate >= monthStart && activityDate <= monthEnd;
      }
      case 'custom': {
        const start = new Date(customDateRange.start);
        const end = new Date(customDateRange.end);
        end.setHours(23, 59, 59, 999);
        return activityDate >= start && activityDate <= end;
      }
      default:
        return true;
    }
  });

  // 处理导航
  const handleNavigation = (path: string) => {
    navigate(path);
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
                  onClick={() => handleNavigation(`/?category=${category.id}`)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    selectedCategory === category.id
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
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
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id === 'registered' ? '/registered' : '/activities/history')}
                  className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团管理员</h3>
            <div className="space-y-2">
              {adminMenus.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id === 'publish' ? '/publish' : item.id === 'manage' ? '/ActivityManage' : item.id === 'stats' ? '/Stats' : '/AuditPage')}
                  className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团负责人</h3>
            <div className="space-y-2">
              {clubMenus.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id === 'clubActivities' ? '/ClubActivities' : item.id === 'clubStats' ? '/ClubStats' : '/ClubApply')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    selectedCategory === item.id
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* 主内容区 */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-[1176px] mx-auto px-6 py-8">
          {/* 页面标题 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">社团活动管理</h1>
            <button
              onClick={() => handleNavigation('/publish')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button"
            >
              <i className="fas fa-plus"></i>
              <span>新建活动</span>
            </button>
          </div>
          {/* 搜索和筛选区域 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="搜索活动名称、地点..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className={`flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border ${dateRange !== 'all' ? 'border-purple-500 text-purple-600' : 'border-gray-200 text-gray-700'} hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button`}
                >
                  <i className={`fas fa-calendar-alt ${dateRange !== 'all' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                  <span>活动时间</span>
                  <i className={`fas fa-chevron-down text-xs ${dateRange !== 'all' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                </button>
                {showDateFilter && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 hover:bg-purple-50 cursor-pointer" onClick={() => {
                      setDateRange('today');
                      setShowDateFilter(false);
                    }}>
                      <span className="text-gray-700">今天</span>
                    </div>
                    <div className="px-4 py-2 hover:bg-purple-50 cursor-pointer" onClick={() => {
                      setDateRange('week');
                      setShowDateFilter(false);
                    }}>
                      <span className="text-gray-700">本周</span>
                    </div>
                    <div className="px-4 py-2 hover:bg-purple-50 cursor-pointer" onClick={() => {
                      setDateRange('month');
                      setShowDateFilter(false);
                    }}>
                      <span className="text-gray-700">本月</span>
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-2">自定义日期范围</p>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => {
                            if (customDateRange.start && customDateRange.end) {
                              setDateRange('custom');
                              setShowDateFilter(false);
                            }
                          }}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm cursor-pointer whitespace-nowrap !rounded-button"
                        >
                          应用
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 hover:bg-purple-50 cursor-pointer" onClick={() => {
                      setDateRange('all');
                      setCustomDateRange({ start: '', end: '' });
                      setShowDateFilter(false);
                    }}>
                      <span className="text-gray-700">清除筛选</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                  className={`flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border ${selectedStatus !== 'all' ? 'border-purple-500 text-purple-600' : 'border-gray-200 text-gray-700'
                    } hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button`}
                >
                  <i className={`fas fa-tag ${selectedStatus !== 'all' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                  <span>活动状态</span>
                  <i className={`fas fa-chevron-down text-xs ${selectedStatus !== 'all' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                </button>
                {showStatusFilter && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStatus('all');
                        setShowStatusFilter(false);
                      }}
                    >
                      <span className="text-gray-700">全部</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStatus('报名中');
                        setShowStatusFilter(false);
                      }}
                    >
                      <span className="text-gray-700">报名中</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStatus('审核中');
                        setShowStatusFilter(false);
                      }}
                    >
                      <span className="text-gray-700">审核中</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStatus('已结束');
                        setShowStatusFilter(false);
                      }}
                    >
                      <span className="text-gray-700">已结束</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStatus('未开始');
                        setShowStatusFilter(false);
                      }}
                    >
                      <span className="text-gray-700">未开始</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStatus('已驳回');
                        setShowStatusFilter(false);
                      }}
                    >
                      <span className="text-gray-700">已驳回</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowLocationFilter(!showLocationFilter)}
                  className={`flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border ${selectedLocation !== 'all' ? 'border-purple-500 text-purple-600' : 'border-gray-200 text-gray-700'
                    } hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button`}
                >
                  <i className={`fas fa-map-marker-alt ${selectedLocation !== 'all' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                  <span>活动地点</span>
                  <i className={`fas fa-chevron-down text-xs ${selectedLocation !== 'all' ? 'text-purple-600' : 'text-gray-400'}`}></i>
                </button>
                {showLocationFilter && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation('all');
                        setShowLocationFilter(false);
                      }}
                    >
                      <span className="text-gray-700">全部地点</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation('大学生活动中心');
                        setShowLocationFilter(false);
                      }}
                    >
                      <span className="text-gray-700">大学生活动中心</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation('图书馆报告厅');
                        setShowLocationFilter(false);
                      }}
                    >
                      <span className="text-gray-700">图书馆报告厅</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation('校园环形跑道');
                        setShowLocationFilter(false);
                      }}
                    >
                      <span className="text-gray-700">校园环形跑道</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation('计算机学院报告厅');
                        setShowLocationFilter(false);
                      }}
                    >
                      <span className="text-gray-700">计算机学院报告厅</span>
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLocation('校园中心广场');
                        setShowLocationFilter(false);
                      }}
                    >
                      <span className="text-gray-700">校园中心广场</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 批量操作区域 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {selectedActivities.length > 0 && (
                <span className="text-sm text-gray-500">
                  已选择 {selectedActivities.length} 项
                </span>
              )}
              <button
                onClick={() => {
                  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                  const allChecked = selectedActivities.length === filteredActivities.length;
                  checkboxes.forEach((checkbox: any) => {
                    checkbox.checked = !allChecked;
                  });
                  if (allChecked) {
                    setSelectedActivities([]);
                  } else {
                    setSelectedActivities(filteredActivities.map(activity => activity.id));
                  }
                }}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className={`fas ${selectedActivities.length === filteredActivities.length ? 'fa-times' : 'fa-check-square'}`}></i>
                <span>{selectedActivities.length === filteredActivities.length ? '取消全选' : '全选当前页'}</span>
              </button>
              <button
                onClick={() => selectedActivities.length > 0 && setShowDeleteModal(true)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button ${selectedActivities.length > 0
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={selectedActivities.length === 0}
              >
                <i className="fas fa-trash-alt"></i>
                <span>批量删除</span>
              </button>
              <button
                onClick={() => selectedActivities.length > 0 && setShowExportModal(true)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button ${selectedActivities.length > 0
                  ? 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={selectedActivities.length === 0}
              >
                <i className="fas fa-file-export"></i>
                <span>批量导出</span>
              </button>
              <button
                onClick={() => selectedActivities.length > 0 && setShowBatchStatusModal(true)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button ${selectedActivities.length > 0
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                disabled={selectedActivities.length === 0}
              >
                <i className="fas fa-edit"></i>
                <span>批量修改状态</span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              共 {filteredActivities.length} 个活动
            </div>
          </div>
          {/* 活动列表表格 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={selectedActivities.length === activities.length && activities.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动地点
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    报名人数
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className={`cursor-pointer ${selectedActivities.includes(activity.id) ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleViewDetail(activity)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={selectedActivities.includes(activity.id)}
                        onChange={() => handleSelectActivity(activity.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{activity.startTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{activity.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusStyle(activity.statusColor)}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{activity.registered}/{activity.capacity}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="text-purple-600 hover:text-purple-900 mr-3 cursor-pointer whitespace-nowrap !rounded-button"
                        onClick={(e) => handleEditClick(e, activity)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 cursor-pointer whitespace-nowrap !rounded-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivities([activity.id]);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* 空状态 */}
            {filteredActivities.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <i className="fas fa-calendar-times text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500">暂无符合条件的活动</p>
              </div>
            )}
          </div>
          {/* 分页 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              显示 1 至 {filteredActivities.length} 条，共 {filteredActivities.length} 条
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed whitespace-nowrap !rounded-button">
                上一页
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-lg cursor-pointer whitespace-nowrap !rounded-button">
                1
              </button>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed whitespace-nowrap !rounded-button">
                下一页
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">确认删除</h3>
              <p className="text-sm text-gray-500">
                您确定要删除选中的 {selectedActivities.length} 个活动吗？此操作不可恢复。
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer whitespace-nowrap !rounded-button"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 编辑活动模态窗口 */}
      {showEditModal && editedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">编辑活动</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">活动名称</label>
                <input
                  type="text"
                  value={editedActivity.name}
                  onChange={(e) => setEditedActivity({ ...editedActivity, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">活动地点</label>
                <input
                  type="text"
                  value={editedActivity.location}
                  onChange={(e) => setEditedActivity({ ...editedActivity, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                <input
                  type="datetime-local"
                  value={editedActivity.startTime.replace(' ', 'T')}
                  onChange={(e) => setEditedActivity({ ...editedActivity, startTime: e.target.value.replace('T', ' ') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
                <input
                  type="datetime-local"
                  value={editedActivity.endTime.replace(' ', 'T')}
                  onChange={(e) => setEditedActivity({ ...editedActivity, endTime: e.target.value.replace('T', ' ') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">活动状态</label>
                <select
                  value={editedActivity.status}
                  onChange={(e) => setEditedActivity({
                    ...editedActivity,
                    status: e.target.value,
                    statusColor: e.target.value === '报名中' ? 'green' : e.target.value === '审核中' ? 'yellow' : e.target.value === '已结束' ? 'gray' : e.target.value === '未开始' ? 'blue' : 'red'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="报名中">报名中</option>
                  <option value="审核中">审核中</option>
                  <option value="已结束">已结束</option>
                  <option value="未开始">未开始</option>
                  <option value="已驳回">已驳回</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">主办方</label>
                <input
                  type="text"
                  value={editedActivity.organizer}
                  onChange={(e) => setEditedActivity({ ...editedActivity, organizer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">活动描述</label>
              <textarea
                value={editedActivity.description}
                onChange={(e) => setEditedActivity({ ...editedActivity, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer whitespace-nowrap !rounded-button"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 导出选项弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">导出选项</h3>
              <button
                onClick={() => !isExporting && setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {!isExporting ? (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setExportFormat('excel')}
                      className={`px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button ${exportFormat === 'excel'
                        ? 'bg-purple-50 text-purple-600 border-2 border-purple-600'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <i className="fas fa-file-excel"></i>
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={() => setExportFormat('csv')}
                      className={`px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button ${exportFormat === 'csv'
                        ? 'bg-purple-50 text-purple-600 border-2 border-purple-600'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <i className="fas fa-file-csv"></i>
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => setExportFormat('pdf')}
                      className={`px-4 py-2 rounded-lg flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button ${exportFormat === 'pdf'
                        ? 'bg-purple-50 text-purple-600 border-2 border-purple-600'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <i className="fas fa-file-pdf"></i>
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">导出字段</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes('name')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, 'name']);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== 'name'));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">活动名称</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes('startTime')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, 'startTime']);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== 'startTime'));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">开始时间</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes('endTime')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, 'endTime']);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== 'endTime'));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">结束时间</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes('location')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, 'location']);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== 'location'));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">活动地点</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes('status')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, 'status']);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== 'status'));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">活动状态</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes('registered')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFields([...selectedFields, 'registered']);
                          } else {
                            setSelectedFields(selectedFields.filter(f => f !== 'registered'));
                          }
                        }}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">报名人数</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={selectedFields.length === 0}
                    className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap !rounded-button ${selectedFields.length > 0
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    确认导出
                  </button>
                </div>
              </>
            ) : (
              <div className="py-6">
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-center text-gray-600">正在导出文件，请稍候...</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 批量修改状态弹窗 */}
      {showBatchStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">批量修改状态</h3>
              <button
                onClick={() => setShowBatchStatusModal(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="status-registering"
                  name="batch-status"
                  value="报名中"
                  checked={batchStatus === '报名中'}
                  onChange={(e) => setBatchStatus(e.target.value)}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="status-registering" className="text-gray-700">报名中</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="status-reviewing"
                  name="batch-status"
                  value="审核中"
                  checked={batchStatus === '审核中'}
                  onChange={(e) => setBatchStatus(e.target.value)}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="status-reviewing" className="text-gray-700">审核中</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="status-finished"
                  name="batch-status"
                  value="已结束"
                  checked={batchStatus === '已结束'}
                  onChange={(e) => setBatchStatus(e.target.value)}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="status-finished" className="text-gray-700">已结束</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="status-not-started"
                  name="batch-status"
                  value="未开始"
                  checked={batchStatus === '未开始'}
                  onChange={(e) => setBatchStatus(e.target.value)}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="status-not-started" className="text-gray-700">未开始</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="status-rejected"
                  name="batch-status"
                  value="已驳回"
                  checked={batchStatus === '已驳回'}
                  onChange={(e) => setBatchStatus(e.target.value)}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="status-rejected" className="text-gray-700">已驳回</label>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBatchStatusModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const updatedActivities = activities.map(activity => {
                    if (selectedActivities.includes(activity.id)) {
                      return {
                        ...activity,
                        status: batchStatus,
                        statusColor: batchStatus === '报名中' ? 'green' : batchStatus === '审核中' ? 'yellow' : batchStatus === '已结束' ? 'gray' : batchStatus === '未开始' ? 'blue' : 'red'
                      };
                    }
                    return activity;
                  });
                  setShowBatchStatusModal(false);
                  setShowSuccessToast(true);
                  setTimeout(() => setShowSuccessToast(false), 3000);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer whitespace-nowrap !rounded-button"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <i className="fas fa-check-circle"></i>
          <span>活动信息已成功更新</span>
        </div>
      )}
      {/* 活动详情侧边栏 */}
      {showDetailSidebar && currentActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">活动详情</h2>
              <button
                onClick={() => setShowDetailSidebar(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-8">
                <img
                  src={`https://readdy.ai/api/search-image?query=University%2520campus%2520event%2520showing%2520students%2520participating%2520in%2520cultural%2520activities%2520with%2520colorful%2520decorations%2520and%2520modern%2520university%2520buildings%2520in%2520background%2520professional%2520photography%2520style%2520with%2520natural%2520lighting&width=400&height=250&seq=${currentActivity.id}&orientation=landscape`}
                  alt={currentActivity.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{currentActivity.name}</h3>
                <span className={getStatusStyle(currentActivity.statusColor)}>
                  {currentActivity.status}
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">活动描述</h4>
                  <p className="text-gray-700">{currentActivity.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">开始时间</h4>
                    <p className="text-gray-700">{currentActivity.startTime}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">结束时间</h4>
                    <p className="text-gray-700">{currentActivity.endTime}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">活动地点</h4>
                  <p className="text-gray-700">{currentActivity.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">主办方</h4>
                  <p className="text-gray-700">{currentActivity.organizer}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">报名情况</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${(currentActivity.registered / currentActivity.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700">{currentActivity.registered}/{currentActivity.capacity} 人</p>
                </div>
              </div>
              <div className="mt-8 flex space-x-4">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-edit"></i>
                  <span>编辑活动</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedActivities([currentActivity.id]);
                    setShowDetailSidebar(false);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className="fas fa-trash-alt"></i>
                  <span>删除活动</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App