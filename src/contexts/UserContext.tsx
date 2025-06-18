import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../utils/api';

interface User {
  id: number;
  username: string;
  role: string;
  name: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user?: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 从localStorage恢复用户状态
    const storedToken = localStorage.getItem('access_token');
    const storedUserRole = localStorage.getItem('user_role');
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username');
    const storedUserName = localStorage.getItem('user_name');

    if (storedToken && storedUserRole && storedUserId && storedUsername) {
      setToken(storedToken);
      setUser({
        id: parseInt(storedUserId),
        username: storedUsername,
        role: storedUserRole,
        name: storedUserName || ''
      });

      // 设置axios默认headers
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = (newToken: string, newUser?: any) => {
    setToken(newToken);
    
    // 输出解析后的身份信息
    console.log('🔍 UserContext解析的身份信息:', {
      token: newToken,
      providedUser: newUser,
      timestamp: new Date().toLocaleString()
    });
    
    // 如果没有提供用户信息，从token中解析用户信息
    if (!newUser) {
      try {
        // 简单的token解析（实际项目中应该使用JWT库）
        // 这里我们假设token包含用户信息，或者从其他地方获取
        const userData: User = {
          id: 0, // 默认值
          username: 'user', // 默认值
          role: 'student', // 默认值
          name: '用户' // 默认值
        };
        setUser(userData);
        
        // 保存到localStorage
        localStorage.setItem('access_token', newToken);
        localStorage.setItem('user_role', userData.role);
        localStorage.setItem('user_id', userData.id.toString());
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user_name', userData.name);
      } catch (error) {
        console.error('Token解析失败:', error);
        // 使用默认用户信息
        const userData: User = {
          id: 0,
          username: 'user',
          role: 'student',
          name: '用户'
        };
        setUser(userData);
        
        localStorage.setItem('access_token', newToken);
        localStorage.setItem('user_role', userData.role);
        localStorage.setItem('user_id', userData.id.toString());
        localStorage.setItem('username', userData.username);
        localStorage.setItem('user_name', userData.name);
      }
    } else {
      // 确保用户对象有正确的格式
      const userData: User = {
        id: newUser.id || 0, // 如果没有id字段，使用0作为默认值
        username: newUser.username || '',
        role: newUser.role || '',
        name: newUser.name || newUser.username || ''
      };
      
      setUser(userData);
      
      // 保存到localStorage
      localStorage.setItem('access_token', newToken);
      localStorage.setItem('user_role', userData.role);
      localStorage.setItem('user_id', userData.id.toString());
      localStorage.setItem('username', userData.username);
      localStorage.setItem('user_name', userData.name);
    }

    // 设置axios默认headers
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // 清除localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_name');

    // 清除axios默认headers
    delete api.defaults.headers.common['Authorization'];
  };

  const value: UserContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 