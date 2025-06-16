import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({ id: 'all', name: '全部时间' });
  // Add fade animations
  const style = document.createElement('style');
  style.textContent = `
  @keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
  }
  .animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
  }
  .animate-fade-out {
  animation: fadeOut 0.3s ease-out forwards;
  }
  `;
  document.head.appendChild(style);
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  const dateRangeOptions = [
    { id: 'all', name: '全部时间' },
    { id: 'week', name: '最近一周' },
    { id: 'month', name: '最近一个月' },
    { id: 'three_months', name: '最近三个月' },
    { id: 'half_year', name: '最近半年' }
  ];
  const [selectedStatus, setSelectedStatus] = useState({ id: 'all', name: '全部' });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const statusOptions = [
    { id: 'all', name: '全部' },
    { id: 'completed', name: '已完成' },
    { id: 'cancelled', name: '已取消' }
  ];
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [satisfaction, setSatisfaction] = useState('very_satisfied');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratedActivities, setRatedActivities] = useState<number[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleRating = (activity: any) => {
    setCurrentActivity(activity);
    setShowRatingDialog(true);
    setRating(5);
    setComment('');
    setSatisfaction('very_satisfied');
  };

  const handleSubmitRating = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to backend
    setTimeout(() => {
      // Update rated activities list
      if (currentActivity) {
        setRatedActivities(prev => [...prev, currentActivity.id]);
      }
      
      setShowRatingDialog(false);
      setIsSubmitting(false);
      
      // Create and show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg z-[100] animate-fade-in';
      toast.innerHTML = `
        <div class="flex items-center p-4">
          <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check text-purple-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-900">评价提交成功</p>
            <p class="text-sm text-gray-500">感谢您的反馈！</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 800);
  };

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
    { id: 'audit', name: '活动审核', icon: 'fa-clipboard-check' }
  ];

  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line' },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature' },
  ];

  const historyActivities = [
    {
      id: 1,
      title: '校园马拉松大赛',
      date: '2025-05-20',
      location: '校园体育场',
      status: 'completed',
      image: 'https://readdy.ai/api/search-image?query=A%2520dynamic%2520university%2520marathon%2520event%2520with%2520students%2520running%2520through%2520a%2520beautiful%2520campus%2520setting%2520modern%2520architecture%2520and%2520natural%2520landscape%2520professional%2520photography&width=400&height=300&seq=1&orientation=landscape',
      photos: [
        'https://readdy.ai/api/search-image?query=Energetic%2520university%2520students%2520participating%2520in%2520campus%2520marathon%2520race%2520professional%2520sports%2520photography%2520with%2520natural%2520lighting%2520and%2520dynamic%2520composition&width=800&height=600&seq=4&orientation=landscape',
        'https://readdy.ai/api/search-image?query=Students%2520crossing%2520finish%2520line%2520at%2520university%2520marathon%2520event%2520celebration%2520moment%2520with%2520crowd%2520cheering%2520professional%2520sports%2520photography&width=800&height=600&seq=5&orientation=landscape',
        'https://readdy.ai/api/search-image?query=Campus%2520marathon%2520award%2520ceremony%2520with%2520winners%2520on%2520podium%2520professional%2520event%2520photography%2520with%2520trophy%2520presentation&width=800&height=600&seq=6&orientation=landscape',
        'https://readdy.ai/api/search-image?query=University%2520marathon%2520participants%2520preparing%2520before%2520race%2520morning%2520atmosphere%2520professional%2520sports%2520photography&width=800&height=600&seq=7&orientation=landscape'
      ]
    },
    {
      id: 2,
      title: '创新创业讲座',
      date: '2025-05-15',
      location: '图书馆报告厅',
      status: 'completed',
      image: 'https://readdy.ai/api/search-image?query=A%2520professional%2520business%2520lecture%2520in%2520a%2520modern%2520university%2520auditorium%2520with%2520engaged%2520students%2520and%2520dynamic%2520speaker%2520warm%2520lighting%2520academic%2520atmosphere&width=400&height=300&seq=2&orientation=landscape'
    },
    {
      id: 3,
      title: '校园音乐节',
      date: '2025-05-10',
      location: '大学生活动中心',
      status: 'cancelled',
      image: 'https://readdy.ai/api/search-image?query=A%2520vibrant%2520university%2520music%2520festival%2520with%2520student%2520performances%2520modern%2520stage%2520setup%2520colorful%2520lighting%2520and%2520enthusiastic%2520audience%2520evening%2520atmosphere&width=400&height=300&seq=3&orientation=landscape'
    }
  ];

  return (
    <>
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
                    onClick={() => handleNavigation(category.id === 'all' ? '/' : `/?category=${category.id}`)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      (category.id === 'all' && location.pathname === '/') || 
                      (category.id !== 'all' && location.search === `?category=${category.id}`) 
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
                    onClick={() => handleNavigation(item.id === 'registered' ? '/registered' : '/activities/history')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      isActive(item.id === 'registered' ? '/registered' : '/activities/history') 
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
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">管理员</h3>
              <div className="space-y-2">
                {adminMenus.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id === 'publish' ? '/publish' : 
                      item.id === 'manage' ? '/ActivityManage' : 
                      item.id === 'audit' ? '/AuditPage' : '/Stats')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      isActive(item.id === 'publish' ? '/publish' : 
                        item.id === 'manage' ? '/ActivityManage' : 
                        item.id === 'audit' ? '/AuditPage' : '/Stats') 
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
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团负责人</h3>
              <div className="space-y-2">
                {clubMenus.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id === 'clubActivities' ? '/ClubActivities' : item.id === 'clubStats' ? '/ClubStats' : '/ClubApply')}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      isActive(item.id === 'clubActivities' ? '/ClubActivities' : item.id === 'clubStats' ? '/ClubStats' : '/ClubApply') 
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
                <div className="relative">
                  <button
                    id="dateRangeButton"
                    onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className="fas fa-calendar-alt text-gray-400"></i>
                    <span>{selectedDateRange.name}</span>
                    <i className={`fas fa-chevron-${showDateRangeDropdown ? 'up' : 'down'} text-xs text-gray-400`}></i>
                  </button>
                  {showDateRangeDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-20">
                      {dateRangeOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSelectedDateRange(option);
                            setShowDateRangeDropdown(false);
                          }}
                          className={`block w-full px-4 py-2 text-sm text-left hover:bg-purple-50 whitespace-nowrap !rounded-button ${
                            selectedDateRange.id === option.id ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                <button
                  id="statusButton"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className="fas fa-filter text-gray-400"></i>
                  <span>{selectedStatus.name}</span>
                  <i className={`fas fa-chevron-${showStatusDropdown ? 'up' : 'down'} text-xs text-gray-400`}></i>
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-20">
                    {statusOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedStatus(option);
                          setShowStatusDropdown(false);
                        }}
                        className={`block w-full px-4 py-2 text-sm text-left hover:bg-purple-50 whitespace-nowrap !rounded-button ${
                          selectedStatus.id === option.id ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                id="resetFiltersButton"
                onClick={() => {
                  setSelectedDateRange({ id: 'all', name: '全部时间' });
                  setSelectedStatus({ id: 'all', name: '全部' });
                  const toast = document.createElement('div');
                  toast.className = 'fixed top-4 right-4 bg-purple-100 text-purple-800 px-6 py-3 rounded-lg shadow-lg z-[100] animate-fade-in';
                  toast.textContent = '筛选条件已重置';
                  document.body.appendChild(toast);
                  setTimeout(() => {
                    toast.classList.add('animate-fade-out');
                    setTimeout(() => toast.remove(), 300);
                  }, 2000);
                }}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                重置筛选
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyActivities.filter(activity =>
              selectedStatus.id === 'all' ? true : activity.status === selectedStatus.id
            ).map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
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
                    <button
                      onClick={() => {
                        setCurrentActivity(activity);
                        setCurrentPhotoIndex(0);
                        setShowPhotoGallery(true);
                      }}
                      className="flex items-center text-sm text-purple-600 hover:text-purple-700 cursor-pointer whitespace-nowrap !rounded-button"
                    >
                      <i className="fas fa-images mr-2"></i>
                      查看照片
                    </button>
                    {activity.status === 'completed' && (
                      <button
                        onClick={() => handleRating(activity)}
                        className="flex items-center text-sm text-purple-600 hover:text-purple-700 cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        <i className={`fas ${ratedActivities.includes(activity.id) ? 'fa-star text-yellow-400' : 'fa-star'} mr-2`}></i>
                        {ratedActivities.includes(activity.id) ? '已评价' : '评价活动'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {showRatingDialog && currentActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">活动评价</h3>
              <button
                onClick={() => setShowRatingDialog(false)}
                className="text-gray-400 hover:text-gray-600 !rounded-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900">{currentActivity.name}</h4>
              <p className="text-sm text-gray-500">{currentActivity.date}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">星级评分</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors !rounded-button`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">活动满意度</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'very_satisfied', icon: 'fa-smile-beam', text: '非常满意' },
                  { id: 'satisfied', icon: 'fa-smile', text: '满意' },
                  { id: 'neutral', icon: 'fa-meh', text: '一般' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSatisfaction(option.id)}
                    className={`flex flex-col items-center p-3 rounded-lg border ${
                      satisfaction === option.id
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-gray-200 text-gray-600 hover:border-purple-500'
                    } !rounded-button`}
                  >
                    <i className={`fas ${option.icon} text-xl mb-1`}></i>
                    <span className="text-sm">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="请分享您对本次活动的感受和建议..."
                className="w-full h-32 px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                maxLength={500}
              ></textarea>
              <p className="text-right text-sm text-gray-500 mt-1">{comment.length}/500</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRatingDialog(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors !rounded-button"
              >
                取消
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-2 text-white ${
                  isSubmitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                } rounded-lg transition-colors !rounded-button flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    提交中...
                  </>
                ) : '提交评价'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showPhotoGallery && currentActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70]">
          <div className="relative w-full max-w-6xl mx-4">
            <div className="flex justify-between items-center text-white mb-4">
              <h3 className="text-xl font-semibold">{currentActivity.name} - 活动照片</h3>
              <button
                onClick={() => setShowPhotoGallery(false)}
                className="text-white hover:text-gray-300 !rounded-button"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="relative aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-4">
              <img
                src={currentActivity.photos[currentPhotoIndex]}
                alt={`${currentActivity.name} 照片 ${currentPhotoIndex + 1}`}
                className="w-full h-full object-contain"
              />
              {currentPhotoIndex > 0 && (
                <button
                  onClick={() => setCurrentPhotoIndex(prev => prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all !rounded-button"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}
              {currentPhotoIndex < currentActivity.photos.length - 1 && (
                <button
                  onClick={() => setCurrentPhotoIndex(prev => prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-all !rounded-button"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {currentActivity.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all ${
                    currentPhotoIndex === index ? 'ring-2 ring-purple-500' : 'opacity-60 hover:opacity-100'
                  } !rounded-button`}
                >
                  <img
                    src={photo}
                    alt={`${currentActivity.name} 缩略图 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-white text-sm">
                {currentPhotoIndex + 1} / {currentActivity.photos.length}
              </span>
              <div className="flex space-x-4">
                <button className="text-white hover:text-purple-400 text-sm !rounded-button">
                  <i className="fas fa-download mr-2"></i>
                  下载照片
                </button>
                <button className="text-white hover:text-purple-400 text-sm !rounded-button">
                  <i className="fas fa-share-alt mr-2"></i>
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;