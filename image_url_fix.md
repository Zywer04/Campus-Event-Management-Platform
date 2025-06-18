# Image URL 字段长度问题修复

## 问题描述
在创建活动时，前端传递的图片URL（来自readdy.ai API）非常长，超过了数据库中`image_url`字段的255字符限制，导致数据库错误：
```
pymysql.err.DataError: (1406, "Data too long for column 'image_url' at row 1")
```

## 解决方案

### 1. 后端代码修复 ✅
已经在 `backend/main.py` 中添加了以下修复：

- **create_activity函数**：添加了image_url长度检查，如果超过1000字符会自动截断
- **modify_activity函数**：同样添加了image_url长度检查
- **数据库模型**：已将`image_url`字段从`String(255)`改为`String(1000)`

### 2. 数据库表结构修复
需要执行以下操作之一来更新数据库表结构：

#### 选项A：使用Python脚本（推荐）
```bash
cd backend
python fix_db.py
```

#### 选项B：直接执行SQL
在MySQL客户端中执行 `backend/fix_image_url.sql` 文件中的SQL语句

#### 选项C：手动执行SQL命令
```sql
USE campus_events;
ALTER TABLE activities MODIFY COLUMN image_url VARCHAR(1000);
```

### 3. 验证修复
执行以下SQL查询验证字段长度是否已更新：
```sql
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'campus_events' 
AND TABLE_NAME = 'activities' 
AND COLUMN_NAME = 'image_url';
```

## 预防措施
- 后端代码现在会自动截断过长的image_url
- 建议前端在发送请求前也检查URL长度
- 考虑使用图片压缩或CDN来缩短URL长度

## 测试
修复后，重新尝试创建活动，应该不会再出现字段长度错误。 