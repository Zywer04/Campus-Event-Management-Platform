import React, { useState } from 'react';
import * as echarts from 'echarts';


const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    activity_id: 1,
    name: '',
    studentId: '',
    phone: '',
    email: '',
    department: '',
    grade: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
      alert("报名成功！");
    } else {
      alert("报名失败：" + result.message);
    }
  } catch (error) {
    console.error("提交出错", error);
    alert("提交出错");
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center">
          <a
            href="https://readdy.ai/home/b0cf731b-de36-44f8-8c9f-e57d09ede402/446a40e3-0c00-4354-93ed-34b1ad9576e3"
            data-readdy="true"
            className="flex items-center space-x-3 text-gray-600 hover:text-purple-600"
          >
            <i className="fas fa-arrow-left"></i>
            <span>返回活动列表</span>
          </a>
          <h1 className="text-lg font-semibold text-center flex-1">活动详情</h1>
        </div>
      </nav>

      <main className="pt-16 min-h-screen">
        <div className="max-w-[1000px] mx-auto px-6 py-8">
          <div className="h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=A%20modern%20university%20auditorium%20filled%20with%20students%20attending%20an%20academic%20lecture%2C%20with%20professional%20lighting%20and%20state-of-the-art%20presentation%20equipment%2C%20creating%20an%20engaging%20learning%20atmosphere&width=1000&height=400&seq=1&orientation=landscape"
              className="w-full h-full object-cover"
              alt="活动海报"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">2025 春季学术讲座系列</h1>

            <div className="flex items-center space-x-8 mb-6">
              <div className="flex items-center text-gray-600">
                <i className="fas fa-calendar-alt w-5"></i>
                <span>2025-06-15 14:00-16:00</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt w-5"></i>
                <span>图书馆报告厅</span>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">报名进行中</span>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-university text-purple-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">计算机科学学院</h3>
                  <p className="text-sm text-gray-500">主办方</p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">活动详情</h2>
              <p className="text-gray-600 mb-6">
                本次讲座邀请到了国际知名专家，将就人工智能领域的最新发展进行深入探讨。讲座内容涵盖机器学习、深度学习等前沿话题，适合对人工智能感兴趣的师生参与。
              </p>

              <h3 className="text-lg font-semibold mb-4">活动流程</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="text-sm text-gray-500 w-24">13:30-14:00</div>
                  <div className="flex-1">签到入场</div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-sm text-gray-500 w-24">14:00-15:30</div>
                  <div className="flex-1">专家主题演讲</div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-sm text-gray-500 w-24">15:30-16:00</div>
                  <div className="flex-1">互动问答环节</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">报名信息</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    学号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-4">活动须知</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>1. 请准时参加活动，迟到可能无法入场</li>
                  <li>2. 活动全程禁止录音录像</li>
                  <li>3. 请保持会场安静，将手机调至静音模式</li>
                  <li>4. 如需取消报名，请提前24小时告知</li>
                </ul>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded text-purple-600" required />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  我已阅读并同意<a href="#" className="text-purple-600">活动须知</a>和<a href="#" className="text-purple-600">隐私政策</a>
                </label>
              </div>
            </form>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
            <div className="max-w-[1000px] mx-auto px-6 py-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
              >
                提交报名
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
