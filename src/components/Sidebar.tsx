import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { id: 1, name: '全部活动', icon: 'fa-calendar-check' },
    { id: 2, name: '学术讲座', icon: 'fa-chalkboard-teacher' },
    { id: 3, name: '文体活动', icon: 'fa-music' },
    { id: 4, name: '志愿服务', icon: 'fa-hands-helping' },
    { id: 5, name: '职业发展', icon: 'fa-briefcase' },
    { id: 6, name: '兴趣培养', icon: 'fa-palette' }
  ];

  const myActivities = [
    { id: 'registered', name: '已报名活动', icon: 'fa-calendar-check' },
    { id: 'history', name: '历史参与', icon: 'fa-history' },
  ];

  const adminMenus = [
    { id: 'publish', name: '发布活动', icon: 'fa-plus-circle' },
    { id: 'manage', name: '活动管理', icon: 'fa-tasks' },
    { id: 'stats', name: '数据统计', icon: 'fa-chart-bar' },
    { id: 'audit', name: '审核活动', icon: 'fa-clipboard-check' },
  ];

  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line' },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature' },
  ];

  const handleNavigation = (id: string | number) => {
    if (typeof id === 'string') {
      const pathMap: Record<string, string> = {
        registered: '/registered',
        history: '/activities/history',
        publish: '/publish',
        manage: '/ActivityManage',
        stats: '/Stats',
        audit: '/audit',
        clubActivities: '/ClubActivities',
        clubStats: '/ClubStats',
        clubApply: '/ClubApply',
      };
      const path = pathMap[id];
      if (path) navigate(path);
    } else {
      navigate(`/?category=${id}`);
    }
  };

  const isCategoryActive = (id: number) => {
    if (id === 1) return location.pathname === '/' && !location.search;
    return location.pathname === '/' && location.search === `?category=${id}`;
  };

  const isMenuActive = (id: string) => {
    const pathMap: Record<string, string> = {
      registered: '/registered',
      history: '/activities/history',
      publish: '/publish',
      manage: '/ActivityManage',
      stats: '/Stats',
      audit: '/audit',
      clubActivities: '/ClubActivities',
      clubStats: '/ClubStats',
      clubApply: '/ClubApply',
    };
    return location.pathname === pathMap[id];
  };

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* 活动分类 */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">活动分类</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleNavigation(category.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap ${
                  isCategoryActive(category.id)
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

        {/* 我的活动 */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">我的活动</h3>
          <div className="space-y-2">
            {myActivities.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isMenuActive(item.id)
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

        {/* 管理员功能 */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">管理员功能</h3>
          <div className="space-y-2">
            {adminMenus.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isMenuActive(item.id)
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

        {/* 社团功能 */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团功能</h3>
          <div className="space-y-2">
            {clubMenus.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isMenuActive(item.id)
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
  );
};

export default Sidebar;
