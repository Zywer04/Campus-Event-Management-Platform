// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import Layout from '../components/Layout';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const keyword = searchParams.get('keyword');
  const [selectedCategory, setSelectedCategory] = useState(categoryId ? parseInt(categoryId) : 1);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  // 模拟活动数据
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: '校园歌手大赛',
      category: '文体活动',
      tags: ['音乐', '比赛', '才艺'],
      date: '2025-05-25',
      time: '19:00-21:30',
      location: '大学生活动中心',
      registered: 78,
      capacity: 100,
      likes: 45,
      image: 'https://readdy.ai/api/search-image?query=A%20vibrant%20campus%20singing%20competition%20with%20students%20performing%20on%20a%20beautifully%20decorated%20stage%20with%20colorful%20lights%20and%20a%20large%20audience%20watching%20enthusiastically.%20The%20atmosphere%20is%20electric%20with%20excitement%20and%20anticipation.%20Professional%20lighting%20equipment%20and%20sound%20systems%20visible%20on%20stage.&width=600&height=400&seq=1&orientation=landscape'
    },
    {
      id: 2,
      title: '人工智能学术讲座',
      category: '学术讲座',
      tags: ['AI', '科技', '学术'],
      date: '2025-05-27',
      time: '14:30-16:30',
      location: '理学院报告厅',
      registered: 56,
      capacity: 120,
      likes: 32,
      image: 'https://readdy.ai/api/search-image?query=A%20professional%20academic%20lecture%20on%20artificial%20intelligence%20in%20a%20modern%20university%20auditorium.%20The%20speaker%20is%20presenting%20complex%20AI%20concepts%20with%20digital%20visualizations%20projected%20on%20a%20large%20screen.%20Students%20are%20attentively%20taking%20notes%20in%20a%20well-lit%2C%20contemporary%20lecture%20hall.&width=600&height=400&seq=2&orientation=landscape'
    },
    {
      id: 3,
      title: '校园环保志愿服务',
      category: '志愿服务',
      tags: ['环保', '公益', '团队活动'],
      date: '2025-05-29',
      time: '09:00-12:00',
      location: '校园中心花园',
      registered: 45,
      capacity: 50,
      likes: 28,
      image: 'https://readdy.ai/api/search-image?query=University%20students%20participating%20in%20an%20environmental%20volunteer%20activity%20on%20campus%2C%20wearing%20green%20vests%20and%20gloves%2C%20collecting%20trash%20and%20planting%20trees%20in%20a%20beautiful%20garden%20area.%20The%20scene%20shows%20teamwork%20and%20environmental%20consciousness%20with%20a%20bright%20sunny%20day%20background.&width=600&height=400&seq=3&orientation=landscape'
    },
    {
      id: 4,
      title: '创业经验分享会',
      category: '职业发展',
      tags: ['创业', '经验分享', '职业规划'],
      date: '2025-06-01',
      time: '15:00-17:00',
      location: '商学院报告厅',
      registered: 89,
      capacity: 100,
      likes: 56,
      image: 'https://readdy.ai/api/search-image?query=A%20professional%20entrepreneurship%20sharing%20session%20in%20a%20business%20school%20auditorium%20with%20successful%20entrepreneurs%20speaking%20on%20stage.%20The%20audience%20consists%20of%20attentive%20university%20students.%20Modern%20presentation%20screens%20display%20business%20graphs%20and%20startup%20concepts%20in%20a%20professional%20setting.&width=600&height=400&seq=4&orientation=landscape'
    },
    {
      id: 5,
      title: '校园篮球联赛',
      category: '文体活动',
      tags: ['体育', '比赛', '团队'],
      date: '2025-06-05',
      time: '13:00-18:00',
      location: '体育馆',
      registered: 120,
      capacity: 150,
      likes: 75,
      image: 'https://readdy.ai/api/search-image?query=An%20exciting%20university%20basketball%20tournament%20in%20a%20modern%20indoor%20gymnasium%20with%20teams%20competing%20intensely.%20Spectators%20fill%20the%20stands%20cheering%20enthusiastically.%20The%20court%20is%20professionally%20marked%20with%20university%20logos%2C%20and%20players%20are%20wearing%20colorful%20team%20uniforms%20in%20an%20energetic%20game%20atmosphere.&width=600&height=400&seq=5&orientation=landscape'
    },
    {
      id: 6,
      title: '摄影技巧工作坊',
      category: '兴趣培养',
      tags: ['摄影', '艺术', '技能培训'],
      date: '2025-06-10',
      time: '14:00-16:30',
      location: '艺术学院工作室',
      registered: 25,
      capacity: 30,
      likes: 38,
      image: 'https://readdy.ai/api/search-image?query=A%20photography%20workshop%20in%20a%20university%20art%20studio%20with%20students%20learning%20camera%20techniques.%20Professional%20photography%20equipment%20is%20visible%20with%20lighting%20setups%20and%20tripods.%20The%20instructor%20is%20demonstrating%20composition%20techniques%20while%20students%20practice%20with%20DSLR%20cameras%20in%20a%20creative%2C%20well-lit%20environment.&width=600&height=400&seq=6&orientation=landscape'
    }
  ]);

  // 模拟轮播图数据
  const carouselItems = [
    {
      id: 1,
      title: '2025 校园文化艺术节',
      description: '展示才艺，绽放青春，一年一度的校园文化盛宴即将开启',
      image: 'https://readdy.ai/api/search-image?query=A%20grand%20university%20cultural%20arts%20festival%20with%20colorful%20decorations%20and%20banners%20across%20campus.%20Multiple%20performance%20stages%20with%20dance%2C%20music%2C%20and%20theatrical%20performances.%20Students%20in%20traditional%20and%20modern%20costumes%20participating%20in%20various%20artistic%20activities%20in%20a%20vibrant%2C%20festive%20atmosphere.&width=1200&height=500&seq=7&orientation=landscape'
    },
    {
      id: 2,
      title: '全国大学生创新创业大赛',
      description: '挑战创新极限，成就创业梦想，寻找下一个商业奇迹',
      image: 'https://readdy.ai/api/search-image?query=A%20national%20college%20student%20innovation%20and%20entrepreneurship%20competition%20with%20teams%20presenting%20their%20projects%20on%20professional%20exhibition%20stands.%20Judges%20evaluating%20creative%20business%20models%20and%20prototypes.%20The%20venue%20is%20modern%20with%20university%20banners%20and%20technology%20displays%20in%20a%20professional%20conference%20setting.&width=1200&height=500&seq=8&orientation=landscape'
    },
    {
      id: 3,
      title: '校园马拉松',
      description: '奔跑的青春最美丽，5 公里校园跑即将开始',
      image: 'https://readdy.ai/api/search-image?query=A%20university%20campus%20marathon%20with%20hundreds%20of%20students%20running%20through%20beautiful%20campus%20grounds.%20Colorful%20running%20attire%20and%20race%20numbers%20visible%20on%20participants.%20Cheering%20spectators%20line%20the%20route%20with%20university%20buildings%20and%20greenery%20in%20the%20background%20under%20a%20clear%20blue%20sky.&width=1200&height=500&seq=9&orientation=landscape'
    }
  ];

  const categories = [
    { id: 1, name: '全部活动', icon: 'fa-calendar-check' },
    { id: 2, name: '学术讲座', icon: 'fa-chalkboard-teacher' },
    { id: 3, name: '文体活动', icon: 'fa-music' },
    { id: 4, name: '志愿服务', icon: 'fa-hands-helping' },
    { id: 5, name: '职业发展', icon: 'fa-briefcase' },
    { id: 6, name: '兴趣培养', icon: 'fa-palette' }
  ];

  // 状态管理
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  //const [filteredActivities, setFilteredActivities] = useState(activities);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const [selectedTimeFilter, setselectedTimeFilter] = useState('');
  const [selectedStatusFilter, setselectedStatusFilter] = useState('');
  const [selectedLocationFilter, setselectedLocationFilter] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<typeof activities>([]);

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

  // 处理分类筛选
  useEffect(() => {
    let result = activities;

    // 分类过滤
    if (selectedCategory !== 1) {
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.name;
      result = result.filter(activity => activity.category === categoryName);
    }

    // 搜索关键词
    if (keyword) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())) ||
        item.category.toLowerCase().includes(keyword.toLowerCase()) ||
        item.location.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 时间过滤
    if (selectedTimeFilter === 'upcoming') {
      result = result.filter(activity => new Date(activity.date) >= new Date());
    } else if (selectedTimeFilter === 'past') {
      result = result.filter(activity => new Date(activity.date) < new Date());
    }

    // 状态过滤
    if (selectedStatusFilter === 'open') {
      result = result.filter(activity => activity.registered < activity.capacity);
    } else if (selectedStatusFilter === 'full') {
      result = result.filter(activity => activity.registered >= activity.capacity);
    }

    // 地点过滤
    if (selectedLocationFilter) {
      result = result.filter(activity => activity.location === selectedLocationFilter);
    }

    setFilteredActivities(result);
  }, [
    selectedCategory,
    keyword,
    activities,
    selectedTimeFilter,
    selectedStatusFilter,
    selectedLocationFilter,
    categoryId
  ]);

  // 当 URL 中的分类参数改变时更新选中状态
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    } else {
      setSelectedCategory(1);
    }
  }, [categoryId]);

  const navigate = useNavigate();

  const handleMyActivityClick = (id: string) => {
    if (id === 'registered') {
      navigate('/registered');
    } else if (id === 'history') {
      navigate('/activities/history');
    } else if (id === 'publish') {
      navigate('/publish');
    } else if (id === 'manage') {
      navigate('/ActivityManage');
    } else if (id === 'stats') {
      navigate('/Stats');
    } else if (id === 'clubActivities') {
      navigate('/ClubActivities');
    } else if (id === 'clubStats') {
      navigate('/ClubStats');
    } else if (id === 'clubApply') {
      navigate('/ClubApply');
    } else if (id === 'audit') {
      navigate('/AuditPage');
    }
  };

  const handleRegisterClick = () => {
    navigate("/register"); // 跳转到报名页面
  };

  const handleLogin = () => {
    navigate("/login"); // 跳转到登录页
  };

  const visibleActivities = activities.filter(activity => {
    const now = new Date();
    const activityDate = new Date(activity.date);

    // 时间筛选
    let timeMatch = true;
    if (selectedTimeFilter === '今天') {
      timeMatch = activityDate.toDateString() === now.toDateString();
    } else if (selectedTimeFilter === '本周') {
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      timeMatch = activityDate >= weekStart && activityDate <= weekEnd;
    }

    // 状态筛选
    let statusMatch = true;
    if (selectedStatusFilter === '即将开始') {
      statusMatch = activityDate >= new Date();
    } else if (selectedStatusFilter === '已结束') {
      statusMatch = activityDate < new Date();
    } else if (selectedStatusFilter === '已满员') {
      statusMatch = activity.registered >= activity.capacity;
    }

    // 地点筛选
    let locationMatch = selectedLocationFilter === '全部' || activity.location.includes(selectedLocationFilter);

    return timeMatch && statusMatch && locationMatch;
  });

  return (
    //<Layout>
      <div className="max-w-[1176px] mx-auto px-6 py-8">
        {/* Banner轮播 */}
        {!keyword && (
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={true}
              className="h-[400px]"
            >
              {carouselItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="relative h-full">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent flex items-center">
                      <div className="px-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                          {item.title}
                        </h1>
                        <p className="text-xl text-white/90 mb-8">{item.description}</p>
                        <button
                          onClick={handleRegisterClick}
                          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                        >
                          立即报名
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* 搜索结果提示 */}
        {keyword && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              搜索结果："{keyword}"
            </h2>
            <p className="text-gray-600 mt-2">
              找到 {filteredActivities.length} 个相关活动
            </p>
          </div>
        )}

        {/* 筛选条件 */}
        <div className="flex items-center space-x-6 mb-8">
          {/* 活动时间 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1" htmlFor="timeFilter">活动时间</label>
            <select
              id="timeFilter"
              value={selectedTimeFilter}
              onChange={(e) => setselectedTimeFilter(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer"
              title="选择活动时间"
            >
              <option value="">全部</option>
              <option value="upcoming">即将开始</option>
              <option value="past">已结束</option>
            </select>
          </div>

          {/* 活动状态 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1" htmlFor="statusFilter">活动状态</label>
            <select
              id="statusFilter"
              value={selectedStatusFilter}
              onChange={(e) => setselectedStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer"
              title="选择活动状态"
            >
              <option value="">全部</option>
              <option value="open">可报名</option>
              <option value="full">已满员</option>
            </select>
          </div>

          {/* 活动地点 */}
          <div>
            <label className="block text-sm text-gray-600 mb-1" htmlFor="locationFilter">活动地点</label>
            <select
              id="locationFilter"
              value={selectedLocationFilter}
              onChange={(e) => setselectedLocationFilter(e.target.value)}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer"
              title="选择活动地点"
            >
              <option value="">全部</option>
              {Array.from(new Set(activities.map((a) => a.location))).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 活动列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/activities/${activity.id}`)}
              >
                <div className="relative h-48">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                      {activity.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span><i className="fas fa-calendar-alt mr-1"></i>{activity.date}</span>
                    <span><i className="fas fa-clock mr-1"></i>{activity.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      <i className="fas fa-map-marker-alt mr-1"></i>{activity.location}
                    </span>
                    <span className="text-sm text-purple-600">
                      已报名 {activity.registered}/{activity.capacity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">没有找到相关活动</p>
            </div>
          )}
        </div>
      </div>
    //</Layout>
  );
};

export default HomePage;
