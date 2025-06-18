# 路由路径对照表

## App.tsx 中定义的路由
- `/` - 主页
- `/home` - 主页（别名）
- `/activities/:id` - 活动详情
- `/registered` - 已报名活动（学生）
- `/activities/history` - 历史参与（学生）
- `/club-activities` - 社团活动管理（社团）
- `/publish` - 发布活动（社团、管理员）
- `/ActivityManage` - 活动管理（社团、管理员）
- `/ClubStats` - 社团活动数据（社团）
- `/ClubApply` - 申报活动（社团）
- `/audit` - 审核活动（管理员）
- `/Stats` - 数据统计（管理员）
- `/login` - 登录页面
- `/register` - 注册页面

## 已修复的路径不匹配问题

### 1. 登录页面 (LoginPage.tsx)
- ❌ 社团登录后跳转到 `/activity-manage`
- ✅ 修复为 `/ActivityManage`

### 2. 注册页面 (RegisterPage.tsx)
- ❌ 社团注册后跳转到 `/club-activities`
- ✅ 修复为 `/ClubActivities`

### 3. 侧边栏 (Sidebar.tsx)
- ❌ `audit` 菜单映射到 `/AuditPage`
- ✅ 修复为 `/audit`

### 4. 布局组件 (Layout.tsx)
- ❌ 检查路径 `/AuditPage`
- ✅ 修复为 `/audit`

## 当前路径映射状态

### 侧边栏路径映射
```typescript
const pathMap: Record<string, string> = {
  registered: '/registered',           ✅ 匹配
  history: '/activities/history',      ✅ 匹配
  publish: '/publish',                 ✅ 匹配
  manage: '/ActivityManage',           ✅ 匹配
  stats: '/Stats',                     ✅ 匹配
  audit: '/audit',                     ✅ 匹配
  clubActivities: '/ClubActivities',   ✅ 匹配
  clubStats: '/ClubStats',             ✅ 匹配
  clubApply: '/ClubApply',             ✅ 匹配
};
```

### 登录后跳转路径
- 学生: `/` ✅
- 社团: `/ActivityManage` ✅
- 管理员: `/audit` ✅

### 注册后跳转路径
- 学生: `/home` ✅
- 社团: `/ClubActivities` ✅

## 测试建议
1. 以不同角色登录，检查跳转路径是否正确
2. 点击侧边栏菜单，检查路由是否匹配
3. 注册新用户，检查跳转路径是否正确
4. 检查所有页面的标题显示是否正确 