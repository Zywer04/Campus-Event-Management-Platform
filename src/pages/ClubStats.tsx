// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useNavigate, useLocation } from 'react-router-dom';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    if (path.startsWith('/?category=')) {
      return currentPath === '/' && location.search === path.slice(1);
    }
    if (path === '/ActivityManage') {
      return currentPath === '/ActivityManage';
    }
    if (path === '/ClubActivities') {
      return currentPath === '/ClubActivities';
    }
    return currentPath === path;
  };

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [sortBy, setSortBy] = useState('registered');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  const [activityType, setActivityType] = useState('all');
  const [showActivityTypeDropdown, setShowActivityTypeDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    { id: 'audit', name: '活动审核', icon: 'fa-clipboard-check' }
  ];

  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line', active: true },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature', url: 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/3089135d-8432-4651-9254-c7c26fadd5b5' },
  ];

  const activities = [
    { id: 1, title: '校园马拉松', category: '文体活动', date: '2025-05-15', registered: 328, capacity: 400, rate: '82%', satisfaction: 4.8, club: '体育社团联合会' },
    { id: 2, title: '人工智能讲座', category: '学术讲座', date: '2025-05-20', registered: 256, capacity: 300, rate: '85%', satisfaction: 4.6, club: '计算机协会' },
    { id: 3, title: '社团文化节', category: '文化节日', date: '2025-04-25', registered: 215, capacity: 275, rate: '78%', satisfaction: 4.5, club: '校团委' },
    { id: 4, title: '志愿者服务日', category: '志愿服务', date: '2025-05-10', registered: 189, capacity: 205, rate: '92%', satisfaction: 4.9, club: '青年志愿者协会' },
    { id: 5, title: '创新创业大赛', category: '学术讲座', date: '2025-05-05', registered: 167, capacity: 220, rate: '75%', satisfaction: 4.3, club: '创业协会' },
    { id: 6, title: '篮球友谊赛', category: '文体活动', date: '2025-04-30', registered: 145, capacity: 165, rate: '88%', satisfaction: 4.7, club: '篮球协会' },
    { id: 7, title: '读书分享会', category: '文化节日', date: '2025-04-22', registered: 132, capacity: 180, rate: '72%', satisfaction: 4.4, club: '读书协会' },
    { id: 8, title: '摄影大赛', category: '文化节日', date: '2025-05-18', registered: 128, capacity: 150, rate: '85%', satisfaction: 4.5, club: '摄影协会' },
    { id: 9, title: '编程马拉松', category: '学术讲座', date: '2025-05-12', registered: 124, capacity: 150, rate: '83%', satisfaction: 4.7, club: '编程俱乐部' },
    { id: 10, title: '环保宣传活动', category: '志愿服务', date: '2025-05-08', registered: 118, capacity: 140, rate: '84%', satisfaction: 4.6, club: '环保协会' },
    { id: 11, title: '音乐会', category: '文化节日', date: '2025-05-22', registered: 112, capacity: 130, rate: '86%', satisfaction: 4.8, club: '音乐协会' },
    { id: 12, title: '职业规划讲座', category: '学术讲座', date: '2025-05-25', registered: 108, capacity: 120, rate: '90%', satisfaction: 4.7, club: '就业指导中心' },
    { id: 13, title: '国际文化交流日', category: '文化节日', date: '2025-05-28', registered: 105, capacity: 130, rate: '81%', satisfaction: 4.5, club: '国际交流协会' },
    { id: 14, title: '足球联赛', category: '文体活动', date: '2025-05-16', registered: 98, capacity: 110, rate: '89%', satisfaction: 4.6, club: '足球协会' },
    { id: 15, title: '心理健康讲座', category: '学术讲座', date: '2025-05-14', registered: 95, capacity: 120, rate: '79%', satisfaction: 4.4, club: '心理健康协会' },
    { id: 16, title: '舞蹈比赛', category: '文体活动', date: '2025-05-19', registered: 92, capacity: 100, rate: '92%', satisfaction: 4.8, club: '舞蹈团' },
    { id: 17, title: '科技创新展', category: '学术讲座', date: '2025-05-23', registered: 88, capacity: 100, rate: '88%', satisfaction: 4.5, club: '科技协会' },
    { id: 18, title: '义务献血活动', category: '志愿服务', date: '2025-05-26', registered: 85, capacity: 100, rate: '85%', satisfaction: 4.7, club: '红十字会学生分会' },
    { id: 19, title: '电影放映会', category: '文化节日', date: '2025-05-21', registered: 82, capacity: 100, rate: '82%', satisfaction: 4.3, club: '电影协会' },
    { id: 20, title: '辩论赛', category: '学术讲座', date: '2025-05-27', registered: 78, capacity: 90, rate: '87%', satisfaction: 4.6, club: '辩论协会' },
  ];

  const filteredActivities = activities
    .filter(activity => {
      if (activityType !== 'all' && activity.category !== categories.find(cat => cat.id === activityType)?.name) {
        return false;
      }
      if (searchTerm && !activity.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'registered') {
        return sortOrder === 'desc' ? b.registered - a.registered : a.registered - b.registered;
      }
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'satisfaction') {
        return sortOrder === 'desc' ? b.satisfaction - a.satisfaction : a.satisfaction - b.satisfaction;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const activityTypeChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activityTypeChartRef.current) {
      const chart = echarts.init(activityTypeChartRef.current);
      const option = {
        animation: false,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['学术讲座', '文体活动', '志愿服务', '文化节日']
        },
        series: [
          {
            name: '活动类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 35, name: '学术讲座', itemStyle: { color: '#8b5cf6' } },
              { value: 25, name: '文体活动', itemStyle: { color: '#ec4899' } },
              { value: 15, name: '志愿服务', itemStyle: { color: '#10b981' } },
              { value: 25, name: '文化节日', itemStyle: { color: '#f59e0b' } }
            ]
          }
        ]
      };
      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
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
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50">
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
                  onClick={() => handleNavigation(category.id === 'all' ? '/' : `/?category=${category.id}`)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    (category.id === 'all' && location.pathname === '/') || 
                    (category.id !== 'all' && location.search === `?category=${category.id}`) 
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
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    isActive(item.id === 'registered' ? '/registered' : '/activities/history') 
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
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团管理员</h3>
            <div className="space-y-2">
              {adminMenus.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id === 'publish' ? '/publish' : 
                    item.id === 'manage' ? '/ActivityManage' : 
                    item.id === 'audit' ? '/AuditPage' : '/Stats')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    isActive(item.id === 'publish' ? '/publish' : 
                      item.id === 'manage' ? '/ActivityManage' : 
                      item.id === 'audit' ? '/AuditPage' : '/Stats') 
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
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团负责人</h3>
            <div className="space-y-2">
              {clubMenus.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id === 'clubActivities' ? '/ClubActivities' : 
                    item.id === 'clubStats' ? '/ClubStats' : '/ClubApply')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    isActive(item.id === 'clubActivities' ? '/ClubActivities' : 
                      item.id === 'clubStats' ? '/ClubStats' : '/ClubApply') 
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
              <h1 className="text-2xl font-bold text-gray-900">热门活动排行榜</h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-download text-purple-600"></i>
                <span>导出报表</span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>
              {showExportDropdown && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button">
                    <i className="fas fa-file-excel text-green-600"></i>
                    <span>导出为 Excel</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button">
                    <i className="fas fa-file-pdf text-red-600"></i>
                    <span>导出为 PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 活动排行榜概览 */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">总活动数</h3>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <i className="fas fa-calendar-check text-xl text-purple-600"></i>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">{activities.length}</span>
                <span className="text-sm text-green-600 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  12.5%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">较上月增长</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">总参与人次</h3>
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <i className="fas fa-users text-xl text-pink-600"></i>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">2,547</span>
                <span className="text-sm text-green-600 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  8.3%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">较上月增长</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">平均满意度</h3>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i className="fas fa-star text-xl text-yellow-500"></i>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">4.6</span>
                <span className="text-sm text-green-600 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  0.2
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">较上月提升</p>
            </div>
          </div>

          {/* 筛选与图表区域 */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">活动筛选</h3>
                <div className="text-sm text-gray-500">
                  <span>数据更新时间：2025-06-15 08:30</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* 时间范围筛选 */}
                <div className="relative">
                  <button
                    onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-calendar-alt text-purple-600"></i>
                      <span>
                        {timeRange === 'day' && '今日数据'}
                        {timeRange === 'week' && '本周数据'}
                        {timeRange === 'month' && '本月数据'}
                        {timeRange === 'year' && '本年度数据'}
                      </span>
                    </div>
                    <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                  </button>
                  {showTimeDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg py-2 z-10">
                      <button
                        onClick={() => {
                          setTimeRange('day');
                          setShowTimeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>今日数据</span>
                        {timeRange === 'day' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                      <button
                        onClick={() => {
                          setTimeRange('week');
                          setShowTimeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>本周数据</span>
                        {timeRange === 'week' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                      <button
                        onClick={() => {
                          setTimeRange('month');
                          setShowTimeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>本月数据</span>
                        {timeRange === 'month' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                      <button
                        onClick={() => {
                          setTimeRange('year');
                          setShowTimeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>本年度数据</span>
                        {timeRange === 'year' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                    </div>
                  )}
                </div>

                {/* 活动类型筛选 */}
                <div className="relative">
                  <button
                    onClick={() => setShowActivityTypeDropdown(!showActivityTypeDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-tags text-purple-600"></i>
                      <span>
                        {activityType === 'all' && '全部类型'}
                        {activityType === 'academic' && '学术讲座'}
                        {activityType === 'sports' && '文体活动'}
                        {activityType === 'volunteer' && '志愿服务'}
                        {activityType === 'culture' && '文化节日'}
                      </span>
                    </div>
                    <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                  </button>
                  {showActivityTypeDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg py-2 z-10">
                      <button
                        onClick={() => {
                          setActivityType('all');
                          setShowActivityTypeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>全部类型</span>
                        {activityType === 'all' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                      <button
                        onClick={() => {
                          setActivityType('academic');
                          setShowActivityTypeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>学术讲座</span>
                        {activityType === 'academic' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                      <button
                        onClick={() => {
                          setActivityType('sports');
                          setShowActivityTypeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>文体活动</span>
                        {activityType === 'sports' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                      <button
                        onClick={() => {
                          setActivityType('volunteer');
                          setShowActivityTypeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>志愿服务</span>
                        {activityType === 'volunteer' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                      <button
                        onClick={() => {
                          setActivityType('culture');
                          setShowActivityTypeDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>文化节日</span>
                        {activityType === 'culture' && <i className="fas fa-check text-purple-600"></i>}
                      </button>
                    </div>
                  )}
                </div>

                {/* 搜索框 */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索活动名称..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 活动类型分布图 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">活动类型分布</h3>
              </div>
              <div ref={activityTypeChartRef} className="w-full h-[200px]"></div>
            </div>
          </div>

          {/* 活动列表 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-800">热门活动排行榜</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">共 {filteredActivities.length} 个活动</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">排名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-1 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>活动名称</span>
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center space-x-1 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>活动日期</span>
                        {sortBy === 'date' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-1`}></i>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('registered')}
                        className="flex items-center space-x-1 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>参与人数</span>
                        {sortBy === 'registered' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-1`}></i>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参与率</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('satisfaction')}
                        className="flex items-center space-x-1 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <span>满意度</span>
                        {sortBy === 'satisfaction' && (
                          <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-1`}></i>
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">主办方</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentActivities.map((activity, index) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full ${index < 3 ? 'bg-purple-100' : 'bg-gray-100'} flex items-center justify-center`}>
                          <span className={`font-medium ${index < 3 ? 'text-purple-600' : 'text-gray-600'}`}>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.category === '学术讲座' ? 'bg-purple-100 text-purple-800' :
                          activity.category === '文体活动' ? 'bg-pink-100 text-pink-800' :
                          activity.category === '志愿服务' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.date}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.registered}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.rate}</div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: activity.rate }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">{activity.satisfaction.toFixed(1)}</span>
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`text-xs ${
                                  star <= Math.floor(activity.satisfaction)
                                    ? 'fas fa-star'
                                    : star - 0.5 <= activity.satisfaction
                                      ? 'fas fa-star-half-alt'
                                      : 'far fa-star'
                                }`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.club}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-purple-600 hover:text-purple-800 mr-3 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-chart-bar mr-1"></i> 详情
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentActivities.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <i className="fas fa-search text-3xl text-gray-300 mb-3"></i>
                          <p>没有找到匹配的活动数据</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页控件 */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">每页显示</span>
                <div className="relative">
                  <button
                    onClick={() => setShowItemsPerPageDropdown(!showItemsPerPageDropdown)}
                    className="flex items-center space-x-1 px-3 py-1 bg-white rounded-lg border border-gray-200 text-gray-700 text-sm hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <span>{itemsPerPage}</span>
                    <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                  </button>
                  {showItemsPerPageDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-16 bg-white rounded-lg shadow-lg py-1 z-10">
                      {[5, 10, 20, 50].map(size => (
                        <button
                          key={size}
                          onClick={() => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                            setShowItemsPerPageDropdown(false);
                          }}
                          className="flex items-center justify-between w-full px-3 py-1 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                        >
                          <span>{size}</span>
                          {itemsPerPage === size && <i className="fas fa-check text-purple-600"></i>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  显示 {(currentPage - 1) * itemsPerPage + 1} 至 {Math.min(currentPage * itemsPerPage, filteredActivities.length)} 条，共 {filteredActivities.length} 条
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentPage === 1
                      ? 'text-gray-300 border border-gray-200 cursor-not-allowed'
                      : 'text-gray-600 border border-gray-200 hover:text-purple-600 hover:border-purple-500 cursor-pointer'
                  } whitespace-nowrap !rounded-button`}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-500'
                      } cursor-pointer whitespace-nowrap !rounded-button`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentPage === totalPages
                      ? 'text-gray-300 border border-gray-200 cursor-not-allowed'
                      : 'text-gray-600 border border-gray-200 hover:text-purple-600 hover:border-purple-500 cursor-pointer'
                  } whitespace-nowrap !rounded-button`}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
