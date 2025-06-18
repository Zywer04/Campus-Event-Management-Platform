#!/usr/bin/env python3
"""
调试脚本：检查数据库中的活动数据
"""

import requests
import json

# API基础URL
BASE_URL = "http://localhost:8000"

def check_all_activities():
    """检查所有活动"""
    print("=== 检查所有活动 ===")
    try:
        response = requests.get(f"{BASE_URL}/api/get-all-activities")
        if response.status_code == 200:
            activities = response.json()
            print(f"总活动数: {len(activities)}")
            
            if len(activities) == 0:
                print("❌ 数据库中没有活动数据")
                return
            
            # 按状态统计
            status_count = {}
            for activity in activities:
                status = activity.get('status', '未知')
                status_count[status] = status_count.get(status, 0) + 1
            
            print("\n按状态统计:")
            for status, count in status_count.items():
                print(f"  {status}: {count}")
            
            print("\n所有活动详情:")
            for i, activity in enumerate(activities, 1):
                print(f"{i}. {activity['title']} (状态: {activity['status']}, 组织者: {activity.get('organizer', 'N/A')})")
                
        else:
            print(f"❌ 获取活动失败: {response.text}")
    except Exception as e:
        print(f"❌ 异常: {e}")

def get_admin_token():
    """获取管理员token，如果账号不存在则注册，否则登录"""
    admin_data = {
        "username": "debug_admin",
        "password": "123456",
        "role": "admin",
        "name": "调试管理员"
    }
    
    try:
        # 先尝试注册
        response = requests.post(f"{BASE_URL}/api/register", json=admin_data)
        if response.status_code == 200:
            admin_token = response.json()["access_token"]
            print("✅ 管理员注册成功")
            return admin_token
        elif "Username already exists" in response.text:
            # 账号已存在，尝试登录
            login_data = {
                "username": "debug_admin",
                "password": "123456"
            }
            response = requests.post(f"{BASE_URL}/api/login", json=login_data)
            if response.status_code == 200:
                admin_token = response.json()["access_token"]
                print("✅ 管理员登录成功")
                return admin_token
            else:
                print(f"❌ 管理员登录失败: {response.text}")
                return None
        else:
            print(f"❌ 管理员注册失败: {response.text}")
            return None
    except Exception as e:
        print(f"❌ 获取管理员token异常: {e}")
        return None

def check_pending_activities():
    """检查待审核活动（需要管理员权限）"""
    print("\n=== 检查待审核活动 ===")
    
    # 获取管理员token
    admin_token = get_admin_token()
    if not admin_token:
        print("❌ 无法获取管理员token")
        return
    
    try:
        # 获取待审核活动
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/get-pending-activities", headers=headers)
        
        if response.status_code == 200:
            pending_activities = response.json()
            print(f"待审核活动数: {len(pending_activities)}")
            
            if len(pending_activities) == 0:
                print("❌ 没有待审核活动")
            else:
                print("\n待审核活动详情:")
                for i, activity in enumerate(pending_activities, 1):
                    print(f"{i}. {activity['title']} (组织者: {activity.get('organizer', 'N/A')})")
        else:
            print(f"❌ 获取待审核活动失败: {response.text}")
            
    except Exception as e:
        print(f"❌ 异常: {e}")

def get_club_token():
    """获取社团token，如果账号不存在则注册，否则登录"""
    club_data = {
        "username": "debug_club",
        "password": "123456",
        "role": "club",
        "name": "调试社团",
        "intro": "调试用社团"
    }
    
    try:
        # 先尝试注册
        response = requests.post(f"{BASE_URL}/api/register", json=club_data)
        if response.status_code == 200:
            club_token = response.json()["access_token"]
            print("✅ 社团注册成功")
            return club_token
        elif "Username already exists" in response.text:
            # 账号已存在，尝试登录
            login_data = {
                "username": "debug_club",
                "password": "123456"
            }
            response = requests.post(f"{BASE_URL}/api/login", json=login_data)
            if response.status_code == 200:
                club_token = response.json()["access_token"]
                print("✅ 社团登录成功")
                return club_token
            else:
                print(f"❌ 社团登录失败: {response.text}")
                return None
        else:
            print(f"❌ 社团注册失败: {response.text}")
            return None
    except Exception as e:
        print(f"❌ 获取社团token异常: {e}")
        return None

