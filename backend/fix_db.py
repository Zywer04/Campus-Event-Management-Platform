#!/usr/bin/env python3
"""
修复数据库中的image_url字段长度问题
"""

import pymysql
from sqlalchemy import create_engine, text

# 数据库配置
DATABASE_URL = "mysql+pymysql://root:1234Qwer,@142.171.42.174:3306/campus_events"

def fix_image_url_column():
    """修复image_url字段长度"""
    try:
        # 创建数据库连接
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as connection:
            # 检查当前字段长度
            result = connection.execute(text("""
                SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'campus_events' 
                AND TABLE_NAME = 'activities' 
                AND COLUMN_NAME = 'image_url'
            """))
            
            column_info = result.fetchone()
            if column_info:
                current_length = column_info[2]
                print(f"当前image_url字段长度: {current_length}")
                
                if current_length and current_length < 1000:
                    # 更新字段长度
                    connection.execute(text("""
                        ALTER TABLE activities 
                        MODIFY COLUMN image_url VARCHAR(1000)
                    """))
                    connection.commit()
                    print("✅ image_url字段长度已更新为1000")
                else:
                    print("✅ image_url字段长度已经是1000或更大，无需更新")
            else:
                print("❌ 未找到image_url字段")
                
    except Exception as e:
        print(f"❌ 更新失败: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("开始修复image_url字段长度...")
    success = fix_image_url_column()
    if success:
        print("✅ 数据库修复完成")
    else:
        print("❌ 数据库修复失败") 