// App.tsx 或 App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisteredActivities from './pages/RegisteredActivities';
import HistoryPage from './pages/HistoryPage'
import Publish from './pages/Publish'
import ActivityManage from './pages/ActivityManage'
import Stats from './pages/Stats'
import ClubActivities from './pages/ClubActivities'
import ClubStats from './pages/ClubStats'
import ClubApply from './pages/ClubApply'
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ActivityDetail from './pages/ActivityDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route path="/registered" element={<RegisteredActivities />} />
        <Route path="/activities/history" element={<HistoryPage />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/ActivityManage" element={<ActivityManage />} />
        <Route path="/Stats" element={<Stats />} />
        <Route path="/ClubActivities" element={<ClubActivities />} />
        <Route path="/ClubStats" element={<ClubStats />} />
        <Route path="/ClubApply" element={<ClubApply />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
