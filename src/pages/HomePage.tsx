// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';


const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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

  const navigate = useNavigate();

  const handleMyActivityClick = (id: string) => {
    if (id === 'registered') {
      navigate('/registered');
    } else if (id === 'history') {
      navigate('/activities/history');
    }else if(id === 'publish'){
      navigate('/publish');
    }else if(id ==='manage'){
      navigate('/ActivityManage');
    }else if(id === 'stats'){
      navigate('/Stats');
    }else if(id === 'clubActivities'){
      navigate('/ClubActivities');
    }else if(id === 'clubStats'){
      navigate('/ClubStats');
    }else if(id === 'clubApply'){
      navigate('/ClubApply');
    }

  };

  const handleRegisterClick = () => {
  navigate("/register"); // 跳转到报名页面
};

  const handleLogin = () => {
    navigate("/login"); // 跳转到登录页
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
             {/* 登录按钮 */}
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            登录
          </button>
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
                <button
                  key={item.id}
                  onClick={() => handleMyActivityClick(item.id)}
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
                  onClick={() => handleMyActivityClick(item.id)}
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
                  onClick={() => handleMyActivityClick(item.id)}
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

      {/* 主内容区 */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-[1176px] mx-auto px-6 py-8">
          {/* Banner轮播 */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={true}
              className="h-[400px]"
            >
              <SwiperSlide>
                <div className="relative h-full">
                  <img
                    src="https://readdy.ai/api/search-image?query=A%20vibrant%20and%20energetic%20scene%20of%20university%20students%20participating%20in%20a%20marathon%20event%20on%20a%20beautiful%20campus%20with%20modern%20architecture%20and%20green%20spaces%2C%20captured%20in%20a%20cinematic%20wide%20shot%20with%20natural%20lighting&width=1176&height=400&seq=1&orientation=landscape"
                    className="w-full h-full object-cover"
                    alt="校园马拉松"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent flex items-center">
                    <div className="px-12">
                      <h1 className="text-4xl font-bold text-white mb-4">
                        校园马拉松 - 奔跑的青春最美丽
                      </h1>
                      <p className="text-xl text-white/90 mb-8">
                        5 公里校园跑即将开始
                      </p>
                      <button
                      onClick={handleRegisterClick}
                      className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                        立即报名
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* 筛选条件 */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">
                <i className="fas fa-calendar-alt text-gray-400"></i>
                <span>活动时间</span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">
                <i className="fas fa-tag text-gray-400"></i>
                <span>活动状态</span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">
                <i className="fas fa-map-marker-alt text-gray-400"></i>
                <span>活动地点</span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>
            </div>
          </div>

          {/* 活动列表 */}
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={`https://readdy.ai/api/search-image?query=Students%20participating%20in%20various%20campus%20activities%20including%20academic%20lectures%2C%20art%20performances%2C%20and%20outdoor%20events%2C%20showing%20a%20vibrant%20university%20life%20with%20modern%20facilities&width=400&height=225&seq=${item}&orientation=landscape`}
                    className="w-full h-full object-cover"
                    alt="活动图片"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">校园文化节专场演出</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-calendar-alt w-5"></i>
                      <span>2025-06-15 14:00</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="fas fa-map-marker-alt w-5"></i>
                      <span>大学生活动中心</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600">
                      报名进行中
                    </span>
                    <button
                    onClick={handleRegisterClick}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                      立即报名
                    </button>
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

export default HomePage;
