// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
const App: React.FC = () => {
  // 模拟活动数据
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "校园歌手大赛",
      category: "文体活动",
      tags: ["音乐", "比赛", "才艺"],
      date: "2025-05-25",
      time: "19:00-21:30",
      location: "大学生活动中心",
      registered: 78,
      capacity: 100,
      likes: 45,
      image:
        "https://readdy.ai/api/search-image?query=A%20vibrant%20campus%20singing%20competition%20with%20students%20performing%20on%20a%20beautifully%20decorated%20stage%20with%20colorful%20lights%20and%20a%20large%20audience%20watching%20enthusiastically.%20The%20atmosphere%20is%20electric%20with%20excitement%20and%20anticipation.%20Professional%20lighting%20equipment%20and%20sound%20systems%20visible%20on%20stage.&width=600&height=400&seq=1&orientation=landscape",
    },
    {
      id: 2,
      title: "人工智能学术讲座",
      category: "学术讲座",
      tags: ["AI", "科技", "学术"],
      date: "2025-05-27",
      time: "14:30-16:30",
      location: "理学院报告厅",
      registered: 56,
      capacity: 120,
      likes: 32,
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20academic%20lecture%20on%20artificial%20intelligence%20in%20a%20modern%20university%20auditorium.%20The%20speaker%20is%20presenting%20complex%20AI%20concepts%20with%20digital%20visualizations%20projected%20on%20a%20large%20screen.%20Students%20are%20attentively%20taking%20notes%20in%20a%20well-lit%2C%20contemporary%20lecture%20hall.&width=600&height=400&seq=2&orientation=landscape",
    },
    {
      id: 3,
      title: "校园环保志愿服务",
      category: "志愿服务",
      tags: ["环保", "公益", "团队活动"],
      date: "2025-05-29",
      time: "09:00-12:00",
      location: "校园中心花园",
      registered: 45,
      capacity: 50,
      likes: 28,
      image:
        "https://readdy.ai/api/search-image?query=University%20students%20participating%20in%20an%20environmental%20volunteer%20activity%20on%20campus%2C%20wearing%20green%20vests%20and%20gloves%2C%20collecting%20trash%20and%20planting%20trees%20in%20a%20beautiful%20garden%20area.%20The%20scene%20shows%20teamwork%20and%20environmental%20consciousness%20with%20a%20bright%20sunny%20day%20background.&width=600&height=400&seq=3&orientation=landscape",
    },
    {
      id: 4,
      title: "创业经验分享会",
      category: "职业发展",
      tags: ["创业", "经验分享", "职业规划"],
      date: "2025-06-01",
      time: "15:00-17:00",
      location: "商学院报告厅",
      registered: 89,
      capacity: 100,
      likes: 56,
      image:
        "https://readdy.ai/api/search-image?query=A%20professional%20entrepreneurship%20sharing%20session%20in%20a%20business%20school%20auditorium%20with%20successful%20entrepreneurs%20speaking%20on%20stage.%20The%20audience%20consists%20of%20attentive%20university%20students.%20Modern%20presentation%20screens%20display%20business%20graphs%20and%20startup%20concepts%20in%20a%20professional%20setting.&width=600&height=400&seq=4&orientation=landscape",
    },
    {
      id: 5,
      title: "校园篮球联赛",
      category: "文体活动",
      tags: ["体育", "比赛", "团队"],
      date: "2025-06-05",
      time: "13:00-18:00",
      location: "体育馆",
      registered: 120,
      capacity: 150,
      likes: 75,
      image:
        "https://readdy.ai/api/search-image?query=An%20exciting%20university%20basketball%20tournament%20in%20a%20modern%20indoor%20gymnasium%20with%20teams%20competing%20intensely.%20Spectators%20fill%20the%20stands%20cheering%20enthusiastically.%20The%20court%20is%20professionally%20marked%20with%20university%20logos%2C%20and%20players%20are%20wearing%20colorful%20team%20uniforms%20in%20an%20energetic%20game%20atmosphere.&width=600&height=400&seq=5&orientation=landscape",
    },
    {
      id: 6,
      title: "摄影技巧工作坊",
      category: "兴趣培养",
      tags: ["摄影", "艺术", "技能培训"],
      date: "2025-06-10",
      time: "14:00-16:30",
      location: "艺术学院工作室",
      registered: 25,
      capacity: 30,
      likes: 38,
      image:
        "https://readdy.ai/api/search-image?query=A%20photography%20workshop%20in%20a%20university%20art%20studio%20with%20students%20learning%20camera%20techniques.%20Professional%20photography%20equipment%20is%20visible%20with%20lighting%20setups%20and%20tripods.%20The%20instructor%20is%20demonstrating%20composition%20techniques%20while%20students%20practice%20with%20DSLR%20cameras%20in%20a%20creative%2C%20well-lit%20environment.&width=600&height=400&seq=6&orientation=landscape",
    },
  ]);
  // 模拟轮播图数据
  const carouselItems = [
    {
      id: 1,
      title: "2025 校园文化艺术节",
      description: "展示才艺，绽放青春，一年一度的校园文化盛宴即将开启",
      image:
        "https://readdy.ai/api/search-image?query=A%20grand%20university%20cultural%20arts%20festival%20with%20colorful%20decorations%20and%20banners%20across%20campus.%20Multiple%20performance%20stages%20with%20dance%2C%20music%2C%20and%20theatrical%20performances.%20Students%20in%20traditional%20and%20modern%20costumes%20participating%20in%20various%20artistic%20activities%20in%20a%20vibrant%2C%20festive%20atmosphere.&width=1200&height=500&seq=7&orientation=landscape",
    },
    {
      id: 2,
      title: "全国大学生创新创业大赛",
      description: "挑战创新极限，成就创业梦想，寻找下一个商业奇迹",
      image:
        "https://readdy.ai/api/search-image?query=A%20national%20college%20student%20innovation%20and%20entrepreneurship%20competition%20with%20teams%20presenting%20their%20projects%20on%20professional%20exhibition%20stands.%20Judges%20evaluating%20creative%20business%20models%20and%20prototypes.%20The%20venue%20is%20modern%20with%20university%20banners%20and%20technology%20displays%20in%20a%20professional%20conference%20setting.&width=1200&height=500&seq=8&orientation=landscape",
    },
    {
      id: 3,
      title: "校园马拉松",
      description: "奔跑的青春最美丽，5 公里校园跑即将开始",
      image:
        "https://readdy.ai/api/search-image?query=A%20university%20campus%20marathon%20with%20hundreds%20of%20students%20running%20through%20beautiful%20campus%20grounds.%20Colorful%20running%20attire%20and%20race%20numbers%20visible%20on%20participants.%20Cheering%20spectators%20line%20the%20route%20with%20university%20buildings%20and%20greenery%20in%20the%20background%20under%20a%20clear%20blue%20sky.&width=1200&height=500&seq=9&orientation=landscape",
    },
  ];
  // 分类数据
  const categories = [
    { id: 1, name: "全部活动", icon: "fa-calendar-check" },
    { id: 2, name: "学术讲座", icon: "fa-chalkboard-teacher" },
    { id: 3, name: "文体活动", icon: "fa-music" },
    { id: 4, name: "志愿服务", icon: "fa-hands-helping" },
    { id: 5, name: "职业发展", icon: "fa-briefcase" },
    { id: 6, name: "兴趣培养", icon: "fa-palette" },
  ];
  // 状态管理
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    phone: "",
    email: "",
    remarks: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // 处理分类筛选
  useEffect(() => {
    if (activeCategory === 1) {
      setFilteredActivities(
        activities.filter(
          (activity) =>
            activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        ),
      );
    } else {
      const categoryName = categories.find(
        (cat) => cat.id === activeCategory,
      )?.name;
      setFilteredActivities(
        activities.filter(
          (activity) =>
            activity.category === categoryName &&
            (activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              activity.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase()),
              )),
        ),
      );
    }
  }, [activeCategory, searchTerm, activities]);
  // 轮播图自动播放
  useEffect(() => {
  fetch("http://localhost:8000/activities")
    .then((res) => res.json())
    .then((data) => setActivities(data))
    .catch((err) => console.error("获取活动失败", err));
}, []);

  // 处理报名按钮点击
  const handleRegisterClick = (activity: any) => {
    setSelectedActivity(activity);
    setShowRegistrationModal(true);
  };
  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 处理报名提交
  const handleSubmitRegistration = () => {
  if (!selectedActivity) return;

  fetch("http://localhost:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      activity_id: selectedActivity.id,
      ...formData,
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail);
      }
      return res.json();
    })
    .then(() => {
      setShowRegistrationModal(false);
      setShowSuccessModal(true);
      setActivities((prev) =>
        prev.map((a) =>
          a.id === selectedActivity.id
            ? { ...a, registered: a.registered + 1 }
            : a
        )
      );
    })
    .catch((err) => alert("报名失败: " + err.message));
};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="fas fa-university text-indigo-600 text-2xl mr-2"></i>
                <span className="font-bold text-xl text-indigo-600">
                  校园活动管理平台
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative mx-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="搜索活动、标签..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 rounded-full text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                <i className="fas fa-bell text-xl"></i>
              </button>
              <div className="ml-3 relative">
                <div>
                  <button
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <i className="fas fa-user"></i>
                    </div>
                  </button>
                </div>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      个人资料
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      我的活动
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      设置
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      退出登录
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row">
          {/* 侧边栏 */}
          <div className="w-full md:w-64 mb-6 md:mb-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-indigo-600 text-white">
                <h2 className="text-lg font-medium">活动分类</h2>
              </div>
              <nav className="mt-2">
                <ul>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                          activeCategory === category.id
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                        } cursor-pointer`}
                      >
                        <i
                          className={`fas ${category.icon} mr-3 text-lg ${
                            activeCategory === category.id
                              ? "text-indigo-600"
                              : "text-gray-400"
                          }`}
                        ></i>
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  我的活动
                </h3>
                <ul>
                  <li>
                    <a
                      href="https://readdy.ai/home/60940391-f6d0-42ff-84b9-1b76108510a2/b6bb77cc-75ca-4a2a-bf12-6c71186b0277"
                      data-readdy="true"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md cursor-pointer"
                    >
                      <i className="fas fa-clipboard-list mr-3 text-gray-400"></i>
                      已报名活动
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md cursor-pointer"
                    >
                      <i className="fas fa-history mr-3 text-gray-400"></i>
                      历史参与
                    </a>
                  </li>
                </ul>
              </div>
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  管理员功能
                </h3>
                <ul>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md cursor-pointer"
                    >
                      <i className="fas fa-plus-circle mr-3 text-gray-400"></i>
                      发布活动
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md cursor-pointer"
                    >
                      <i className="fas fa-tasks mr-3 text-gray-400"></i>
                      活动管理
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-md cursor-pointer"
                    >
                      <i className="fas fa-chart-bar mr-3 text-gray-400"></i>
                      数据统计
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* 主内容区 */}
          <div className="md:ml-8 flex-1">
            {/* 轮播图 */}
            <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg h-[400px]">
              {carouselItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentCarouselIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-transparent flex items-center">
                    <div className="px-8 md:px-16 max-w-lg">
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {item.title}
                      </h2>
                      <p className="text-white text-lg mb-6">
                        {item.description}
                      </p>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 !rounded-button whitespace-nowrap cursor-pointer">
                        立即报名
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarouselIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentCarouselIndex
                        ? "bg-white"
                        : "bg-white/50"
                    } cursor-pointer`}
                  ></button>
                ))}
              </div>
            </div>
            {/* 活动筛选区 */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">时间：</span>
                  <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                    <option value="">全部时间</option>
                    <option value="today">今天</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">状态：</span>
                  <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                    <option value="">全部状态</option>
                    <option value="registering">报名中</option>
                    <option value="ongoing">进行中</option>
                    <option value="ended">已结束</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">地点：</span>
                  <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                    <option value="">全部地点</option>
                    <option value="activity-center">活动中心</option>
                    <option value="lecture-hall">报告厅</option>
                    <option value="gym">体育馆</option>
                    <option value="outdoor">户外场地</option>
                  </select>
                </div>
              </div>
            </div>
            {/* 活动列表 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {categories.find((cat) => cat.id === activeCategory)?.name ||
                  "全部活动"}
              </h2>
              {filteredActivities.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <i className="fas fa-search text-gray-400 text-5xl mb-4"></i>
                  <p className="text-gray-500 text-lg">没有找到匹配的活动</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <a
                            href="https://readdy.ai/home/60940391-f6d0-42ff-84b9-1b76108510a2/9631fab1-a488-4f89-895e-2bcc2ad5ce7f"
                            data-readdy="true"
                            className="hover:text-indigo-600 transition-colors"
                          >
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                              {activity.title}
                            </h3>
                          </a>
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            {activity.category}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center mb-1">
                            <i className="fas fa-calendar-alt text-gray-400 mr-2"></i>
                            <span>{activity.date}</span>
                          </div>
                          <div className="flex items-center mb-1">
                            <i className="fas fa-clock text-gray-400 mr-2"></i>
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                            <span>{activity.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {activity.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-indigo-600 font-medium">
                              {activity.registered}
                            </span>
                            <span className="text-gray-500">
                              /{activity.capacity} 人已报名
                            </span>
                          </div>
                          <div className="flex items-center">
                            <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                              <i className="fas fa-heart mr-1"></i>
                              <span className="text-xs">{activity.likes}</span>
                            </button>
                          </div>
                        </div>
                        <button
                          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors !rounded-button whitespace-nowrap cursor-pointer"
                          onClick={() => handleRegisterClick(activity)}
                        >
                          立即报名
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* 加载更多按钮 */}
              {filteredActivities.length > 0 && (
                <div className="mt-8 text-center">
                  <button className="bg-white hover:bg-gray-50 text-indigo-600 font-medium py-2 px-6 border border-indigo-600 rounded-lg transition-colors !rounded-button whitespace-nowrap cursor-pointer">
                    加载更多活动
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 页脚 */}
      <footer className="bg-white mt-12 pt-8 pb-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                关于我们
              </h3>
              <p className="text-gray-600 text-sm">
                校园活动管理平台致力于为师生提供便捷的活动发布、报名和管理服务，丰富校园文化生活。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                快速链接
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm cursor-pointer"
                  >
                    首页
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm cursor-pointer"
                  >
                    活动日历
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm cursor-pointer"
                  >
                    帮助中心
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-indigo-600 text-sm cursor-pointer"
                  >
                    联系我们
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                联系方式
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-envelope mr-2 text-gray-400"></i>
                  contact@campus-activity.edu.cn
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-phone mr-2 text-gray-400"></i>
                  (010) 8888-7777
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
                  北京市海淀区学院路 100 号
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                关注我们
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-600 text-xl cursor-pointer"
                >
                  <i className="fab fa-weixin"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-600 text-xl cursor-pointer"
                >
                  <i className="fab fa-weibo"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-600 text-xl cursor-pointer"
                >
                  <i className="fab fa-qq"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-600 text-xl cursor-pointer"
                >
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">扫描二维码关注公众号</p>
                <div className="mt-2 bg-gray-100 w-24 h-24 flex items-center justify-center">
                  <i className="fas fa-qrcode text-gray-400 text-4xl"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2025 校园活动管理平台 版权所有 | 京ICP备12345678号
            </p>
          </div>
        </div>
      </footer>
      {/* 报名确认对话框 */}
      {showRegistrationModal && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">活动报名</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {selectedActivity.title}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-indigo-500 mr-2"></i>
                    <span>{selectedActivity.date}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-indigo-500 mr-2"></i>
                    <span>{selectedActivity.time}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-indigo-500 mr-2"></i>
                    <span>{selectedActivity.location}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-users text-indigo-500 mr-2"></i>
                    <span>
                      剩余名额:{" "}
                      {selectedActivity.capacity - selectedActivity.registered}{" "}
                      人
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    学号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    手机号码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="remarks"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    备注
                  </label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSubmitRegistration}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
                disabled={
                  !formData.name || !formData.studentId || !formData.phone
                }
              >
                确认报名
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 报名成功提示 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-green-100 mb-4">
              <i className="fas fa-check text-green-500 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              报名成功
            </h3>
            <p className="text-gray-600 mb-4">
              您已成功报名参加 "{selectedActivity?.title}"
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
