import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'club' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 密码强度检测
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength(null);
      return;
    }

    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  }, [password]);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  // 表单验证
  if (!username || !password) {
    setFormError('用户名和密码不能为空');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      // 登录成功：保存 token 和 role
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('username', data.user.username);

      // 跳转到主页
      navigate('/home');
    } else {
      // 登录失败
      setLoginAttempts(prev => prev + 1);

      if (loginAttempts >= 2) {
        setShowCaptcha(true);
        setFormError('登录失败次数过多，请输入验证码');
      } else {
        setFormError(data.message || '用户名或密码错误，请重试');
      }
    }
  } catch (error) {
    setFormError('网络错误，请稍后再试');
  }
};


  const getTabLabel = (tab: 'student' | 'club' | 'admin') => {
    switch (tab) {
      case 'student': return '学生';
      case 'club': return '社团负责人';
      case 'admin': return '学校管理员';
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'student': return '请输入学号';
      case 'club': return '请输入社团账号';
      case 'admin': return '请输入管理员账号';
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
          <p className="text-xl text-white/90">连接校园，丰富生活，成就梦想</p>
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

      {/* 右侧登录区 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">欢迎登录</h2>
            <p className="text-gray-600 mt-2">请选择您的用户类型进行登录</p>
          </div>

          {/* 用户类型选择 */}
          <div className="flex mb-8 border-b border-gray-200">
            {(['student', 'club', 'admin'] as const).map((tab) => (
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

          {/* 登录表单 */}
          <form onSubmit={handleLogin} className="space-y-6">
            {formError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  {activeTab === 'student' ? '学号' : '用户名'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer whitespace-nowrap !rounded-button"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                {/* 密码强度指示器 */}
                {passwordStrength && (
                  <div className="mt-1 flex items-center">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                    <span className={`ml-2 text-xs ${
                      passwordStrength === 'weak' ? 'text-red-500' :
                      passwordStrength === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength === 'weak' ? '弱' :
                       passwordStrength === 'medium' ? '中' : '强'}
                    </span>
                  </div>
                )}
              </div>

              {showCaptcha && (
                <div>
                  <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                    验证码
                  </label>
                  <div className="flex">
                    <input
                      id="captcha"
                      type="text"
                      placeholder="请输入验证码"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <div className="ml-2 w-24 h-10 bg-gray-200 flex items-center justify-center rounded-lg">
                      <span className="text-gray-600 font-mono">AB12CD</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    记住密码
                  </label>
                </div>
                <div>
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    忘记密码？
                  </a>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer whitespace-nowrap !rounded-button"
            >
              登录
            </button>

            {/* 注册链接 - 仅对学生和社团负责人显示 */}
            {activeTab !== 'admin' && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  首次使用？
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                    注册账号
                  </a>
                </p>
              </div>
            )}
          </form>

          {/* 底部信息 */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© 2025 校园活动管理平台 版权所有</p>
            <p className="mt-1">当前日期: 2025-05-29, Thursday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
