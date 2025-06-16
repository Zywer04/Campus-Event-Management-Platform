import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

interface Activity {
  id: number;
  title: string;
  category: string;
  tags: string[];
  date: string;
  time: string;
  location: string;
  registered: number;
  capacity: number;
  likes: number;
  image: string;
  description: string;
  organizer: string;
  contact: string;
  requirements?: string[];
}

const ActivityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await axios.get(`/api/activities/${id}`);
        setActivity(response.data);
        setLoading(false);
      } catch (err) {
        setError('获取活动详情失败');
        setLoading(false);
      }
    };

    fetchActivityDetail();
  }, [id]);

  const handleRegister = async () => {
    try {
      await axios.post(`/api/activities/${id}/register`);
      setIsRegistered(true);
      // 可以添加成功提示
    } catch (err) {
      // 处理错误情况
      console.error('报名失败:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !activity) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600">{error || '活动不存在'}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[1176px] mx-auto px-6 py-8">
        {/* 活动封面图 */}
        <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{activity.title}</h1>
            <div className="flex items-center space-x-4 text-white/90">
              <span><i className="fas fa-calendar-alt mr-2"></i>{activity.date}</span>
              <span><i className="fas fa-clock mr-2"></i>{activity.time}</span>
              <span><i className="fas fa-map-marker-alt mr-2"></i>{activity.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* 左侧活动信息 */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">活动详情</h2>
              <p className="text-gray-600 mb-6">{activity.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">活动要求</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {activity.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">联系方式</h3>
                  <p className="text-gray-600">
                    <span className="font-medium">主办方：</span>{activity.organizer}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">联系人：</span>{activity.contact}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧报名卡片 */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">报名人数</span>
                  <span className="text-purple-600 font-medium">
                    {activity.registered}/{activity.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(activity.registered / activity.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={isRegistered || activity.registered >= activity.capacity}
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  isRegistered
                    ? 'bg-green-600'
                    : activity.registered >= activity.capacity
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isRegistered
                  ? '已报名'
                  : activity.registered >= activity.capacity
                  ? '已满员'
                  : '立即报名'}
              </button>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">活动时间</span>
                  <span>{activity.date} {activity.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">活动地点</span>
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">活动分类</span>
                  <span>{activity.category}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivityDetail; 