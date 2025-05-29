import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ClubActivities: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('clubActivities');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailSidebar, setShowDetailSidebar] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<any>(null);

  // 分类菜单
  const categories = [
    { id: 'all', name: '全部活动', icon: 'fa-list-ul' },
    { id: 'academic', name: '学术讲座', icon: 'fa-chalkboard-teacher' },
    { id: 'sports', name: '文体活动', icon: 'fa-running' },
  ];

  // 我的活动菜单
  const myActivities = [
    { id: 'registered', name: '已报名活动', icon: 'fa-calendar-check' },
    { id: 'history', name: '历史参与', icon: 'fa-history' },
  ];

  // 社团管理员菜单
  const adminMenus = [
    { id: 'publish', name: '发布活动', icon: 'fa-plus-circle' },
    { id: 'manage', name: '活动管理', icon: 'fa-tasks', url: 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/2246067d-c87d-46c4-9c5a-e7eeb8acbb91' },
    { id: 'stats', name: '数据统计', icon: 'fa-chart-bar' },
  ];

  // 社团负责人菜单
  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog', url: 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line' },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature' },
  ];

  // 模拟活动数据
  const activities = [
    {
      id: '1',
      name: '校园文化节专场演出',
      startTime: '2025-06-15 14:00',
      endTime: '2025-06-15 17:00',
      location: '大学生活动中心',
      status: '报名中',
      statusColor: 'green',
      organizer: '学生会文艺部',
      participants: 120,
      maxParticipants: 200,
      description: '校园文化节专场演出将展示我校学生的才艺，包括歌舞表演、器乐演奏、相声小品等多种形式。欢迎全校师生前来观看！',
    },
    {
      id: '2',
      name: '创新创业大赛决赛',
      startTime: '2025-06-20 09:00',
      endTime: '2025-06-20 18:00',
      location: '图书馆报告厅',
      status: '审核中',
      statusColor: 'yellow',
      organizer: '创新创业学院',
      participants: 45,
      maxParticipants: 50,
      description: '本次大赛旨在培养学生的创新精神和创业能力，参赛项目涵盖人工智能、生物医药、新能源等多个领域。决赛将评选出金、银、铜奖项目。',
    },
    {
      id: '3',
      name: '校园马拉松',
      startTime: '2025-06-25 08:00',
      endTime: '2025-06-25 12:00',
      location: '校园环形跑道',
      status: '已结束',
      statusColor: 'gray',
      organizer: '体育部',
      participants: 300,
      maxParticipants: 300,
      description: '校园马拉松分为5公里和10公里两个组别，沿校园环形跑道进行。参与者将获得纪念T恤和完赛奖牌。',
    },
    {
      id: '4',
      name: '人工智能前沿讲座',
      startTime: '2025-07-05 15:00',
      endTime: '2025-07-05 17:00',
      location: '计算机学院报告厅',
      status: '报名中',
      statusColor: 'green',
      organizer: '计算机学院学生会',
      participants: 78,
      maxParticipants: 150,
      description: '邀请行业专家分享人工智能最新研究成果和应用案例，内容涵盖深度学习、计算机视觉、自然语言处理等热门领域。',
    },
    {
      id: '5',
      name: '社团招新嘉年华',
      startTime: '2025-09-10 10:00',
      endTime: '2025-09-10 16:00',
      location: '校园中心广场',
      status: '未开始',
      statusColor: 'blue',
      organizer: '校团委',
      participants: 0,
      maxParticipants: 2000,
      description: '全校各社团集中展示特色活动，招募新成员。现场设有表演区、展示区和互动区，为新生提供了解校园社团文化的平台。',
    },
    {
      id: '6',
      name: '毕业生晚会',
      startTime: '2025-06-30 19:00',
      endTime: '2025-06-30 22:00',
      location: '大学生活动中心',
      status: '已驳回',
      statusColor: 'red',
      organizer: '毕业生委员会',
      participants: 0,
      maxParticipants: 500,
      description: '为2025届毕业生举办的告别晚会，内容包括精彩节目表演、毕业感言分享、师生互动环节等，为大学生活画上圆满句号。',
    },
  ];

  // 处理全选/取消全选
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedActivities(activities.map(activity => activity.id));
    } else {
      setSelectedActivities([]);
    }
  };

  // 处理单个选择
  const handleSelectActivity = (id: string) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(item => item !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };

  // 处理删除操作
  const handleDelete = () => {
    // 实际项目中这里应该调用API删除数据
    console.log('删除活动:', selectedActivities);
    setShowDeleteModal(false);
    setSelectedActivities([]);
  };

  // 处理查看详情
  const handleViewDetail = (activity: any) => {
    setCurrentActivity(activity);
    setShowDetailSidebar(true);
  };

  // 获取状态标签的样式
  const getStatusStyle = (statusColor: string) => {
    const baseStyle = "px-2 py-1 rounded-full text-xs font-medium";
    switch (statusColor) {
      case 'green':
        return `${baseStyle} bg-green-100 text-green-800`;
      case 'yellow':
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case 'red':
        return `${baseStyle} bg-red-100 text-red-800`;
      case 'blue':
        return `${baseStyle} bg-blue-100 text-blue-800`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };

  // 过滤活动列表
  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <a
                  key={item.id}
                  href={item.id === 'registered' ? 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/cc7a0b38-a2df-4fd4-8e26-cb0d488aa9e7' : item.id === 'history' ? 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/ae34a255-ef3e-4f52-aaa5-f35a2fdecc05' : '#'}
                  data-readdy={item.id === 'registered' || item.id === 'history' ? 'true' : undefined}
                  className="block"
                >
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团管理员</h3>
            <div className="space-y-2">
              {adminMenus.map(item => (
                <a
                  key={item.id}
                  href={item.id === 'publish' ? 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/3089ee48-24e0-4724-9a23-7c32a7b3d0af' : item.id === 'manage' ? item.url : '#'}
                  data-readdy={item.id === 'publish' || item.id === 'manage' ? 'true' : undefined}
                  className="block"
                >
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团负责人</h3>
            <div className="space-y-2">
              {clubMenus.map(item => (
                <a
                  key={item.id}
                  href={item.url}
                  data-readdy={item.url ? 'true' : undefined}
                  className="block"
                >
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      selectedCategory === item.id
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.name}</span>
                  </button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <main className="ml-64 pt-16 min-h-screen">
        <div className="max-w-[1176px] mx-auto px-6 py-8">
          {/* 页面标题 */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">社团活动管理</h1>
            <a href="https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/3089ee48-24e0-4724-9a23-7c32a7b3d0af" data-readdy="true">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button">
                <i className="fas fa-plus"></i>
                <span>新建活动</span>
              </button>
            </a>
          </div>

          {/* 搜索和筛选区域 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="搜索活动名称、地点..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>

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
          </div>

          {/* 批量操作区域 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => selectedActivities.length > 0 && setShowDeleteModal(true)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button ${
                  selectedActivities.length > 0
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={selectedActivities.length === 0}
              >
                <i className="fas fa-trash-alt"></i>
                <span>批量删除</span>
              </button>

              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button">
                <i className="fas fa-file-export"></i>
                <span>导出数据</span>
              </button>
            </div>

            <div className="text-sm text-gray-500">
              共 {filteredActivities.length} 个活动
            </div>
          </div>

          {/* 活动列表表格 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={selectedActivities.length === activities.length && activities.length > 0}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动地点
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    活动状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    报名人数
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetail(activity)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={selectedActivities.includes(activity.id)}
                        onChange={() => handleSelectActivity(activity.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{activity.startTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{activity.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusStyle(activity.statusColor)}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{activity.participants}/{activity.maxParticipants}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <button className="text-purple-600 hover:text-purple-900 mr-3 cursor-pointer whitespace-nowrap !rounded-button">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 cursor-pointer whitespace-nowrap !rounded-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivities([activity.id]);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 空状态 */}
            {filteredActivities.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <i className="fas fa-calendar-times text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500">暂无符合条件的活动</p>
              </div>
            )}
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              显示 1 至 {filteredActivities.length} 条，共 {filteredActivities.length} 条
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed whitespace-nowrap !rounded-button">
                上一页
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-lg cursor-pointer whitespace-nowrap !rounded-button">
                1
              </button>
              <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed whitespace-nowrap !rounded-button">
                下一页
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">确认删除</h3>
              <p className="text-sm text-gray-500">
                您确定要删除选中的 {selectedActivities.length} 个活动吗？此操作不可恢复。
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer whitespace-nowrap !rounded-button"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 活动详情侧边栏 */}
      {showDetailSidebar && currentActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">活动详情</h2>
              <button
                onClick={() => setShowDetailSidebar(false)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-8">
                <img
                  src={`https://readdy.ai/api/search-image?query=University%2520campus%2520event%2520showing%2520students%2520participating%2520in%2520cultural%2520activities%2520with%2520colorful%2520decorations%2520and%2520modern%2520university%2520buildings%2520in%2520background%2520professional%2520photography%2520style%2520with%2520natural%2520lighting&width=400&height=250&seq=${currentActivity.id}&orientation=landscape`}
                  alt={currentActivity.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{currentActivity.name}</h3>
                <span className={getStatusStyle(currentActivity.statusColor)}>
                  {currentActivity.status}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">活动描述</h4>
                  <p className="text-gray-700">{currentActivity.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">开始时间</h4>
                    <p className="text-gray-700">{currentActivity.startTime}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">结束时间</h4>
                    <p className="text-gray-700">{currentActivity.endTime}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">活动地点</h4>
                  <p className="text-gray-700">{currentActivity.location}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">主办方</h4>
                  <p className="text-gray-700">{currentActivity.organizer}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">报名情况</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{ width: `${(currentActivity.participants / currentActivity.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-700">{currentActivity.participants}/{currentActivity.maxParticipants} 人</p>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-edit"></i>
                  <span>编辑活动</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedActivities([currentActivity.id]);
                    setShowDetailSidebar(false);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button"
                >
                  <i className="fas fa-trash-alt"></i>
                  <span>删除活动</span>
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
