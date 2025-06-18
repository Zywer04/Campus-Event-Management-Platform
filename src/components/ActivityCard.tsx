import React from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../types/activity';
import { STATUS_COLORS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types/activity';

interface ActivityCardProps {
  activity: Activity;
  showActions?: boolean;
  onRegister?: (activityId: number) => void;
  onLike?: (activityId: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  showActions = true, 
  onRegister, 
  onLike 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getRating = () => {
    if (activity.rating_count === 0) return 0;
    return (activity.rating_total / activity.rating_count).toFixed(1);
  };

  const getRegistrationProgress = () => {
    return (activity.registered / activity.capacity) * 100;
  };

  const isRegistrationOpen = activity.status === '报名中';
  const isFull = activity.registered >= activity.capacity;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
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
      <div className="p-6">
        {/* 标题 */}
        <Link to={`/activities/${activity.id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {activity.title}
          </h3>
        </Link>

        {/* 描述 */}
        {activity.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {activity.description}
          </p>
        )}

        {/* 基本信息 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-calendar-alt w-4 mr-2"></i>
            <span>{formatDate(activity.date_start)} - {formatDate(activity.date_end)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-clock w-4 mr-2"></i>
            <span>{formatTime(activity.time_start)} - {formatTime(activity.time_end)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
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
              className={`h-2 rounded-full transition-all duration-300 ${
                getRegistrationProgress() >= 100 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(getRegistrationProgress(), 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 评分 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400 mr-1"></i>
            <span className="text-sm text-gray-600">
              {getRating()} ({activity.rating_count} 人评价)
            </span>
          </div>
          
          {onLike && (
            <button
              onClick={() => onLike(activity.id)}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              title="点赞"
            >
              <i className="fas fa-heart"></i>
            </button>
          )}
        </div>

        {/* 操作按钮 */}
        {showActions && (
          <div className="flex space-x-2">
            <Link 
              to={`/activities/${activity.id}`}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              查看详情
            </Link>
            
            {isRegistrationOpen && !isFull && onRegister && (
              <button
                onClick={() => onRegister(activity.id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                立即报名
              </button>
            )}
            
            {isFull && (
              <span className="flex-1 bg-gray-300 text-gray-600 py-2 px-4 rounded-lg text-center">
                已满员
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard; 