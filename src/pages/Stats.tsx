import React from 'react';
import ActivityStats from '../components/ActivityStats';

const Stats: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">数据统计</h1>
        <p className="text-gray-600 mt-2">查看活动相关的统计数据和分析</p>
      </div>
      
      <ActivityStats />
    </div>
  );
};

export default Stats;