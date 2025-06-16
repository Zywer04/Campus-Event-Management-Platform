// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';
import * as echarts from 'echarts';
import { useNavigate, useLocation } from 'react-router-dom';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dateRange, setDateRange] = useState('30');
  const [activityType, setActivityType] = useState('all');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');
  const [exportRange, setExportRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // 导航菜单配置
  const myActivities = [
    { id: 'registered', name: '已报名活动', icon: 'calendar-check', path: '/registered' },
    { id: 'history', name: '历史参与', icon: 'history', path: '/activities/history' }
  ];

  const adminMenus = [
    { id: 'publish', name: '发布活动', icon: 'plus-circle', path: '/publish' },
    { id: 'manage', name: '活动管理', icon: 'tasks', path: '/ActivityManage' },
    { id: 'stats', name: '数据统计', icon: 'chart-bar', path: '/Stats' },
    { id: 'audit', name: '审核活动', icon: 'check-circle', path: '/AuditPage' }
  ];

  const clubMenus = [
    { id: 'club-activities', name: '管理社团活动', icon: 'users', path: '/ClubActivities' },
    { id: 'club-stats', name: '社团活动数据', icon: 'chart-line', path: '/ClubStats' },
    { id: 'club-apply', name: '申报活动', icon: 'file-alt', path: '/ClubApply' }
  ];

  // 导航处理函数
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // 判断当前页面是否激活
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleExport = () => {
    setIsExporting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setExportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsExporting(false);
        setShowExportModal(false);
        setExportProgress(0);
        // Simulate file download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `activity-report-${Date.now()}.${exportFormat}`;
        link.click();
      }
    }, 500);
  };
  React.useEffect(() => {
    // 活动参与度分析图表
    const participationChart = echarts.init(document.getElementById('participationChart'));
    const participationOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        lineStyle: { color: '#8B5CF6' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139,92,246,0.3)' },
              { offset: 1, color: 'rgba(139,92,246,0.1)' }
            ]
          }
        }
      }]
    };
    participationChart.setOption(participationOption);
    // 活动类型分布图表
    const typeChart = echarts.init(document.getElementById('typeChart'));
    const typeOption = {
      animation: false,
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: '14', fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: [
          { value: 1048, name: '学术讲座' },
          { value: 735, name: '文体活动' },
          { value: 580, name: '志愿服务' },
          { value: 484, name: '社团招新' }
        ]
      }]
    };
    typeChart.setOption(typeOption);
    // 报名人数趋势图表
    const trendChart = echarts.init(document.getElementById('trendChart'));
    const trendOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value' },
      series: [{
        data: [150, 230, 224, 218, 135, 147],
        type: 'bar',
        barWidth: '60%',
        itemStyle: { color: '#8B5CF6' }
      }]
    };
    trendChart.setOption(trendOption);
    // 活动满意度评分图表
    const satisfactionChart = echarts.init(document.getElementById('satisfactionChart'));
    const satisfactionOption = {
      animation: false,
      tooltip: { trigger: 'axis' },
      radar: {
        indicator: [
          { name: '活动内容', max: 100 },
          { name: '组织管理', max: 100 },
          { name: '场地设施', max: 100 },
          { name: '时间安排', max: 100 },
          { name: '互动效果', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value: [85, 90, 88, 95, 89],
          name: '满意度评分',
          areaStyle: {
            color: 'rgba(139,92,246,0.3)'
          },
          lineStyle: {
            color: '#8B5CF6'
          }
        }]
      }]
    };
    satisfactionChart.setOption(satisfactionOption);
    return () => {
      participationChart.dispose();
      typeChart.dispose();
      trendChart.dispose();
      satisfactionChart.dispose();
    };
  }, []);
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
                className="w-64 h-10 pl-10 pr-4 text-sm rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 border-none"
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
      {/* 左侧导航 */}
      <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* 我的活动 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">我的活动</h3>
            <div className="space-y-2">
              {myActivities.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    isActive(item.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label={item.name}
                >
                  <i className={`fas fa-${item.icon}`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 管理员功能 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">管理员功能</h3>
            <div className="space-y-2">
              {adminMenus.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    isActive(item.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label={item.name}
                >
                  <i className={`fas fa-${item.icon}`}></i>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 社团功能 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">社团功能</h3>
            <div className="space-y-2">
              {clubMenus.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                    isActive(item.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label={item.name}
                >
                  <i className={`fas fa-${item.icon}`}></i>
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
          {/* 筛选区域 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className="fas fa-calendar-alt"></i>
                    <span>最近 {dateRange} 天</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  {showDateDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                      <button
                        onClick={() => {
                          setDateRange('7');
                          setShowDateDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button"
                      >
                       最近 7 天
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('30');
                          setShowDateDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button"
                      >
                       最近 30 天
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('90');
                          setShowDateDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button"
                      >
                       最近 90 天
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomDateRange(true);
                          setShowDateDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        自定义日期范围
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className="fas fa-filter"></i>
                    <span>活动类型</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                      <button
                        onClick={() => {
                          setActivityType('all');
                          setShowTypeDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        全部类型
                      </button>
                      <button
                        onClick={() => {
                          setActivityType('academic');
                          setShowTypeDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        学术讲座
                      </button>
                      <button
                        onClick={() => {
                          setActivityType('sports');
                          setShowTypeDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left cursor-pointer whitespace-nowrap !rounded-button"
                      >
                        文体活动
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-download"></i>
                <span>导出报表</span>
              </button>
            </div>
          </div>

          {/* 导出报表模态框 */}
          {showExportModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[480px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">导出报表</h3>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {!isExporting ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            onClick={() => setExportFormat('excel')}
                            className={`px-4 py-2 rounded-lg border text-sm flex items-center justify-center space-x-2 whitespace-nowrap !rounded-button ${
                              exportFormat === 'excel' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600 hover:border-purple-600 hover:text-purple-600'
                            }`}
                          >
                            <i className="fas fa-file-excel"></i>
                            <span>Excel</span>
                          </button>
                          <button
                            onClick={() => setExportFormat('pdf')}
                            className={`px-4 py-2 rounded-lg border text-sm flex items-center justify-center space-x-2 whitespace-nowrap !rounded-button ${
                              exportFormat === 'pdf' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600 hover:border-purple-600 hover:text-purple-600'
                            }`}
                          >
                            <i className="fas fa-file-pdf"></i>
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => setExportFormat('csv')}
                            className={`px-4 py-2 rounded-lg border text-sm flex items-center justify-center space-x-2 whitespace-nowrap !rounded-button ${
                              exportFormat === 'csv' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600 hover:border-purple-600 hover:text-purple-600'
                            }`}
                          >
                            <i className="fas fa-file-csv"></i>
                            <span>CSV</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">导出范围</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setExportRange('all')}
                            className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap !rounded-button ${
                              exportRange === 'all' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600 hover:border-purple-600 hover:text-purple-600'
                            }`}
                          >
                            全部数据
                          </button>
                          <button
                            onClick={() => setExportRange('filtered')}
                            className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap !rounded-button ${
                              exportRange === 'filtered' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-600 hover:border-purple-600 hover:text-purple-600'
                            }`}
                          >
                            当前筛选数据
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setShowExportModal(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap !rounded-button"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap !rounded-button"
                      >
                        确认导出
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-6">
                    <div className="mb-4">
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${exportProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      正在导出报表 ({exportProgress}%)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* 数据卡片网格 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 活动参与度分析 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">活动参与度分析</h3>
              <div className="text-sm text-gray-500">
                <span className="text-green-500">↑12.5%</span> 较上月
              </div>
            </div>
            <div id="participationChart" className="w-full h-[300px]"></div>
          </div>
          {/* 活动类型分布 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">活动类型分布</h3>
              <div className="text-sm text-gray-500">
                共 4 种类型
              </div>
            </div>
            <div id="typeChart" className="w-full h-[300px]"></div>
          </div>
          {/* 报名人数趋势 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">报名人数趋势</h3>
              <div className="text-sm text-gray-500">
                <span className="text-red-500">↓8.3%</span> 较上月
              </div>
            </div>
            <div id="trendChart" className="w-full h-[300px]"></div>
          </div>
          {/* 活动满意度评分 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">活动满意度评分</h3>
              <div className="text-sm text-gray-500">
                平均分 89.4
              </div>
            </div>
            <div id="satisfactionChart" className="w-full h-[300px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;