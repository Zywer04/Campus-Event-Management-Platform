import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ClubStats: React.FC = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const activityTrendChartRef = useRef<HTMLDivElement>(null);
  const activityTypeChartRef = useRef<HTMLDivElement>(null);
  const participationRateChartRef = useRef<HTMLDivElement>(null);

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
    { id: 'manage', name: '活动管理', icon: 'fa-tasks', url: 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/2246067d-c87d-46c4-9c5a-e7eeb8acbb91' },
    { id: 'stats', name: '数据统计', icon: 'fa-chart-bar' },
  ];

  const clubMenus = [
    { id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog' },
    { id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line', active: true },
    { id: 'clubApply', name: '申报活动', icon: 'fa-file-signature' },
  ];

  useEffect(() => {
    // 活动参与人数趋势图
    if (activityTrendChartRef.current) {
      const chart = echarts.init(activityTrendChartRef.current);
      const option = {
        animation: false,
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['参与人数', '活动数量'],
          right: 10,
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: [
          {
            type: 'value',
            name: '人数',
          },
          {
            type: 'value',
            name: '活动数',
            axisLine: {
              show: true
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '参与人数',
            type: 'line',
            smooth: true,
            data: [320, 280, 450, 380, 520, 620],
            itemStyle: {
              color: '#8b5cf6'
            },
            lineStyle: {
              width: 3
            }
          },
          {
            name: '活动数量',
            type: 'bar',
            yAxisIndex: 1,
            data: [8, 6, 10, 9, 12, 15],
            itemStyle: {
              color: '#c4b5fd'
            }
          }
        ]
      };

      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [timeRange]);

  useEffect(() => {
    // 活动类型分布饼图
    if (activityTypeChartRef.current) {
      const chart = echarts.init(activityTypeChartRef.current);
      const option = {
        animation: false,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['学术讲座', '文体活动', '志愿服务', '社团招新', '文化节日']
        },
        series: [
          {
            name: '活动类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 35, name: '学术讲座', itemStyle: { color: '#8b5cf6' } },
              { value: 25, name: '文体活动', itemStyle: { color: '#ec4899' } },
              { value: 15, name: '志愿服务', itemStyle: { color: '#10b981' } },
              { value: 10, name: '社团招新', itemStyle: { color: '#3b82f6' } },
              { value: 15, name: '文化节日', itemStyle: { color: '#f59e0b' } }
            ]
          }
        ]
      };

      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    // 历史活动参与率趋势图
    if (participationRateChartRef.current) {
      const chart = echarts.init(participationRateChartRef.current);
      const option = {
        animation: false,
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          },
          max: 100
        },
        series: [
          {
            name: '参与率',
            type: 'line',
            data: [78, 65, 83, 72, 88, 92],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            lineStyle: {
              width: 4,
              color: '#10b981'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(16, 185, 129, 0.6)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(16, 185, 129, 0.05)'
                  }
                ]
              }
            },
            smooth: true
          }
        ]
      };

      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        chart.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [timeRange]);

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
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button text-gray-600 hover:bg-gray-50`}
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
                  href={item.id === 'clubActivities' ? 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/a36dfe31-6b68-45f2-8d9d-c5938754d899' : item.id === 'clubStats' && !item.active ? 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3' : '#'}
                  data-readdy={item.id === 'clubActivities' || (item.id === 'clubStats' && !item.active) ? 'true' : undefined}
                  className="block"
                >
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
                      item.active ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
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
          {/* 页面标题和返回按钮 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <a
                href="https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3"
                data-readdy="true"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <i className="fas fa-arrow-left text-purple-600"></i>
              </a>
              <h1 className="text-2xl font-bold text-gray-900">社团活动数据统计</h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-download text-purple-600"></i>
                <span>导出报表</span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>

              {showExportDropdown && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button">
                    <i className="fas fa-file-excel text-green-600"></i>
                    <span>导出为 Excel</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button">
                    <i className="fas fa-file-pdf text-red-600"></i>
                    <span>导出为 PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 时间筛选 */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-calendar-alt text-purple-600"></i>
                <span>
                  {timeRange === 'week' && '本周数据'}
                  {timeRange === 'month' && '本月数据'}
                  {timeRange === 'quarter' && '本季度数据'}
                  {timeRange === 'year' && '本年度数据'}
                </span>
                <i className="fas fa-chevron-down text-xs text-gray-400"></i>
              </button>

              {showTimeDropdown && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={() => {
                      setTimeRange('week');
                      setShowTimeDropdown(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas fa-check ${timeRange === 'week' ? 'visible' : 'invisible'}`}></i>
                    <span>本周数据</span>
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('month');
                      setShowTimeDropdown(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas fa-check ${timeRange === 'month' ? 'visible' : 'invisible'}`}></i>
                    <span>本月数据</span>
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('quarter');
                      setShowTimeDropdown(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas fa-check ${timeRange === 'quarter' ? 'visible' : 'invisible'}`}></i>
                    <span>本季度数据</span>
                  </button>
                  <button
                    onClick={() => {
                      setTimeRange('year');
                      setShowTimeDropdown(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas fa-check ${timeRange === 'year' ? 'visible' : 'invisible'}`}></i>
                    <span>本年度数据</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              <span>数据更新时间：2025-05-29 08:30</span>
            </div>
          </div>

          {/* 数据总览卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">总活动数</h3>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <i className="fas fa-calendar-check text-xl text-purple-600"></i>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">42</span>
                <span className="text-sm text-green-600 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  12.5%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">较上月增长</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">参与总人次</h3>
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <i className="fas fa-users text-xl text-pink-600"></i>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">1,258</span>
                <span className="text-sm text-green-600 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  8.3%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">较上月增长</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">平均参与率</h3>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fas fa-chart-line text-xl text-green-600"></i>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">78.6%</span>
                <span className="text-sm text-green-600 flex items-center">
                  <i className="fas fa-arrow-up mr-1"></i>
                  5.2%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">较上月增长</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">新增会员</h3>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fas fa-user-plus text-xl text-blue-600"></i>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">86</span>
                <span className="text-sm text-red-600 flex items-center">
                  <i className="fas fa-arrow-down mr-1"></i>
                  3.1%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">较上月下降</p>
            </div>
          </div>

          {/* 活动参与人数趋势图 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">活动参与趋势</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                    参与人数
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-purple-200 mr-1"></span>
                    活动数量
                  </span>
                </div>
              </div>
              <div ref={activityTrendChartRef} className="w-full h-[300px]"></div>
            </div>

            {/* 活动类型分布饼图 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">活动类型分布</h3>
              </div>
              <div ref={activityTypeChartRef} className="w-full h-[300px]"></div>
            </div>
          </div>

          {/* 历史活动参与率趋势图和热门活动排行 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">历史活动参与率</h3>
              </div>
              <div ref={participationRateChartRef} className="w-full h-[300px]"></div>
            </div>

            {/* 热门活动排行榜 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-800">热门活动排行</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700 cursor-pointer whitespace-nowrap !rounded-button">
                  查看全部
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: '校园马拉松', participants: 328, type: '文体活动', date: '2025-05-15' },
                  { name: '人工智能讲座', participants: 256, type: '学术讲座', date: '2025-05-20' },
                  { name: '社团文化节', participants: 215, type: '文化节日', date: '2025-04-25' },
                  { name: '志愿者服务日', participants: 189, type: '志愿服务', date: '2025-05-10' },
                  { name: '创新创业大赛', participants: 167, type: '学术讲座', date: '2025-05-05' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-base font-medium text-gray-900 truncate">{activity.name}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-3">{activity.type}</span>
                        <span>{activity.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-purple-600 font-medium">
                      <i className="fas fa-user"></i>
                      <span>{activity.participants}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 社团活动详细数据表格 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-800">社团活动详细数据</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索活动..."
                    className="w-64 h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-filter"></i>
                  <span>筛选</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动名称</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动类型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动日期</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参与人数</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">参与率</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">满意度</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: '校园马拉松', type: '文体活动', date: '2025-05-15', participants: 328, rate: '82%', satisfaction: '4.8' },
                    { name: '人工智能讲座', type: '学术讲座', date: '2025-05-20', participants: 256, rate: '85%', satisfaction: '4.6' },
                    { name: '社团文化节', type: '文化节日', date: '2025-04-25', participants: 215, rate: '78%', satisfaction: '4.5' },
                    { name: '志愿者服务日', type: '志愿服务', date: '2025-05-10', participants: 189, rate: '92%', satisfaction: '4.9' },
                    { name: '创新创业大赛', type: '学术讲座', date: '2025-05-05', participants: 167, rate: '75%', satisfaction: '4.3' },
                    { name: '篮球友谊赛', type: '文体活动', date: '2025-04-30', participants: 145, rate: '88%', satisfaction: '4.7' },
                    { name: '读书分享会', type: '文化节日', date: '2025-04-22', participants: 132, rate: '72%', satisfaction: '4.4' }
                  ].map((activity, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.type}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.date}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.participants}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.rate}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">{activity.satisfaction}</span>
                          <div className="flex text-yellow-400">
                            <i className="fas fa-star text-xs"></i>
                            <i className="fas fa-star text-xs"></i>
                            <i className="fas fa-star text-xs"></i>
                            <i className="fas fa-star text-xs"></i>
                            <i className="fas fa-star-half-alt text-xs"></i>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-purple-600 hover:text-purple-800 mr-3 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-chart-bar"></i> 详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                显示 1 至 7 条，共 42 条
              </div>
              <div className="flex items-center space-x-2">
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center cursor-pointer whitespace-nowrap !rounded-button">1</button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">2</button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">3</button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">4</button>
                <button className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:border-purple-500 cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClubStats;
