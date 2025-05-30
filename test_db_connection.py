import mysql.connector
from mysql.connector import Error
import os
import sys

def test_db_connection():
    # 数据库配置 - 替换为你的实际配置
    db_config = {
        'host': '142.171.42.174',
        'port': 3306,
        'user': 'user_activities',
        'password': '1234Qwer,',
        'database': 'campus_activities'
    }
    
    print("=" * 50)
    print("测试数据库连接配置:")
    print(f"主机: {db_config['host']}")
    print(f"端口: {db_config['port']}")
    print(f"用户: {db_config['user']}")
    print(f"数据库: {db_config['database']}")
    print("=" * 50)
    
    connection = None
    try:
        # 尝试建立连接
        print("尝试连接到数据库...")
        connection = mysql.connector.connect(**db_config)
        
        if connection.is_connected():
            # 获取服务器信息
            db_info = connection.get_server_info()
            print(f"成功连接到 MySQL 服务器，版本: {db_info}")
            
            # 执行简单查询
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            db_name = cursor.fetchone()[0]
            print(f"当前数据库: {db_name}")
            
            # 检查表是否存在
            cursor.execute("SHOW TABLES LIKE 'activities';")
            table_exists = cursor.fetchone()
            if table_exists:
                print("✅ activities 表存在")
                
                # 检查表结构
                cursor.execute("DESCRIBE activities;")
                columns = cursor.fetchall()
                print("\n表结构:")
                for col in columns:
                    print(f"- {col[0]}: {col[1]}")
            else:
                print("❌ activities 表不存在")
            
            return True
    
    except Error as e:
        print(f"❌ 连接错误: {e}")
        print("\n可能的原因:")
        
        if "Can't connect to MySQL server" in str(e):
            print("1. MySQL 服务未运行")
            print("2. 主机名或端口号错误")
            print("3. 防火墙阻止了连接")
            print("4. MySQL 未配置为接受远程连接")
        elif "Access denied" in str(e):
            print("1. 用户名或密码错误")
            print("2. 用户没有访问权限")
        elif "Unknown database" in str(e):
            print("1. 数据库不存在")
            print("2. 数据库名称拼写错误")
        
        return False
    
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("数据库连接已关闭")

if __name__ == "__main__":
    print("开始数据库连接测试...\n")
    success = test_db_connection()
    
    print("\n" + "=" * 50)
    if success:
        print("✅ 数据库连接测试成功！")
    else:
        print("❌ 数据库连接测试失败，请检查配置和网络设置")
    
    # 在Windows上保持窗口打开
    if sys.platform == "win32":
        input("\n按 Enter 键退出...")