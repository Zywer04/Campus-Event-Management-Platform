// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useActivityContext } from '../contexts/ActivityContext';
import ActivityCard from '../components/ActivityCard';
import type { Activity } from '../types/activity';
import api from '../utils/api';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const keyword = searchParams.get('keyword');
  const navigate = useNavigate();
  const { user } = useUser();
  const { activities, loading, error, refreshActivities } = useActivityContext();
  
  // 输出当前用户身份信息
  useEffect(() => {
    console.log('🔍 主页当前用户身份:', {
      user: user,
      isAuthenticated: !!user,
      timestamp: new Date().toLocaleString()
    });
  }, [user]);
  
  const [selectedCategory, setSelectedCategory] = useState(categoryId ? parseInt(categoryId) : 1);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchKeyword, setSearchKeyword] = useState(keyword || '');

  // 当活动数据或筛选条件变化时，重新过滤
  useEffect(() => {
    let filtered = [...activities];

    // 按分类筛选
    if (selectedCategory !== 1) {
      const categories = ['学术讲座', '文体活动', '志愿服务', '职业发展', '兴趣培养'];
      const categoryName = categories[selectedCategory - 2]; // 减2是因为第一个是"全部"
      filtered = filtered.filter(activity => activity.category === categoryName);
    }

    // 按关键词搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(keyword) ||
        activity.description?.toLowerCase().includes(keyword) ||
        activity.location.toLowerCase().includes(keyword)
      );
    }

    setFilteredActivities(filtered);
  }, [activities, selectedCategory, searchKeyword]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    // 更新URL参数
    if (categoryId === 1) {
      navigate('/');
    } else {
      navigate(`/?category=${categoryId}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 更新URL参数
    if (searchKeyword.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleRegister = async (activityId: number) => {
    try {
      // 调用真实的报名API
      await api.post(`/api/register-activity/${activityId}`);
      
      // 输出报名成功信息
      console.log('🔍 主页报名成功信息:', {
        activityId: activityId,
        userRole: user?.role,
        username: user?.username,
        timestamp: new Date().toLocaleString()
      });
      
      // 报名成功后刷新活动列表
      await refreshActivities();
      alert('报名成功！');
    } catch (error: any) {
      console.error('报名失败:', error);
      const message = error.response?.data?.detail || '报名失败，请重试';
      alert(message);
    }
  };

  const handleLike = async (activityId: number) => {
    try {
      // 这里可以调用点赞API
      console.log('点赞活动:', activityId);
      // 点赞成功后刷新活动列表
      await refreshActivities();
    } catch (error) {
      console.error('点赞失败:', error);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshActivities}
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
      {/* 搜索和筛选区域 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex max-w-md">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索活动..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                title="搜索活动"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 1, name: '全部活动', icon: 'fa-list-ul' },
              { id: 2, name: '学术讲座', icon: 'fa-chalkboard-teacher' },
              { id: 3, name: '文体活动', icon: 'fa-running' },
              { id: 4, name: '志愿服务', icon: 'fa-hands-helping' },
              { id: 5, name: '职业发展', icon: 'fa-briefcase' },
              { id: 6, name: '兴趣培养', icon: 'fa-heart' }
            ].map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className={`fas ${category.icon}`}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 活动列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计概览 */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar text-blue-600"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总活动数</p>
                  <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-green-600"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">总报名数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activities.reduce((sum: number, activity: Activity) => sum + activity.registered, 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-purple-600"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">平均评分</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activities.length > 0 
                      ? (activities.reduce((sum: number, activity: Activity) => sum + activity.rating_total, 0) / 
                         activities.reduce((sum: number, activity: Activity) => sum + activity.rating_count, 1)).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchKeyword ? `搜索"${searchKeyword}"的结果` : '所有活动'}
          </h2>
          <p className="text-gray-600 mt-1">
            共找到 {filteredActivities.length} 个活动
          </p>
        </div>

        {/* 活动网格 */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onRegister={handleRegister}
                onLike={handleLike}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-search text-gray-400 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关活动</h3>
            <p className="text-gray-600">尝试调整搜索条件或分类筛选</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
