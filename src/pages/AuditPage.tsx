// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect} from 'react';
import * as echarts from 'echarts';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getPendingActivities, updateActivityStatus } from '../utils/api';

const AuditPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // 检查用户权限
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">权限不足</h2>
          <p className="text-gray-600 mb-4">只有系统管理员可以审核活动</p>
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

  // 活动状态筛选选项
  const statusOptions = [
    { id: 'all', label: '全部' },
    { id: '审核中', label: '待审核' },
    { id: '报名中', label: '已通过' },
    { id: '已驳回', label: '已拒绝' }
  ];

  // 状态对应的样式
  const statusStyles = {
    '审核中': 'bg-yellow-100 text-yellow-800',
    '报名中': 'bg-green-100 text-green-800',
    '已驳回': 'bg-red-100 text-red-800',
    '已结束': 'bg-gray-100 text-gray-800',
    '未开始': 'bg-blue-100 text-blue-800'
  };

  // 活动类型


  // 状态管理
  const [selectedStatus, setSelectedStatus] = useState('审核中'); // 默认显示待审核活动
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取待审核活动列表
  const fetchPendingActivities = async () => {
    try {
      setLoading(true);
      const pendingActivities = await getPendingActivities();
      setActivities(pendingActivities);
      console.log('获取到的待审核活动:', pendingActivities); // 添加调试日志
    } catch (error) {
      console.error('获取待审核活动失败:', error);
      alert('获取待审核活动失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchPendingActivities();
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const statusDropdown = document.getElementById('statusDropdown');
      const statusButton = document.getElementById('statusButton');

      if (statusDropdown && statusButton &&
          !statusDropdown.contains(event.target as Node) &&
          !statusButton.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC键关闭模态框
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDetailModal(false);
        setShowConfirmModal(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  // 处理状态筛选
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setShowStatusDropdown(false);
  };

  // 打开活动详情
  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    setReviewComment('');
    setShowDetailModal(true);
  };

  // 处理审核操作
  const handleReviewAction = (action: 'approve' | 'reject') => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  // 确认审核操作
  const confirmReviewAction = async () => {
    if (selectedActivity && confirmAction) {
      try {
        const newStatus = confirmAction === 'approve' ? '报名中' : '已驳回';
        await updateActivityStatus(selectedActivity.id, newStatus);
        
        // 更新本地状态
        setActivities(activities.map(activity =>
          activity.id === selectedActivity.id
            ? {...activity, status: newStatus}
            : activity
        ));
        
        setShowConfirmModal(false);
        setShowDetailModal(false);
        alert(`活动${confirmAction === 'approve' ? '审核通过' : '已驳回'}成功！`);
        
        // 重新获取活动列表
        fetchPendingActivities();
      } catch (error) {
        console.error('审核操作失败:', error);
        alert('审核操作失败，请重试');
      }
    }
  };

  // 过滤活动列表 - 由于getPendingActivities只返回审核中的活动，这里不需要再按状态筛选
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (activity.club_username && activity.club_username.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
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
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-list-ul"></i>
                <span>全部活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/?category=2')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-chalkboard-teacher"></i>
                <span>学术讲座</span>
              </button>
              <button 
                onClick={() => handleNavigation('/?category=3')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
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
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-calendar-check"></i>
                <span>已报名活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/activities/history')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
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
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-plus-circle"></i>
                <span>发布活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/ActivityManage')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-tasks"></i>
                <span>活动管理</span>
              </button>
              <button 
                onClick={() => handleNavigation('/AuditPage')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-50 text-purple-600 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-clipboard-check"></i>
                <span>审核活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/Stats')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
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
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-users-cog"></i>
                <span>管理社团活动</span>
              </button>
              <button 
                onClick={() => handleNavigation('/ClubStats')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-chart-line"></i>
                <span>社团活动数据</span>
              </button>
              <button 
                onClick={() => handleNavigation('/ClubApply')}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
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
          {/* 页面标题 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">活动审核</h1>
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center text-gray-600 hover:text-purple-600 cursor-pointer"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              <span>返回</span>
            </button>
          </div>

          {/* 筛选区域 */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div className="relative">
                <button
                  id="statusButton"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border ${showStatusDropdown ? 'border-purple-500' : 'border-gray-200'} text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button`}
                >
                  <i className="fas fa-filter text-gray-400 mr-2"></i>
                  <span>{statusOptions.find(option => option.id === selectedStatus)?.label || '活动状态'}</span>
                  <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${showStatusDropdown ? 'transform rotate-180' : ''}`}></i>
                </button>
                {showStatusDropdown && (
                  <div
                    id="statusDropdown"
                    className="absolute top-full left-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    {statusOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleStatusSelect(option.id)}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          selectedStatus === option.id
                            ? 'text-purple-600 bg-purple-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        } transition-colors whitespace-nowrap !rounded-button`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="搜索活动名称或社团..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* 活动列表 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">活动名称</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">申请社团</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">申请时间</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">活动类型</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">状态</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleActivityClick(activity)}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{activity.club}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{activity.applyTime}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {activity.category}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusStyles[activity.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status === '审核中' ? '待审核' :
                             activity.status === '报名中' ? '已通过' :
                             activity.status === '已驳回' ? '已拒绝' : '未知'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          {activity.status === '审核中' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedActivity(activity);
                                  handleReviewAction('approve');
                                }}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                              >
                                通过
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedActivity(activity);
                                  handleReviewAction('reject');
                                }}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                              >
                                拒绝
                              </button>
                            </div>
                          )}
                          {activity.status !== '审核中' && (
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                              查看详情
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        没有找到符合条件的活动
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredActivities.length}</span> 条，共 <span className="font-medium">{filteredActivities.length}</span> 条
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap !rounded-button">
                  上一页
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap !rounded-button">
                  下一页
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 活动详情弹窗 */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">活动详情</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动名称</h3>
                  <p className="text-gray-900">{selectedActivity.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">申请社团</h3>
                  <p className="text-gray-900">{selectedActivity.club}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动类型</h3>
                  <p className="text-gray-900">{selectedActivity.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">申请时间</h3>
                  <p className="text-gray-900">{selectedActivity.applyTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动地点</h3>
                  <p className="text-gray-900">{selectedActivity.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动状态</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusStyles[selectedActivity.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedActivity.status === '审核中' ? '待审核' :
                     selectedActivity.status === '报名中' ? '已通过' :
                     selectedActivity.status === '已驳回' ? '已拒绝' : '未知'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动时间</h3>
                  <p className="text-gray-900">{selectedActivity.startTime} - {selectedActivity.endTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">参与人数限制</h3>
                  <p className="text-gray-900">{selectedActivity.capacity} 人</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">活动描述</h3>
                <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
                  {selectedActivity.description}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">参与要求</h3>
                <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
                  {selectedActivity.requirements}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动负责人</h3>
                  <p className="text-gray-900">{selectedActivity.organizer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">联系方式</h3>
                  <p className="text-gray-900">{selectedActivity.contact}</p>
                </div>
              </div>

              {selectedActivity.status === '审核中' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">审核意见</h3>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="请输入审核意见..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  ></textarea>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleReviewAction('reject')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      拒绝
                    </button>
                    <button
                      onClick={() => handleReviewAction('approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      通过
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 确认弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="text-center mb-6">
              <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${
                confirmAction === 'approve' ? 'bg-green-100' : 'bg-red-100'
              } mb-4`}>
                <i className={`fas ${confirmAction === 'approve' ? 'fa-check' : 'fa-times'} text-xl ${
                  confirmAction === 'approve' ? 'text-green-600' : 'text-red-600'
                }`}></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                确认{confirmAction === 'approve' ? '通过' : '拒绝'}此活动申请？
              </h3>
              <p className="text-gray-500">
                {confirmAction === 'approve'
                  ? '通过后，该活动将被允许举办。'
                  : '拒绝后，该活动将无法举办，请确认您的决定。'}
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                取消
              </button>
              <button
                onClick={confirmReviewAction}
                className={`px-4 py-2 ${
                  confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                } text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button`}
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

export default AuditPage;
