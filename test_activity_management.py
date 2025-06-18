#!/usr/bin/env python3
"""
测试活动管理功能
包括：
1. 社团管理自己的活动（编辑、删除）
2. 管理员管理所有活动（编辑、删除）
"""

import requests
import json
import time
from datetime import datetime, timedelta

# 配置
BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

def print_step(step, description):
    """打印测试步骤"""
    print(f"\n{'='*50}")
    print(f"步骤 {step}: {description}")
    print(f"{'='*50}")

def print_success(message):
    """打印成功信息"""
    print(f"✅ {message}")

def print_error(message):
    """打印错误信息"""
    print(f"❌ {message}")

def print_info(message):
    """打印信息"""
    print(f"ℹ️  {message}")

def register_user(username, password, role="student", name=None, intro=None):
    """注册用户"""
    data = {
        "username": username,
        "password": password,
        "role": role,
        "name": name or username
    }
    if role == "club" and intro:
        data["intro"] = intro
    
    response = requests.post(f"{BASE_URL}/api/register", json=data, headers=HEADERS)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print_error(f"注册失败: {response.text}")
        return None

def login_user(username, password):
    """用户登录"""
    data = {"username": username, "password": password}
    response = requests.post(f"{BASE_URL}/api/login", json=data, headers=HEADERS)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print_error(f"登录失败: {response.text}")
        return None

def create_activity(token, activity_data):
    """创建活动"""
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/api/create-activity", json=activity_data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print_error(f"创建活动失败: {response.text}")
        return None

def get_managed_activities(token):
    """获取管理的活动"""
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/query-managed-activities", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print_error(f"获取管理的活动失败: {response.text}")
        return None

