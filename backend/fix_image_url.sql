-- 修复image_url字段长度问题
-- 将activities表中的image_url字段从VARCHAR(255)更新为VARCHAR(1000)

USE campus_events;

-- 检查当前字段长度
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'campus_events' 
AND TABLE_NAME = 'activities' 
AND COLUMN_NAME = 'image_url';

-- 更新字段长度
ALTER TABLE activities MODIFY COLUMN image_url VARCHAR(1000);

-- 验证更新结果
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'campus_events' 
AND TABLE_NAME = 'activities' 
AND COLUMN_NAME = 'image_url'; 