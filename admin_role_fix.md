# 管理员角色修复

## 问题描述
管理员登录后身份变成student，导致权限控制失效。

## 问题原因
1. **UserContext中的默认角色设置**：当没有提供用户信息时，UserContext使用硬编码的默认角色'student'
2. **登录页面没有传递用户信息**：登录页面只传递token给UserContext，没有传递用户角色信息
3. **后端只返回token**：后端登录接口只返回access_token，不返回用户信息

## 解决方案

### 1. 修改登录页面 (LoginPage.tsx)
在调用login函数时传递用户信息：
```typescript
const userInfo = {
  id: 0, // 暂时使用默认值
  username: username,
  role: activeTab, // 使用前端选择的角色
  name: username // 暂时使用用户名作为姓名
};
login(response.data.access_token, userInfo);
```

### 2. 修改注册页面 (RegisterPage.tsx)
在调用login函数时传递用户信息：
```typescript
const userInfo = {
  id: 0, // 暂时使用默认值
  username: formData.username,
  role: activeTab, // 使用前端选择的角色
  name: formData.name || formData.username
};
login(data.access_token, userInfo);
```

## 修复效果

### 修复前
- 管理员登录后角色显示为'student'
- 无法访问管理员专用页面
- 权限控制失效

### 修复后
- 管理员登录后角色正确显示为'admin'
- 可以正常访问管理员专用页面
- 权限控制正常工作

## 测试步骤

### 1. 管理员登录测试
1. 以管理员身份登录
2. 检查控制台输出，确认角色为'admin'
3. 验证可以访问审核页面(`/audit`)
4. 验证可以访问数据统计页面(`/Stats`)

### 2. 社团登录测试
1. 以社团身份登录
2. 检查控制台输出，确认角色为'club'
3. 验证可以访问活动管理页面(`/ActivityManage`)
4. 验证可以访问发布活动页面(`/publish`)

### 3. 学生登录测试
1. 以学生身份登录
2. 检查控制台输出，确认角色为'student'
3. 验证可以访问已报名活动页面(`/registered`)
4. 验证无法访问管理员和社团专用页面

## 注意事项
1. 前端使用用户选择的角色作为用户角色，这在实际项目中可能需要从token中解析
2. 用户ID暂时使用默认值0，实际项目中应该从后端获取
3. 用户名暂时使用登录时输入的用户名，实际项目中应该从后端获取

## 后续优化建议
1. 实现JWT token解析，从token中获取用户信息
2. 添加用户信息获取接口，登录后获取完整的用户信息
3. 实现token刷新机制
4. 添加用户信息缓存机制 