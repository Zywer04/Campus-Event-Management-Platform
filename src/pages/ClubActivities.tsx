// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getManagedActivities, updateActivity, deleteActivity } from '../utils/api';

const ClubActivities: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // 检查用户权限
  if (!user || user.role !== 'club') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">权限不足</h2>
          <p className="text-gray-600 mb-4">只有社团管理员可以查看社团活动</p>
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
    { id: '已驳回', label: '已拒绝' },
    { id: '已结束', label: '已结束' },
    { id: '未开始', label: '未开始' }
  ];

  // 状态对应的样式
  const statusStyles = {
    '审核中': 'bg-yellow-100 text-yellow-800',
    '报名中': 'bg-green-100 text-green-800',
    '已驳回': 'bg-red-100 text-red-800',
    '已结束': 'bg-gray-100 text-gray-800',
    '未开始': 'bg-blue-100 text-blue-800'
  };

  // 状态管理
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // 获取社团管理的活动列表
  const fetchManagedActivities = async () => {
    try {
      setLoading(true);
      const managedActivities = await getManagedActivities();
      setActivities(managedActivities);
    } catch (error) {
      console.error('获取社团活动失败:', error);
      alert('获取社团活动失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchManagedActivities();
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
        setShowEditModal(false);
        setShowDeleteModal(false);
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
    setShowDetailModal(true);
  };

  // 打开编辑模态框
  const handleEditClick = (activity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setEditForm({
      title: activity.title,
      category: activity.category,
      date_start: activity.date_start.split('T')[0],
      date_end: activity.date_end.split('T')[0],
      time_start: activity.time_start,
      time_end: activity.time_end,
      location: activity.location,
      capacity: activity.capacity,
      image_url: activity.image_url || '',
      description: activity.description || '',
      organizer_contact: activity.organizer_contact || '',
      requirements: activity.requirements || '',
      registration_deadline: activity.registration_deadline.split('T')[0] + 'T' + activity.registration_deadline.split('T')[1].substring(0, 5),
      activity_summary: activity.activity_summary || '',
      activity_goals: activity.activity_goals || '',
      activity_process: activity.activity_process || '',
      notes: activity.notes || ''
    });
    setShowEditModal(true);
  };

  // 打开删除确认模态框
  const handleDeleteClick = (activity: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedActivity(activity);
    setShowDeleteModal(true);
  };

  // 处理编辑表单提交
  const handleEditSubmit = async () => {
    if (!selectedActivity) return;
    
    try {
      await updateActivity(selectedActivity.id, editForm);
      alert('活动更新成功！');
      setShowEditModal(false);
      fetchManagedActivities(); // 重新获取数据
    } catch (error) {
      console.error('更新活动失败:', error);
      alert('更新活动失败，请重试');
    }
  };

  // 处理删除确认
  const handleDeleteConfirm = async () => {
    if (!selectedActivity) return;
    
    try {
      await deleteActivity(selectedActivity.id);
      alert('活动删除成功！');
      setShowDeleteModal(false);
      fetchManagedActivities(); // 重新获取数据
    } catch (error) {
      console.error('删除活动失败:', error);
      alert('删除活动失败，请重试');
    }
  };

  // 过滤活动列表
  const filteredActivities = activities.filter(activity => {
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <i className="fas fa-university text-blue-600 text-xl"></i>
              <span className="text-xl font-bold text-gray-900">校园活动管理系统</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => handleNavigation('/')}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                首页
              </button>
              <button
                onClick={() => handleNavigation('/ClubActivities')}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/ClubActivities' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                社团活动
              </button>
              <button
                onClick={() => handleNavigation('/club-apply')}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/club-apply' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                申报活动
              </button>
              <button
                onClick={() => handleNavigation('/club-stats')}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/club-stats' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                数据统计
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-user-circle text-gray-600"></i>
              <span className="text-sm text-gray-700">{user?.name || user?.username}</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="pt-20 pb-8">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">社团活动管理</h1>
            <p className="mt-2 text-gray-600">查看和管理您申报的所有活动</p>
          </div>

          {/* 筛选和搜索 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                {/* 状态筛选 */}
                <div className="relative">
                  <button
                    id="statusButton"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {statusOptions.find(option => option.id === selectedStatus)?.label || '全部'}
                    </span>
                    <i className="fas fa-chevron-down text-xs text-gray-500"></i>
                  </button>
                  
                  {showStatusDropdown && (
                    <div
                      id="statusDropdown"
                      className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                    >
                      {statusOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => handleStatusSelect(option.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 搜索框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索活动标题..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* 活动列表 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <i className="fas fa-spinner fa-spin text-blue-600 text-2xl mb-4"></i>
                <p className="text-gray-600">加载中...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="p-8 text-center">
                <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
                <p className="text-gray-600">暂无活动数据</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        活动信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        申报时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        活动时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        容量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        onClick={() => handleActivityClick(activity)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                            <div className="text-sm text-gray-500">{activity.category}</div>
                            <div className="text-sm text-gray-500">{activity.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(activity.apply_time).toLocaleString('zh-CN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>{new Date(activity.date_start).toLocaleDateString('zh-CN')}</div>
                          <div>{activity.time_start} - {activity.time_end}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {activity.registered}/{activity.capacity}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            statusStyles[activity.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status === '审核中' ? '待审核' :
                             activity.status === '报名中' ? '已通过' :
                             activity.status === '已驳回' ? '已拒绝' : activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleEditClick(activity, e)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap mr-2"
                          >
                            编辑
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(activity, e)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 活动详情模态框 */}
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">活动详情</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="关闭详情模态框"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动标题</h3>
                  <p className="text-gray-900">{selectedActivity.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">活动分类</h3>
                    <p className="text-gray-900">{selectedActivity.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">活动状态</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      statusStyles[selectedActivity.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedActivity.status === '审核中' ? '待审核' :
                       selectedActivity.status === '报名中' ? '已通过' :
                       selectedActivity.status === '已驳回' ? '已拒绝' : selectedActivity.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">活动地点</h3>
                    <p className="text-gray-900">{selectedActivity.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">活动容量</h3>
                    <p className="text-gray-900">{selectedActivity.registered}/{selectedActivity.capacity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">开始时间</h3>
                    <p className="text-gray-900">
                      {new Date(selectedActivity.date_start).toLocaleDateString('zh-CN')} {selectedActivity.time_start}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">结束时间</h3>
                    <p className="text-gray-900">
                      {new Date(selectedActivity.date_end).toLocaleDateString('zh-CN')} {selectedActivity.time_end}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动描述</h3>
                  <p className="text-gray-900">{selectedActivity.description || '暂无描述'}</p>
                </div>

                {selectedActivity.requirements && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">参与要求</h3>
                    <p className="text-gray-900">{selectedActivity.requirements}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">申报时间</h3>
                    <p className="text-gray-900">{new Date(selectedActivity.apply_time).toLocaleString('zh-CN')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">报名截止</h3>
                    <p className="text-gray-900">{new Date(selectedActivity.registration_deadline).toLocaleString('zh-CN')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑模态框 */}
      {showEditModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">编辑活动</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="关闭编辑模态框"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动标题</h3>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入活动标题"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动分类</h3>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入活动分类"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动地点</h3>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入活动地点"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动容量</h3>
                  <input
                    type="number"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入活动容量"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">开始时间</h3>
                  <input
                    type="date"
                    value={editForm.date_start}
                    onChange={(e) => setEditForm({ ...editForm, date_start: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="选择活动开始日期"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">结束时间</h3>
                  <input
                    type="date"
                    value={editForm.date_end}
                    onChange={(e) => setEditForm({ ...editForm, date_end: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="选择活动结束日期"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">活动描述</h3>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入活动描述"
                    rows={3}
                  ></textarea>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">参与要求</h3>
                  <textarea
                    value={editForm.requirements}
                    onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入参与要求"
                    rows={3}
                  ></textarea>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">报名截止</h3>
                  <input
                    type="datetime-local"
                    value={editForm.registration_deadline}
                    onChange={(e) => setEditForm({ ...editForm, registration_deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="选择报名截止时间"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleEditSubmit}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">确认删除活动</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="关闭删除模态框"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <p className="text-gray-900">确定要删除活动 "{selectedActivity.title}"?</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubActivities;