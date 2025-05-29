import React, { useState } from 'react';
import * as echarts from 'echarts';

const HistoryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature' },
  ];

  const historyActivities = [
    {
      id: 1,
      name: '校园马拉松大赛',
      date: '2025-05-20',
      location: '校园体育场',
      status: 'completed',
      image: 'https://readdy.ai/api/search-image?query=A%2520dynamic%2520university%2520marathon%2520event%2520with%2520students%2520running%2520through%2520a%2520beautiful%2520campus%2520setting%2520modern%2520architecture%2520and%2520natural%2520landscape%2520professional%2520photography&width=400&height=300&seq=1&orientation=landscape'
    },
    {
      id: 2,
      name: '创新创业讲座',
      date: '2025-05-15',
      location: '图书馆报告厅',
      status: 'completed',
      image: 'https://readdy.ai/api/search-image?query=A%2520professional%2520business%2520lecture%2520in%2520a%2520modern%2520university%2520auditorium%2520with%2520engaged%2520students%2520and%2520dynamic%2520speaker%2520warm%2520lighting%2520academic%2520atmosphere&width=400&height=300&seq=2&orientation=landscape'
    },
    {
      id: 3,
      name: '校园音乐节',
      date: '2025-05-10',
      location: '大学生活动中心',
      status: 'cancelled',
      image: 'https://readdy.ai/api/search-image?query=A%2520vibrant%2520university%2520music%2520festival%2520with%2520student%2520performances%2520modern%2520stage%2520setup%2520colorful%2520lighting%2520and%2520enthusiastic%2520audience%2520evening%2520atmosphere&width=400&height=300&seq=3&orientation=landscape'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button">
                    English
                  </button>
                  <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button">
                    简体中文
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">活动分类</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
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
                <a
                  key={item.id}
                  href="https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3"
                  data-readdy="true"
                  className="block"
                >
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      item.id === 'history' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">管理员</h3>
            <div className="space-y-2">
              {adminMenus.map(item => (
                <button
                  key={item.id}
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
                  className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-[1176px] mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">历史参与活动</h1>
            <p className="text-gray-500">查看您参与过的所有活动记录</p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <button
                  onClick={() => setSelectedDateRange(selectedDateRange === 'all' ? 'recent' : 'all')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className="fas fa-calendar-alt text-gray-400"></i>
                  <span>时间范围</span>
                  <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setSelectedStatus(selectedStatus === 'all' ? 'completed' : 'all')}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className="fas fa-filter text-gray-400"></i>
                  <span>活动状态</span>
                  <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                </button>
              </div>

              <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer whitespace-nowrap !rounded-button">
                <i className="fas fa-sync-alt mr-2"></i>
                重置筛选
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      activity.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-calendar-alt w-5"></i>
                      <span>{activity.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-map-marker-alt w-5"></i>
                      <span>{activity.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center text-sm text-purple-600 hover:text-purple-700 cursor-pointer whitespace-nowrap !rounded-button">
                      <i className="fas fa-images mr-2"></i>
                      查看照片
                    </button>
                    {activity.status === 'completed' && (
                      <button className="flex items-center text-sm text-purple-600 hover:text-purple-700 cursor-pointer whitespace-nowrap !rounded-button">
                        <i className="fas fa-star mr-2"></i>
                        评价活动
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
