import os
import mysql.connector
from datetime import timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mysql.connector import Error
from typing import List

app = FastAPI()

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库配置
DB_CONFIG = {
    'host': os.getenv("DB_HOST", "142.171.42.174"),
    'user': os.getenv("DB_USER", "user_activities"),
    'password': os.getenv("DB_PASSWORD", "1234Qwer,"),
    'database': os.getenv("DB_NAME", "campus_activities"),
    'port': os.getenv("DB_PORT", 3306)
}

# 表单数据结构
class Registration(BaseModel):
    activity_id: int
    name: str
    studentId: str
    phone: str
    email: str
    remarks: str = ""

# 活动响应模型
class Activity(BaseModel):
    id: int
    title: str
    category: str
    tags: List[str]  # 保持为列表类型
    date: str
    time: str
    location: str
    registered: int
    capacity: int
    likes: int
    image: str

# 数据库连接工具函数
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"数据库连接错误: {e}")
        raise HTTPException(status_code=500, detail="数据库连接失败")

@app.get("/activities", response_model=List[Activity])
def get_activities():
    connection = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # 查询所有活动
        cursor.execute("SELECT * FROM activities")
        activities = cursor.fetchall()
        
        # 将tags字段从逗号分隔的字符串转换为列表
        for activity in activities:
            # 转换tags
            if activity['tags']:
                activity['tags'] = activity['tags'].split(',')
            else:
                activity['tags'] = []
            
            # 转换date为字符串
            activity['date'] = activity['date'].isoformat()  # 转换为YYYY-MM-DD格式
            
            # 转换time为字符串（如果需要）
            if 'time' in activity and isinstance(activity['time'], timedelta):
                # 处理timedelta类型的时间
                total_seconds = activity['time'].total_seconds()
                hours = int(total_seconds // 3600)
                minutes = int((total_seconds % 3600) // 60)
                activity['time'] = f"{hours:02d}:{minutes:02d}"
        
        return activities

    except Error as e:
        print(f"数据库查询错误: {e}")
        raise HTTPException(status_code=500, detail="获取活动数据失败")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.post("/register")
def register_user(registration: Registration):
    connection = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # 检查活动是否存在且未满
        cursor.execute(
            "SELECT registered, capacity FROM activities WHERE id = %s",
            (registration.activity_id,)
        )
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="未找到对应活动")
        
        registered, capacity = result
        if registered >= capacity:
            raise HTTPException(status_code=400, detail="活动已满")
        
        # 更新报名人数
        cursor.execute(
            "UPDATE activities SET registered = registered + 1 WHERE id = %s",
            (registration.activity_id,)
        )
        
        # TODO: 这里可以添加报名信息的存储逻辑
        # 例如：将报名信息存储到另一个表 registrations 中
        
        connection.commit()
        return {"message": "报名成功"}
    
    except Error as e:
        if connection:
            connection.rollback()
        print(f"数据库更新错误: {e}")
        raise HTTPException(status_code=500, detail="报名处理失败")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()