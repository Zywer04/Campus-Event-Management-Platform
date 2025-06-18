import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import { UserProvider } from './contexts/UserContext';
import { ActivityProvider } from './contexts/ActivityContext';

import HomePage from "./pages/HomePage";
import RegisteredActivities from './pages/RegisteredActivities';
import HistoryPage from './pages/HistoryPage';
import Publish from './pages/Publish';
import ActivityManage from './pages/ActivityManage';
import Stats from './pages/Stats';
import ClubActivities from './pages/ClubActivities';
import ClubStats from './pages/ClubStats';
import ClubApply from './pages/ClubApply';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ActivityDetail from './pages/ActivityDetail';
import AuditPage from './pages/AuditPage';

function App() {
  return (
    <UserProvider>
      <ActivityProvider>
        <BrowserRouter>
          <Routes>
            {/* 登录页面不需要认证 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 需要认证的页面 */}
            <Route element={<Layout />}>
              {/* 所有用户都可以访问的页面 */}
              <Route path="/" element={
                <AuthGuard allowedRoles={['student', 'club', 'admin']}>
                  <HomePage />
                </AuthGuard>
              } />
              <Route path="/home" element={
                <AuthGuard allowedRoles={['student', 'club', 'admin']}>
                  <HomePage />
                </AuthGuard>
              } />
              <Route path="/activities/:id" element={
                <AuthGuard allowedRoles={['student', 'club', 'admin']}>
                  <ActivityDetail />
                </AuthGuard>
              } />

              {/* 学生专用页面 */}
              <Route path="/registered" element={
                <AuthGuard allowedRoles={['student']}>
                  <RegisteredActivities />
                </AuthGuard>
              } />
              <Route path="/activities/history" element={
                <AuthGuard allowedRoles={['student']}>
                  <HistoryPage />
                </AuthGuard>
              } />

              {/* 社团和管理员都可以访问的页面 */}
              <Route path="/club-activities" element={
                <AuthGuard allowedRoles={['club']}>
                  <ClubActivities />
                </AuthGuard>
              } />
              <Route path="/publish" element={
                <AuthGuard allowedRoles={['club', 'admin']}>
                  <Publish />
                </AuthGuard>
              } />
              <Route path="/ActivityManage" element={
                <AuthGuard allowedRoles={['club', 'admin']}>
                  <ActivityManage />
                </AuthGuard>
              } />
              <Route path="/ClubStats" element={
                <AuthGuard allowedRoles={['club']}>
                  <ClubStats />
                </AuthGuard>
              } />
              <Route path="/ClubApply" element={
                <AuthGuard allowedRoles={['club']}>
                  <ClubApply />
                </AuthGuard>
              } />

              {/* 管理员专用页面 */}
              <Route path="/audit" element={
                <AuthGuard allowedRoles={['admin']}>
                  <AuditPage />
                </AuthGuard>
              } />
              <Route path="/Stats" element={
                <AuthGuard allowedRoles={['admin']}>
                  <Stats />
                </AuthGuard>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </ActivityProvider>
    </UserProvider>
  );
}

export default App;