def create_test_activity():
    """创建一个测试活动"""
    print("\n=== 创建测试活动 ===")
    
    # 获取社团token
    club_token = get_club_token()
    if not club_token:
        print("❌ 无法获取社团token")
        return
    
    try:
        # 创建活动
        from datetime import datetime, timedelta
        now = datetime.now()
        activity_data = {
            "title": "调试活动 - 测试讲座",
            "category": "学术讲座",
            "date_start": (now + timedelta(days=7)).isoformat(),
            "date_end": (now + timedelta(days=7)).isoformat(),
            "time_start": "14:00",
            "time_end": "16:00",
            "location": "调试教室",
            "capacity": 50,
            "description": "这是一个调试用的测试活动",
            "organizer_contact": "13800138000",
            "requirements": "无特殊要求",
            "registration_deadline": (now + timedelta(days=5)).isoformat(),
            "activity_summary": "调试活动摘要",
            "activity_goals": "调试活动目标",
            "activity_process": "调试活动流程",
            "notes": "调试活动备注"
        }
        
        headers = {"Authorization": f"Bearer {club_token}"}
        response = requests.post(f"{BASE_URL}/api/create-activity", json=activity_data, headers=headers)
        
        if response.status_code == 200:
            activity_id = response.json()
            print(f"✅ 测试活动创建成功！活动ID: {activity_id}")
        else:
            print(f"❌ 创建活动失败: {response.text}")
            
    except Exception as e:
        print(f"❌ 异常: {e}")

def test_audit_flow():
    """测试完整的审核流程"""
    print("\n=== 测试完整审核流程 ===")
    
    # 获取管理员token
    admin_token = get_admin_token()
    if not admin_token:
        print("❌ 无法获取管理员token")
        return
    
    try:
        # 获取待审核活动
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/get-pending-activities", headers=headers)
        
        if response.status_code == 200:
            pending_activities = response.json()
            print(f"待审核活动数: {len(pending_activities)}")
            
            if len(pending_activities) == 0:
                print("❌ 没有待审核活动，无法测试审核流程")
                return
            
            # 选择第一个活动进行审核
            target_activity = pending_activities[0]
            activity_id = target_activity['id']
            activity_title = target_activity['title']
            
            print(f"选择活动进行审核: {activity_title} (ID: {activity_id})")
            
            # 审核通过
            response = requests.patch(
                f"{BASE_URL}/api/update-activity-status/{activity_id}", 
                json={"status": "报名中"}, 
                headers=headers
            )
            
            if response.status_code == 200:
                print("✅ 活动审核通过成功！")
                
                # 再次检查待审核活动数量
                response = requests.get(f"{BASE_URL}/api/get-pending-activities", headers=headers)
                if response.status_code == 200:
                    pending_activities_after = response.json()
                    print(f"审核后待审核活动数: {len(pending_activities_after)}")
                    
                    if len(pending_activities_after) < len(pending_activities):
                        print("✅ 审核流程测试成功！")
                    else:
                        print("❌ 审核后待审核活动数量没有减少")
                else:
                    print(f"❌ 获取审核后活动失败: {response.text}")
            else:
                print(f"❌ 审核失败: {response.text}")
        else:
            print(f"❌ 获取待审核活动失败: {response.text}")
            
    except Exception as e:
        print(f"❌ 审核流程测试异常: {e}")

def main():
    """主函数"""
    print("开始调试活动数据...")
    
    # 1. 检查所有活动
    check_all_activities()
    
    # 2. 检查待审核活动
    check_pending_activities()
    
    # 3. 如果没有活动，创建一个测试活动
    print("\n是否要创建一个测试活动？(y/n): ", end="")
    choice = input().strip().lower()
    if choice == 'y':
        create_test_activity()
        print("\n创建完成后，再次检查:")
        check_all_activities()
        check_pending_activities()
    
    # 4. 测试审核流程
    print("\n是否要测试审核流程？(y/n): ", end="")
    choice = input().strip().lower()
    if choice == 'y':
        test_audit_flow()

if __name__ == "__main__":
    main() 