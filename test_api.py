#!/usr/bin/env python3
"""
测试社团申报活动和系统管理员审核活动的API功能
"""

import requests
import json
from datetime import datetime, timedelta

# API基础URL
BASE_URL = "http://localhost:8000"

def test_register_club():
    """测试注册社团账号"""
    print("=== 测试注册社团账号 ===")
    
    club_data = {
        "username": "test_club",
        "password": "123456",
        "role": "club",
        "name": "测试社团",
        "intro": "这是一个测试社团"
    }
    
    response = requests.post(f"{BASE_URL}/api/register", json=club_data)
    print(f"注册社团响应: {response.status_code}")
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"社团Token: {token[:20]}...")
        return token
    else:
        print(f"注册失败: {response.text}")
        return None

def test_register_admin():
    """测试注册管理员账号"""
    print("\n=== 测试注册管理员账号 ===")
    
    admin_data = {
        "username": "test_admin",
        "password": "123456",
        "role": "admin",
        "name": "测试管理员"
    }
    
    response = requests.post(f"{BASE_URL}/api/register", json=admin_data)
    print(f"注册管理员响应: {response.status_code}")
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"管理员Token: {token[:20]}...")
        return token
    else:
        print(f"注册失败: {response.text}")
        return None

def test_login_club():
    """测试社团登录"""
    print("\n=== 测试社团登录 ===")
    
    login_data = {
        "username": "test_club",
        "password": "123456"
    }
    
    response = requests.post(f"{BASE_URL}/api/login", json=login_data)
    print(f"社团登录响应: {response.status_code}")
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"社团Token: {token[:20]}...")
        return token
    else:
        print(f"登录失败: {response.text}")
        return None

def test_login_admin():
    """测试管理员登录"""
    print("\n=== 测试管理员登录 ===")
    
    login_data = {
        "username": "test_admin",
        "password": "123456"
    }
    
    response = requests.post(f"{BASE_URL}/api/login", json=login_data)
    print(f"管理员登录响应: {response.status_code}")
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"管理员Token: {token[:20]}...")
        return token
    else:
        print(f"登录失败: {response.text}")
        return None

def test_create_activity(club_token):
    """测试社团申报活动"""
    print("\n=== 测试社团申报活动 ===")
    
    # 准备活动数据
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
    print(f"申报活动响应: {response.status_code}")
    if response.status_code == 200:
        activity_id = response.json()
        print(f"活动ID: {activity_id}")
        return activity_id
    else:
        print(f"申报失败: {response.text}")
        return None

def test_get_pending_activities(admin_token):
    """测试获取待审核活动"""
    print("\n=== 测试获取待审核活动 ===")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.get(f"{BASE_URL}/api/get-all-activities", headers=headers)
    print(f"获取活动列表响应: {response.status_code}")
    if response.status_code == 200:
        activities = response.json()
        pending_activities = [a for a in activities if a["status"] == "审核中"]
        print(f"待审核活动数量: {len(pending_activities)}")
        for activity in pending_activities:
            print(f"  - {activity['title']} (ID: {activity['id']})")
        return pending_activities
    else:
        print(f"获取失败: {response.text}")
        return []

def test_approve_activity(admin_token, activity_id):
    """测试审核通过活动"""
    print(f"\n=== 测试审核通过活动 (ID: {activity_id}) ===")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.patch(f"{BASE_URL}/api/update-activity-status/{activity_id}", 
                            json={"status": "报名中"}, headers=headers)
    print(f"审核通过响应: {response.status_code}")
    if response.status_code == 200:
        print("活动审核通过成功！")
        return True
    else:
        print(f"审核失败: {response.text}")
        return False

def test_reject_activity(admin_token, activity_id):
    """测试驳回活动"""
    print(f"\n=== 测试驳回活动 (ID: {activity_id}) ===")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.patch(f"{BASE_URL}/api/update-activity-status/{activity_id}", 
                            json={"status": "已驳回"}, headers=headers)
    print(f"驳回活动响应: {response.status_code}")
    if response.status_code == 200:
        print("活动驳回成功！")
        return True
    else:
        print(f"驳回失败: {response.text}")
        return False

def test_get_managed_activities(club_token):
    """测试获取社团管理的活动"""
    print("\n=== 测试获取社团管理的活动 ===")
    
    headers = {"Authorization": f"Bearer {club_token}"}
    response = requests.get(f"{BASE_URL}/api/query-managed-activities", headers=headers)
    print(f"获取社团活动响应: {response.status_code}")
    if response.status_code == 200:
        activities = response.json()
        print(f"社团活动数量: {len(activities)}")
        for activity in activities:
            print(f"  - {activity['title']} (状态: {activity['status']})")
        return activities
    else:
        print(f"获取失败: {response.text}")
        return []

def main():
    """主测试函数"""
    print("开始测试社团申报活动和系统管理员审核活动功能...")
    
    # 1. 注册社团和管理员账号
    club_token = test_register_club()
    admin_token = test_register_admin()
    
    if not club_token or not admin_token:
        print("账号注册失败，无法继续测试")
        return
    
    # 2. 社团申报活动
    activity_id = test_create_activity(club_token)
    if not activity_id:
        print("活动申报失败，无法继续测试")
        return
    
    # 3. 管理员查看待审核活动
    pending_activities = test_get_pending_activities(admin_token)
    
    # 4. 管理员审核通过活动
    if pending_activities:
        test_approve_activity(admin_token, activity_id)
    
    # 5. 社团查看自己的活动
    test_get_managed_activities(club_token)
    
    print("\n=== 测试完成 ===")

if __name__ == "__main__":
    main() 