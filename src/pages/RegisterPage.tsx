import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'club'>('student');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    intro: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setFormError('请填写所有必填字段');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('密码长度至少6位');
      return;
    }

    if (formData.username.length < 3) {
      setFormError('用户名长度至少3位');
      return;
    }

    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const response = await axios.post('http://localhost:8000/api/register', {
        username: formData.username,
        password: formData.password,
        role: activeTab,
        name: formData.name || undefined,
        intro: activeTab === 'club' ? formData.intro : undefined
      });

      const data = response.data;

      console.log('注册响应数据:', data);

      // 注册成功，自动登录
      setFormSuccess('注册成功！正在自动登录...');

      // 使用UserContext的login方法
      login(data.access_token, data.user);

      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        // 根据角色跳转到不同页面
        switch (activeTab) {
          case 'student':
            navigate('/home');
            break;
          case 'club':
            navigate('/club-activities');
            break;
          default:
            navigate('/home');
        }
      }, 1500);

    } catch (error: any) {
      console.error('注册错误:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.detail || '注册失败，请重试';
        setFormError(errorMessage);
      } else if (error.request) {
        setFormError('网络连接失败，请检查网络设置');
      } else {
        setFormError('注册过程中发生未知错误');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTabLabel = (tab: 'student' | 'club') => {
    switch (tab) {
      case 'student': return '学生注册';
      case 'club': return '社团注册';
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* 左侧品牌区 */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=A%20modern%20university%20campus%20scene%20with%20beautiful%20buildings%2C%20green%20spaces%2C%20and%20students%20walking%20around.%20The%20image%20has%20a%20soft%20gradient%20overlay%20that%20transitions%20from%20deep%20blue%20to%20teal%2C%20giving%20it%20a%20modern%20and%20professional%20appearance.%20The%20scene%20is%20peaceful%20and%20inviting%2C%20perfect%20for%20a%20campus%20activity%20management%20platform.&width=800&height=1024&seq=1&orientation=portrait"
            alt="校园背景"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/80 z-10"></div>
        </div>

        <div className="z-20 w-full">
          <div className="flex items-center">
            <i className="fas fa-graduation-cap text-4xl text-white mr-3"></i>
            <h1 className="text-3xl font-bold text-white">CampusEvent</h1>
          </div>
        </div>

        <div className="z-20 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">校园活动管理平台</h2>
          <p className="text-xl text-white/90">加入我们，开启精彩校园生活</p>
        </div>

        <div className="z-20 w-full">
          <p className="text-white/80 text-sm">© 2025 校园活动管理平台 - 让每一个校园活动都精彩纷呈</p>
        </div>
      </div>

      {/* 移动端顶部 */}
      <div className="md:hidden bg-blue-700 p-4 flex items-center justify-center">
        <i className="fas fa-graduation-cap text-2xl text-white mr-2"></i>
        <h1 className="text-xl font-bold text-white">校园活动管理平台</h1>
      </div>

      {/* 右侧注册区 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">用户注册</h2>
            <p className="text-gray-600 mt-2">请选择您的用户类型进行注册</p>
          </div>

          {/* 用户类型选择 */}
          <div className="flex mb-8 border-b border-gray-200">
            {(['student', 'club'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-medium text-center transition-all duration-200 cursor-pointer whitespace-nowrap !rounded-button ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                <i className="fas fa-check-circle mr-2"></i>
                {formSuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  用户名 *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="请输入用户名（至少3位）"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'student' ? '姓名' : '社团名称'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <i className="fas fa-id-card"></i>
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={activeTab === 'student' ? '请输入真实姓名' : '请输入社团名称'}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码 *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="请输入密码（至少6位）"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码 *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="请再次输入密码"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    aria-label={showConfirmPassword ? "隐藏确认密码" : "显示确认密码"}
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {activeTab === 'club' && (
                <div>
                  <label htmlFor="intro" className="block text-sm font-medium text-gray-700 mb-1">
                    社团简介
                  </label>
                  <textarea
                    id="intro"
                    name="intro"
                    value={formData.intro}
                    onChange={handleInputChange}
                    placeholder="请输入社团简介"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  注册中...
                </span>
              ) : (
                '立即注册'
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                已有账号？
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                >
                  立即登录
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