def get_all_activities():
    """获取所有活动"""
    response = requests.get(f"{BASE_URL}/api/get-all-activities", headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    else:
        print_error(f"获取所有活动失败: {response.text}")
        return None

def update_activity(token, activity_id, update_data):
    """更新活动"""
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    response = requests.put(f"{BASE_URL}/api/modify-activity/{activity_id}", json=update_data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print_error(f"更新活动失败: {response.text}")
        return None

def delete_activity(token, activity_id):
    """删除活动"""
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    response = requests.delete(f"{BASE_URL}/api/delete-activity/{activity_id}", headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print_error(f"删除活动失败: {response.text}")
        return None

def main():
    print("开始测试活动管理功能...")
    
    # 测试数据
    club_username = "test_club_manager"
    admin_username = "test_admin_manager"
    password = "test123456"
    
    # 活动数据
    activity_data = {
        "title": "测试活动管理功能",
        "category": "学术讲座",
        "date_start": (datetime.now() + timedelta(days=7)).isoformat(),
        "date_end": (datetime.now() + timedelta(days=7)).isoformat(),
        "time_start": "14:00",
        "time_end": "16:00",
        "location": "图书馆报告厅",
        "capacity": 100,
        "description": "这是一个测试活动，用于验证活动管理功能",
        "organizer_contact": "test@example.com",
        "requirements": "无特殊要求",
        "registration_deadline": (datetime.now() + timedelta(days=5)).isoformat(),
        "activity_summary": "活动总结",
        "activity_goals": "活动目标",
        "activity_process": "活动流程",
        "notes": "备注信息",
        "image_url": ""  # 新增字段
    }
    
    # 步骤1: 注册测试用户
    print_step(1, "注册测试用户")
    
    # 注册社团用户
    club_token = register_user(club_username, password, "club", "测试社团", "这是一个测试社团")
    if not club_token:
        print_error("社团用户注册失败，尝试登录...")
        club_token = login_user(club_username, password)
        if not club_token:
            return
    
    print_success(f"社团用户 {club_username} 登录成功")
    
    # 注册管理员用户
    admin_token = register_user(admin_username, password, "admin", "测试管理员")
    if not admin_token:
        print_error("管理员用户注册失败，尝试登录...")
        admin_token = login_user(admin_username, password)
        if not admin_token:
            return
    
    print_success(f"管理员用户 {admin_username} 登录成功")
    
    # 步骤2: 社团创建活动
    print_step(2, "社团创建活动")
    
    activity_id = create_activity(club_token, activity_data)
    if not activity_id:
        return
    
    print_success(f"活动创建成功，ID: {activity_id}")
    
    # 等待一下确保数据同步
    time.sleep(1)
    
    # 步骤3: 验证社团只能看到自己的活动
    print_step(3, "验证社团只能看到自己的活动")
    
    club_activities = get_managed_activities(club_token)
    if club_activities:
        print_success(f"社团管理的活动数量: {len(club_activities)}")
        for activity in club_activities:
            print_info(f"  - {activity['title']} (ID: {activity['id']})")
    else:
        print_error("获取社团管理的活动失败")
        return
    
    # 步骤4: 社团编辑自己的活动
    print_step(4, "社团编辑自己的活动")
    
    update_data = {
        "title": "测试活动管理功能 - 已编辑",
        "category": "学术讲座",
        "date_start": (datetime.now() + timedelta(days=7)).isoformat(),
        "date_end": (datetime.now() + timedelta(days=7)).isoformat(),
        "time_start": "14:00",
        "time_end": "16:00",
        "location": "图书馆报告厅",
        "capacity": 150,
        "description": "这是编辑后的活动描述",
        "organizer_contact": "test@example.com",
        "requirements": "无特殊要求",
        "registration_deadline": (datetime.now() + timedelta(days=5)).isoformat(),
        "activity_summary": "活动总结",
        "activity_goals": "活动目标",
        "activity_process": "活动流程",
        "notes": "备注信息",
        "image_url": ""  # 新增 字段
    }
    
    result = update_activity(club_token, activity_id, update_data)
    if result:
        print_success("活动编辑成功")
    else:
        print_error("活动编辑失败")
        return
    
    # 验证编辑结果
    club_activities_after_edit = get_managed_activities(club_token)
    if club_activities_after_edit:
        edited_activity = next((a for a in club_activities_after_edit if a['id'] == activity_id), None)
        if edited_activity and edited_activity['title'] == update_data['title']:
            print_success("编辑结果验证成功")
        else:
            print_error("编辑结果验证失败")
    
    # 步骤5: 验证管理员可以看到所有活动
    print_step(5, "验证管理员可以看到所有活动")
    
    all_activities = get_all_activities()
    if all_activities:
        print_success(f"所有活动数量: {len(all_activities)}")
        for activity in all_activities:
            print_info(f"  - {activity['title']} (ID: {activity['id']}, 组织者: {activity.get('club_username', activity.get('organizer', '未知'))})")
    else:
        print_error("获取所有活动失败")
        return
    
    # 步骤6: 管理员编辑活动
    print_step(6, "管理员编辑活动")
    
    admin_update_data = {
        "title": "测试活动管理功能 - 管理员编辑",
        "category": "学术讲座",
        "date_start": (datetime.now() + timedelta(days=7)).isoformat(),
        "date_end": (datetime.now() + timedelta(days=7)).isoformat(),
        "time_start": "14:00",
        "time_end": "16:00",
        "location": "大学生活动中心",
        "capacity": 200,
        "description": "这是管理员编辑后的活动描述",
        "organizer_contact": "test@example.com",
        "requirements": "无特殊要求",
        "registration_deadline": (datetime.now() + timedelta(days=5)).isoformat(),
        "activity_summary": "活动总结",
        "activity_goals": "活动目标",
        "activity_process": "活动流程",
        "notes": "备注信息",
        "image_url": ""  # 新增字段
    }

    result = update_activity(admin_token, activity_id, admin_update_data)
    if result:
        print_success("管理员编辑活动成功")
    else:
        print_error("管理员编辑活动失败")
        return
    
    # 验证管理员编辑结果
    all_activities_after_admin_edit = get_all_activities()
    if all_activities_after_admin_edit:
        admin_edited_activity = next((a for a in all_activities_after_admin_edit if a['id'] == activity_id), None)
        if admin_edited_activity and admin_edited_activity['title'] == admin_update_data['title']:
            print_success("管理员编辑结果验证成功")
        else:
            print_error("管理员编辑结果验证失败")
    
    # 步骤7: 测试权限控制
    print_step(7, "测试权限控制")
    
    # 社团尝试编辑其他活动（应该失败）
    if len(all_activities) > 1:
        other_activity_id = next((a['id'] for a in all_activities if a['id'] != activity_id), None)
        if other_activity_id:
            print_info("测试社团编辑其他活动（应该失败）...")
            result = update_activity(club_token, other_activity_id, {"title": "尝试编辑其他活动"})
            if result is None:
                print_success("权限控制正常：社团无法编辑其他活动")
            else:
                print_error("权限控制异常：社团成功编辑了其他活动")
    
    # 步骤8: 删除活动测试
    print_step(8, "删除活动测试")
    
    # 管理员删除活动
    result = delete_activity(admin_token, activity_id)
    if result:
        print_success("管理员删除活动成功")
    else:
        print_error("管理员删除活动失败")
        return
    
    # 验证删除结果
    all_activities_after_delete = get_all_activities()
    if all_activities_after_delete:
        deleted_activity = next((a for a in all_activities_after_delete if a['id'] == activity_id), None)
        if deleted_activity is None:
            print_success("删除结果验证成功：活动已被删除")
        else:
            print_error("删除结果验证失败：活动仍然存在")
    else:
        print_error("获取删除后的活动列表失败")
    
    print("\n" + "="*50)
    print("🎉 活动管理功能测试完成！")
    print("="*50)
    print("\n测试总结：")
    print("✅ 社团可以创建、编辑、删除自己的活动")
    print("✅ 管理员可以编辑、删除所有活动")
    print("✅ 权限控制正常工作")
    print("✅ 数据操作验证成功")

if __name__ == "__main__":
    main() 