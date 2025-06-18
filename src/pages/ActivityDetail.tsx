import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../utils/api';
import type { Activity } from '../types/activity';
import { STATUS_COLORS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types/activity';

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/get-all-activities`);
      const activities = response.data;
      const foundActivity = activities.find((a: Activity) => a.id === parseInt(id!));
      
      if (foundActivity) {
        setActivity(foundActivity);
      } else {
        setError('活动不存在');
      }
    } catch (err: any) {
      console.error('获取活动详情失败:', err);
      setError('获取活动详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistering(true);
      await api.post(`/api/register-activity/${id}`);
      // 刷新活动数据
      await fetchActivity();
      
      // 输出报名成功信息
      console.log('🔍 报名成功信息:', {
        activityId: id,
        activityTitle: activity?.title,
        userRole: user.role,
        username: user.username,
        timestamp: new Date().toLocaleString()
      });
      
      alert('报名成功！');
    } catch (err: any) {
      console.error('报名失败:', err);
      const message = err.response?.data?.detail || '报名失败，请重试';
      alert(message);
    } finally {
      setRegistering(false);
    }
  };

  const handleLike = async () => {
    try {
      setLiking(true);
      await api.post(`/api/update-likes/${id}`);
      // 刷新活动数据
      await fetchActivity();
    } catch (err: any) {
      console.error('点赞失败:', err);
      alert('点赞失败，请重试');
    } finally {
      setLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('zh-CN');
  };

  const getRating = () => {
    if (!activity || activity.rating_count === 0) return 0;
    return (activity.rating_total / activity.rating_count).toFixed(1);
  };

  const getRegistrationProgress = () => {
    if (!activity) return 0;
    return (activity.registered / activity.capacity) * 100;
  };

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

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">出错了</h2>
          <p className="text-gray-600 mb-4">{error || '活动不存在'}</p>
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

  const isRegistrationOpen = activity.status === '报名中';
  const isFull = activity.registered >= activity.capacity;
  const canRegister = user?.role === 'student' && isRegistrationOpen && !isFull;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              返回
            </button>
            <h1 className="text-lg font-semibold text-gray-900">活动详情</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2">
            {/* 活动图片 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-600">
                {activity.image_url ? (
                  <img 
                    src={activity.image_url} 
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className={`${CATEGORY_ICONS[activity.category as keyof typeof CATEGORY_ICONS]} text-white text-6xl`}></i>
                  </div>
                )}
                
                {/* 状态和分类标签 */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS]}`}>
                    {activity.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[activity.category as keyof typeof CATEGORY_COLORS]}`}>
                    {activity.category}
                  </span>
                </div>
              </div>
            </div>

            {/* 活动标题和描述 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{activity.title}</h1>
              
              {activity.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">活动简介</h3>
                  <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                </div>
              )}

              {activity.activity_summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">活动总结</h3>
                  <p className="text-gray-600 leading-relaxed">{activity.activity_summary}</p>
                </div>
              )}

              {activity.activity_goals && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">活动目标</h3>
                  <p className="text-gray-600 leading-relaxed">{activity.activity_goals}</p>
                </div>
              )}

              {activity.activity_process && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">活动流程</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{activity.activity_process}</p>
                </div>
              )}

              {activity.requirements && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">参与要求</h3>
                  <p className="text-gray-600 leading-relaxed">{activity.requirements}</p>
                </div>
              )}

              {activity.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">注意事项</h3>
                  <p className="text-gray-600 leading-relaxed">{activity.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            {/* 基本信息卡片 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt text-gray-400 w-5 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">活动时间</p>
                    <p className="text-gray-900">{formatDate(activity.date_start)} - {formatDate(activity.date_end)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <i className="fas fa-clock text-gray-400 w-5 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">具体时间</p>
                    <p className="text-gray-900">{formatTime(activity.time_start)} - {formatTime(activity.time_end)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-gray-400 w-5 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">活动地点</p>
                    <p className="text-gray-900">{activity.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <i className="fas fa-users text-gray-400 w-5 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">报名情况</p>
                    <p className="text-gray-900">{activity.registered}/{activity.capacity} 人</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <i className="fas fa-star text-gray-400 w-5 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">活动评分</p>
                    <p className="text-gray-900">{getRating()} ({activity.rating_count} 人评价)</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <i className="fas fa-calendar-times text-gray-400 w-5 mr-3"></i>
                  <div>
                    <p className="text-sm text-gray-600">报名截止</p>
                    <p className="text-gray-900">{formatDateTime(activity.registration_deadline)}</p>
                  </div>
                </div>

                {activity.organizer_contact && (
                  <div className="flex items-center">
                    <i className="fas fa-phone text-gray-400 w-5 mr-3"></i>
                    <div>
                      <p className="text-sm text-gray-600">联系方式</p>
                      <p className="text-gray-900">{activity.organizer_contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 报名进度卡片 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">报名进度</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>已报名</span>
                  <span>{activity.registered}/{activity.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      getRegistrationProgress() >= 100 ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(getRegistrationProgress(), 100)}%` }}
                  ></div>
                </div>
              </div>

              {isFull && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">活动已满员</p>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                {canRegister && (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {registering ? '报名中...' : '立即报名'}
                  </button>
                )}

                {!canRegister && user?.role === 'student' && (
                  <div className="text-center text-gray-600">
                    {!isRegistrationOpen && <p>活动暂未开放报名</p>}
                    {isFull && <p>活动已满员</p>}
                  </div>
                )}

                <button
                  onClick={handleLike}
                  disabled={liking}
                  className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {liking ? '点赞中...' : '点赞活动'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail; 