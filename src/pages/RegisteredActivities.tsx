// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import * as echarts from 'echarts';

const RegisteredActivities: React.FC = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const activities = [
    {
      id: '1',
      title: '校园马拉松比赛',
      status: 'success',
      time: '2025-06-15 08:00',
      location: '校园体育场',
      image: 'https://readdy.ai/api/search-image?query=A%2520dynamic%2520university%2520marathon%2520event%2520with%2520students%2520running%2520through%2520a%2520beautiful%2520campus%2520setting%2520modern%2520buildings%2520and%2520green%2520spaces%2520in%2520background%2520professional%2520photography&width=400&height=250&seq=1&orientation=landscape'
    },
    {
      id: '2',
      title: '创新创业大赛',
      status: 'pending',
      time: '2025-06-20 14:00',
      location: '创新创业中心',
      image: 'https://readdy.ai/api/search-image?query=Students%2520presenting%2520innovative%2520projects%2520in%2520a%2520modern%2520conference%2520room%2520with%2520professional%2520setup%2520and%2520technology%2520displays%2520engaging%2520atmosphere&width=400&height=250&seq=2&orientation=landscape'
    },
    {
      id: '3',
      title: '毕业晚会',
      status: 'ended',
      time: '2025-06-10 19:00',
      location: '大学生活动中心',
      image: 'https://readdy.ai/api/search-image?query=Graduation%2520ceremony%2520celebration%2520in%2520a%2520grand%2520university%2520hall%2520with%2520elegant%2520decorations%2520and%2520lighting%2520setup%2520formal%2520event%2520atmosphere&width=400&height=250&seq=3&orientation=landscape'
    },
    {
      id: '4',
      title: '学术讲座系列',
      status: 'success',
      time: '2025-06-25 15:00',
      location: '图书馆报告厅',
      image: 'https://readdy.ai/api/search-image?query=Academic%2520lecture%2520in%2520modern%2520university%2520auditorium%2520with%2520professional%2520presentation%2520setup%2520and%2520engaged%2520student%2520audience%2520learning%2520atmosphere&width=400&height=250&seq=4&orientation=landscape'
    }
  ];

  const statusColors = {
    success: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    ended: 'bg-gray-100 text-gray-800'
  };

  const statusText = {
    success: '报名成功',
    pending: '待审核',
    ended: '已结束'
  };

  const handleCancelRegistration = (activityId: string) => {
    setSelectedActivityId(activityId);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    setSelectedActivityId(null);
  };

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
      <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">我的活动</h3>
            <div className="space-y-2">
              <a
                href="https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3"
                data-readdy="true"
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 text-left transition-colors cursor-pointer"
              >
                <i className="fas fa-calendar-check"></i>
                <span>已报名活动</span>
              </a>
              <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                <i className="fas fa-history"></i>
                <span>历史参与</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-[1176px] mx-auto px-6 py-8">
          {/* 顶部操作区 */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">已报名活动（{activities.length}）</h2>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 ${viewMode === 'list' ? 'text-purple-600' : 'text-gray-600'} cursor-pointer whitespace-nowrap !rounded-button`}
                >
                  <i className="fas fa-list-ul"></i>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 ${viewMode === 'calendar' ? 'text-purple-600' : 'text-gray-600'} cursor-pointer whitespace-nowrap !rounded-button`}
                >
                  <i className="fas fa-calendar-alt"></i>
                </button>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 cursor-pointer focus:outline-none focus:border-purple-500"
              >
                <option value="all">全部状态</option>
                <option value="success">报名成功</option>
                <option value="pending">待审核</option>
                <option value="ended">已结束</option>
              </select>
            </div>
          </div>

          {/* 活动列表 */}
          <div className="grid grid-cols-2 gap-6">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[activity.status as keyof typeof statusColors]}`}>
                      {statusText[activity.status as keyof typeof statusText]}
                    </span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-clock w-5"></i>
                      <span>{activity.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-map-marker-alt w-5"></i>
                      <span>{activity.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelRegistration(activity.id)}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    取消报名
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 取消报名确认弹窗 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-2">确认取消报名</h3>
            <p className="text-gray-600 mb-6">是否确认取消报名该活动？取消后需要重新报名。</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer whitespace-nowrap !rounded-button"
              >
                取消
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer whitespace-nowrap !rounded-button"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredActivities;

