import asyncio
from sqlalchemy import text
from db import async_session

async def create_tables():
    async with async_session() as session:
        try:
            # 创建学生表
            await session.execute(text("""
                CREATE TABLE IF NOT EXISTS students (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    student_id VARCHAR(20) UNIQUE NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(100),
                    phone VARCHAR(20),
                    department VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # 创建社团表
            await session.execute(text("""
                CREATE TABLE IF NOT EXISTS clubs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    club_account VARCHAR(50) UNIQUE NOT NULL,
                    club_name VARCHAR(100) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    contact_person VARCHAR(100),
                    contact_phone VARCHAR(20),
                    contact_email VARCHAR(100),
                    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # 创建管理员表
            await session.execute(text("""
                CREATE TABLE IF NOT EXISTS admins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    admin_account VARCHAR(50) UNIQUE NOT NULL,
                    admin_name VARCHAR(100) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(100),
                    phone VARCHAR(20),
                    role ENUM('super_admin', 'admin') DEFAULT 'admin',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # 创建活动表
            await session.execute(text("""
                CREATE TABLE IF NOT EXISTS activities (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    category VARCHAR(100),
                    tags TEXT,
                    date DATE,
                    time TIME,
                    location VARCHAR(200),
                    registered INT DEFAULT 0,
                    capacity INT DEFAULT 0,
                    likes INT DEFAULT 0,
                    image VARCHAR(500),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            await session.commit()
            print("数据库表创建成功！")
            
        except Exception as e:
            await session.rollback()
            print(f"创建表时出错: {e}")

async def insert_test_data():
    async with async_session() as session:
        try:
            # 插入测试学生数据
            students_data = [
                ('2021001', '张三', '123456', 'zhangsan@example.com', '13800138001', '计算机学院'),
                ('2021002', '李四', '123456', 'lisi@example.com', '13800138002', '数学学院'),
                ('2021003', '王五', '123456', 'wangwu@example.com', '13800138003', '物理学院'),
            ]
            
            for student in students_data:
                await session.execute(text("""
                    INSERT IGNORE INTO students (student_id, name, password, email, phone, department)
                    VALUES (:student_id, :name, :password, :email, :phone, :department)
                """), {
                    "student_id": student[0],
                    "name": student[1],
                    "password": student[2],
                    "email": student[3],
                    "phone": student[4],
                    "department": student[5]
                })
            
            # 插入测试社团数据
            clubs_data = [
                ('club001', '计算机协会', '123456', '张会长', '13900139001', 'computer@example.com'),
                ('club002', '数学建模协会', '123456', '李会长', '13900139002', 'math@example.com'),
                ('club003', '摄影协会', '123456', '王会长', '13900139003', 'photo@example.com'),
            ]
            
            for club in clubs_data:
                await session.execute(text("""
                    INSERT IGNORE INTO clubs (club_account, club_name, password, contact_person, contact_phone, contact_email, status)
                    VALUES (:club_account, :club_name, :password, :contact_person, :contact_phone, :contact_email, 'active')
                """), {
                    "club_account": club[0],
                    "club_name": club[1],
                    "password": club[2],
                    "contact_person": club[3],
                    "contact_phone": club[4],
                    "contact_email": club[5]
                })
            
            # 插入测试管理员数据
            admins_data = [
                ('admin001', '系统管理员', '123456', 'admin@example.com', '13700137001'),
                ('admin002', '活动管理员', '123456', 'activity@example.com', '13700137002'),
            ]
            
            for admin in admins_data:
                await session.execute(text("""
                    INSERT IGNORE INTO admins (admin_account, admin_name, password, email, phone)
                    VALUES (:admin_account, :admin_name, :password, :email, :phone)
                """), {
                    "admin_account": admin[0],
                    "admin_name": admin[1],
                    "password": admin[2],
                    "email": admin[3],
                    "phone": admin[4]
                })
            
            # 插入测试活动数据
            activities_data = [
                ('Python编程讲座', '学术讲座', 'Python,编程,技术', '2024-01-15', '14:00:00', '教学楼A101', 0, 50, 0, 'https://example.com/python.jpg'),
                ('篮球友谊赛', '文体活动', '篮球,运动,友谊', '2024-01-20', '16:00:00', '体育馆', 0, 30, 0, 'https://example.com/basketball.jpg'),
                ('志愿者服务', '志愿服务', '志愿者,服务,公益', '2024-01-25', '09:00:00', '社区中心', 0, 20, 0, 'https://example.com/volunteer.jpg'),
            ]
            
            for activity in activities_data:
                await session.execute(text("""
                    INSERT IGNORE INTO activities (title, category, tags, date, time, location, registered, capacity, likes, image)
                    VALUES (:title, :category, :tags, :date, :time, :location, :registered, :capacity, :likes, :image)
                """), {
                    "title": activity[0],
                    "category": activity[1],
                    "tags": activity[2],
                    "date": activity[3],
                    "time": activity[4],
                    "location": activity[5],
                    "registered": activity[6],
                    "capacity": activity[7],
                    "likes": activity[8],
                    "image": activity[9]
                })
            
            await session.commit()
            print("测试数据插入成功！")
            
        except Exception as e:
            await session.rollback()
            print(f"插入测试数据时出错: {e}")

async def main():
    print("开始初始化数据库...")
    await create_tables()
    await insert_test_data()
    print("数据库初始化完成！")

if __name__ == "__main__":
    asyncio.run(main()) 