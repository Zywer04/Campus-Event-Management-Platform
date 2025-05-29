import React, { useState } from 'react';
import * as echarts from 'echarts';

const ActivityManage: React.FC = () => {
const [selectedStatus, setSelectedStatus] = useState('all');
const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [editingActivity, setEditingActivity] = useState<any>(null);

const handleEditClick = (activity: any) => {
  setEditingActivity(activity);
  setShowEditModal(true);
};

const handleEditSave = () => {
  // Here you can implement the save logic
  setShowEditModal(false);
  setEditingActivity(null);
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
];
const clubMenus = [
{ id: 'clubActivities', name: '管理社团活动', icon: 'fa-users-cog' },
{ id: 'clubStats', name: '社团活动数据', icon: 'fa-chart-line' },
{ id: 'clubApply', name: '申报活动', icon: 'fa-file-signature' },
];
const activities = [
{
id: 1,
title: '校园文化节开幕式',
startTime: '2025-06-01 14:00',
endTime: '2025-06-01 17:00',
location: '大学生活动中心',
status: '进行中',
currentParticipants: 120,
maxParticipants: 200,
},
{
id: 2,
title: '创新创业大赛',
startTime: '2025-06-15 09:00',
endTime: '2025-06-15 18:00',
location: '图书馆报告厅',
status: '未开始',
currentParticipants: 80,
maxParticipants: 150,
}
];
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
<button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left">
English
</button>
<button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 text-left">
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
<div>
<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">活动分类</h3>
<div className="space-y-2">
{categories.map(category => (
<button
key={category.id}
className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button"
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
<a
key={item.id}
href={item.id === 'manage' ? 'https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3' : '#'}
data-readdy={item.id === 'manage' ? 'true' : undefined}
className="block"
>
<button
className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
item.id === 'manage' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
}`}
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
<button
key={item.id}
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
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
<div className="flex items-center justify-between mb-6">
<h2 className="text-xl font-semibold">活动管理</h2>
<button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 cursor-pointer whitespace-nowrap !rounded-button">
<i className="fas fa-plus"></i>
<span>新建活动</span>
</button>
</div>
<div className="flex items-center space-x-4 mb-6">
<div className="relative flex-1">
<input
type="text"
placeholder="搜索活动标题..."
className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
/>
<i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
</div>
<button
className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
selectedStatus === 'all' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
}`}
onClick={() => setSelectedStatus('all')}
>
全部
</button>
<button
className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
selectedStatus === 'ongoing' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
}`}
onClick={() => setSelectedStatus('ongoing')}
>
进行中
</button>
<button
className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
selectedStatus === 'upcoming' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
}`}
onClick={() => setSelectedStatus('upcoming')}
>
未开始
</button>
<button
className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap !rounded-button ${
selectedStatus === 'ended' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
}`}
onClick={() => setSelectedStatus('ended')}
>
已结束
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full">
<thead className="bg-gray-50">
<tr>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动标题</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动时间</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">活动地点</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报名人数</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
</tr>
</thead>
<tbody className="bg-white divide-y divide-gray-200">
{activities.map((activity) => (
<tr key={activity.id}>
<td className="px-6 py-4">
<div className="text-sm font-medium text-gray-900">{activity.title}</div>
</td>
<td className="px-6 py-4">
<div className="text-sm text-gray-500">
{activity.startTime}
<br />
{activity.endTime}
</div>
</td>
<td className="px-6 py-4">
<div className="text-sm text-gray-500">{activity.location}</div>
</td>
<td className="px-6 py-4">
<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
activity.status === '进行中' ? 'bg-green-100 text-green-800' :
activity.status === '未开始' ? 'bg-yellow-100 text-yellow-800' :
'bg-gray-100 text-gray-800'
}`}>
{activity.status}
</span>
</td>
<td className="px-6 py-4">
<div className="text-sm text-gray-500">
{activity.currentParticipants}/{activity.maxParticipants}
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center space-x-3">
<button
  onClick={() => handleEditClick(activity)}
  className="text-purple-600 hover:text-purple-700 cursor-pointer whitespace-nowrap !rounded-button">
  <i className="fas fa-edit"></i>
</button>
<button className="text-red-600 hover:text-red-700 cursor-pointer whitespace-nowrap !rounded-button">
<i className="fas fa-trash-alt"></i>
</button>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
<div className="flex items-center justify-between mt-6">
<div className="text-sm text-gray-500">
共 20 条记录
</div>
<div className="flex items-center space-x-2">
<button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button">
上一页
</button>
<button className="px-3 py-1 rounded bg-purple-600 text-white cursor-pointer whitespace-nowrap !rounded-button">
1
</button>
<button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button">
2
</button>
<button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button">
3
</button>
<button className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer whitespace-nowrap !rounded-button">
下一页
</button>
</div>
</div>
</div>
</div>
</main>

{/* Edit Modal */}
{showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="text-xl font-semibold text-gray-900">编辑活动</h3>
        <button
          onClick={() => setShowEditModal(false)}
          className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">活动标题</label>
          <input
            type="text"
            value={editingActivity?.title || ''}
            onChange={(e) => setEditingActivity({...editingActivity, title: e.target.value})}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
            <input
              type="datetime-local"
              value={editingActivity?.startTime?.replace(' ', 'T') || ''}
              onChange={(e) => setEditingActivity({...editingActivity, startTime: e.target.value.replace('T', ' ')})}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
            <input
              type="datetime-local"
              value={editingActivity?.endTime?.replace(' ', 'T') || ''}
              onChange={(e) => setEditingActivity({...editingActivity, endTime: e.target.value.replace('T', ' ')})}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">活动地点</label>
          <input
            type="text"
            value={editingActivity?.location || ''}
            onChange={(e) => setEditingActivity({...editingActivity, location: e.target.value})}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">人数限制</label>
          <input
            type="number"
            value={editingActivity?.maxParticipants || ''}
            onChange={(e) => setEditingActivity({...editingActivity, maxParticipants: parseInt(e.target.value)})}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 border-t border-gray-200 px-6 py-4">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
        >
          取消
        </button>
        <button
          onClick={handleEditSave}
          className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
        >
          保存
        </button>
      </div>
    </div>
  </div>
)}
</div>
);
};
export default ActivityManage;
