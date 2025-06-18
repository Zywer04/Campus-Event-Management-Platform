#!/usr/bin/env python3
"""
测试社团申报活动和管理员审核功能
"""

import requests
import json
from datetime import datetime, timedelta

# API基础URL
BASE_URL = "http://localhost:8000"

def test_club_activity_flow():
    """测试完整的社团活动申报和审核流程"""
    print("=== 开始测试社团活动申报和审核流程 ===")
    
    # 1. 注册社团账号
    print("\n1. 注册社团账号...")
    club_data = {
        "username": "test_club_001",
        "password": "123456",
        "role": "club",
        "name": "测试社团001",
        "intro": "这是一个测试社团"
    }
    
    response = requests.post(f"{BASE_URL}/api/register", json=club_data)
    if response.status_code != 200:
        print(f"注册社团失败: {response.text}")
        return False
    
    club_token = response.json()["access_token"]
    print(f"社团注册成功，Token: {club_token[:20]}...")
    
    # 2. 注册管理员账号
    print("\n2. 注册管理员账号...")
    admin_data = {
        "username": "test_admin_001",
        "password": "123456",
        "role": "admin",
        "name": "测试管理员001"
    }
    
    response = requests.post(f"{BASE_URL}/api/register", json=admin_data)
    if response.status_code != 200:
        print(f"注册管理员失败: {response.text}")
        return False
    
    admin_token = response.json()["access_token"]
    print(f"管理员注册成功，Token: {admin_token[:20]}...")
    
    # 3. 社团申报活动
    print("\n3. 社团申报活动...")
    now = datetime.now()
    activity_data = {
        "title": "测试活动 - 人工智能讲座",
        "category": "学术讲座",
        "date_start": (now + timedelta(days=7)).isoformat(),
        "date_end": (now + timedelta(days=7)).isoformat(),
        "time_start": "14:00",
        "time_end": "16:00",
        "location": "图书馆报告厅",
        "capacity": 100,
        "description": "这是一个测试活动，用于验证社团申报功能",
        "organizer_contact": "13800138000",
        "requirements": "对人工智能有兴趣的同学均可参加",
        "registration_deadline": (now + timedelta(days=5)).isoformat(),
        "activity_summary": "介绍人工智能的基本概念和应用",
        "activity_goals": "提高学生对AI技术的认识",
        "activity_process": "1. 开场介绍 2. 主题演讲 3. 互动讨论",
        "notes": "请提前到场签到"
    }
    
    headers = {"Authorization": f"Bearer {club_token}"}
    response = requests.post(f"{BASE_URL}/api/create-activity", json=activity_data, headers=headers)
    if response.status_code != 200:
        print(f"申报活动失败: {response.text}")
        return False
    
    activity_id = response.json()
    print(f"活动申报成功！活动ID: {activity_id}")
    
    # 4. 管理员查看待审核活动
    print("\n4. 管理员查看待审核活动...")
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.get(f"{BASE_URL}/api/get-pending-activities", headers=headers)
    if response.status_code != 200:
        print(f"获取待审核活动失败: {response.text}")
        return False
    
    pending_activities = response.json()
    print(f"待审核活动数量: {len(pending_activities)}")
    
    if len(pending_activities) == 0:
        print("❌ 没有找到待审核活动！")
        return False
    
    # 查找刚创建的活动
    target_activity = None
    for activity in pending_activities:
        if activity["title"] == "测试活动 - 人工智能讲座":
            target_activity = activity
            break
    
    if not target_activity:
        print("❌ 没有找到刚创建的活动！")
        print("所有待审核活动:")
        for activity in pending_activities:
            print(f"  - {activity['title']} (状态: {activity['status']})")
        return False
    
    print(f"✅ 找到刚创建的活动: {target_activity['title']} (状态: {target_activity['status']})")
    
    # 5. 管理员审核通过活动
    print("\n5. 管理员审核通过活动...")
    response = requests.patch(
        f"{BASE_URL}/api/update-activity-status/{activity_id}", 
        json={"status": "报名中"}, 
        headers=headers
    )
    if response.status_code != 200:
        print(f"审核通过失败: {response.text}")
        return False
    
    print("✅ 活动审核通过成功！")
    
    # 6. 再次查看待审核活动，确认数量减少
    print("\n6. 再次查看待审核活动...")
    response = requests.get(f"{BASE_URL}/api/get-pending-activities", headers=headers)
    if response.status_code != 200:
        print(f"获取待审核活动失败: {response.text}")
        return False
    
    pending_activities_after = response.json()
    print(f"审核后待审核活动数量: {len(pending_activities_after)}")
    
    if len(pending_activities_after) < len(pending_activities):
        print("✅ 待审核活动数量正确减少！")
    else:
        print("❌ 待审核活动数量没有减少！")
        return False
    
    # 7. 社团查看自己的活动
    print("\n7. 社团查看自己的活动...")
    headers = {"Authorization": f"Bearer {club_token}"}
    response = requests.get(f"{BASE_URL}/api/query-managed-activities", headers=headers)
    if response.status_code != 200:
        print(f"获取社团活动失败: {response.text}")
        return False
    
    club_activities = response.json()
    print(f"社团活动数量: {len(club_activities)}")
    
    # 查找刚审核通过的活动
    approved_activity = None
    for activity in club_activities:
        if activity["title"] == "测试活动 - 人工智能讲座":
            approved_activity = activity
            break
    
    if approved_activity and approved_activity["status"] == "报名中":
        print("✅ 社团可以看到审核通过的活动！")
    else:
        print("❌ 社团无法看到审核通过的活动！")
        return False
    
    print("\n=== 测试完成！所有功能正常 ===")
    return True

def test_database_connection():
    """测试数据库连接"""
    print("=== 测试数据库连接 ===")
    try:
        response = requests.get(f"{BASE_URL}/api/get-all-activities")
        if response.status_code == 200:
            activities = response.json()
            print(f"✅ 数据库连接正常，当前活动总数: {len(activities)}")
            return True
        else:
            print(f"❌ 数据库连接失败: {response.text}")
            return False
    except Exception as e:
        print(f"❌ 数据库连接异常: {e}")
        return False

def main():
    """主测试函数"""
    print("开始测试社团申报活动和审核功能...")
    
    # 首先测试数据库连接
    if not test_database_connection():
        print("数据库连接失败，无法继续测试")
        return
    
    # 测试完整流程
    if test_club_activity_flow():
        print("\n🎉 所有测试通过！")
    else:
        print("\n❌ 测试失败！")

if __name__ == "__main__":
    main() 