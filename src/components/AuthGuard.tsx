import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  // 检查是否已登录
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  // 如果指定了允许的角色，检查用户角色是否在允许列表中
  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    // 根据用户角色重定向到相应的页面
    switch (userRole) {
      case 'student':
        return <Navigate to="/home" replace />;
      case 'club':
        return <Navigate to="/ClubActivities" replace />;
      case 'admin':
        return <Navigate to="/audit" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard; 