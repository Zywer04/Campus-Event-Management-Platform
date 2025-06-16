import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    // 根据当前路径设置页面状态
    const path = location.pathname;
    if (path === '/') {
      // 检查是否有搜索关键词
      const searchParams = new URLSearchParams(location.search);
      const keyword = searchParams.get('keyword');
      if (keyword) {
        setCurrentPage('search');
      } else {
        setCurrentPage('home');
      }
    } else if (path.startsWith('/activity/')) {
      setCurrentPage('activity');
    } else if (path === '/ActivityManage') {
      setCurrentPage('manage');
    } else if (path === '/AuditPage') {
      setCurrentPage('audit');
    } else if (path === '/ClubActivities') {
      setCurrentPage('clubActivities');
    } else if (path === '/ClubApply') {
      setCurrentPage('clubApply');
    } else if (path === '/ClubStats') {
      setCurrentPage('clubStats');
    } else if (path === '/Stats') {
      setCurrentPage('stats');
    } else if (path === '/publish') {
      setCurrentPage('publish');
    } else if (path === '/activities/history') {
      setCurrentPage('history');
    } else if (path === '/registered') {
      setCurrentPage('registered');
    } else if (path === '/register') {
      setCurrentPage('register');
    } else if (path === '/login') {
      setCurrentPage('login');
    }
  }, [location.pathname, location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 如果当前不在主页，先跳转到主页
    if (location.pathname !== '/') {
      navigate('/');
    }
    // 如果搜索关键词为空，清除搜索参数
    if (!searchQuery.trim()) {
      navigate('/');
    } else {
      // 使用 URL 参数来传递搜索关键词
      navigate(`/?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLanguageChange = (lang: string) => {
    // TODO: 实现语言切换逻辑
    setShowLanguageDropdown(false);
  };

  const handleLogin = () => {
    if (isLoggedIn) {
      // TODO: 实现登出逻辑
      setIsLoggedIn(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return '校园活动管理平台';
      case 'activity':
        return '活动详情';
      case 'manage':
        return '活动管理';
      case 'audit':
        return '活动审核';
      case 'clubActivities':
        return '社团活动管理';
      case 'clubApply':
        return '社团申请';
      case 'clubStats':
        return '社团统计';
      case 'stats':
        return '数据统计';
      case 'publish':
        return '发布活动';
      case 'history':
        return '历史记录';
      case 'registered':
        return '已报名活动';
      case 'register':
        return '活动报名';
      case 'login':
        return '用户登录';
      case 'search':
        return '搜索结果';
      default:
        return '校园活动管理平台';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <i className="fas fa-university text-purple-600 text-2xl"></i>
            <span className="text-lg font-semibold">{getPageTitle()}</span>
          </div>

          <div className="flex items-center space-x-6">
            {currentPage !== 'login' && (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="搜索活动..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 pl-10 pr-4 text-sm border-none rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                  aria-label="搜索"
                >
                  <i className="fas fa-search"></i>
                </button>
              </form>
            )}

            {currentPage !== 'login' && (
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
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('zh')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    >
                      简体中文
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isLoggedIn ? '退出' : '登录'}
            </button>
          </div>
        </div>
      </nav>

      {/* 侧边栏 */}
      {currentPage !== 'login' && <Sidebar />}

      {/* 主要内容 */}
      <main className={`${currentPage !== 'login' ? 'ml-64' : ''} pt-16 min-h-screen`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 