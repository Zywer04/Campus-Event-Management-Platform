你需要设计这样一个数据库后端系统。有如下几张表：

# 活动表
| 字段名       | 类型        | 含义说明         |
|--------------|-------------|------------------|
| id           | number      | 活动 ID          |
| title        | string      | 活动标题         |
| applytime | string | 申请时间（申请活动提交时，把时间戳传过去）|
| category     | string      | 活动类别   （固定为学术讲座、文体活动、志愿服务、职业发展、兴趣培养中的一个） |
| tags         | string[]    | 活动标签列表     |
| date         | string      | 举办起始日期         |
| endDate         | string      | 举办结束日期         |
| startTime         | string      | 举办开始时间         |
| endTime         | string      | 举办开始时间         |
| location     | string      | 活动地点         |
| registered   | number      | 已报名人数       |
| capacity     | number      | 最大人数容量     |
| likes        | number      | 评分，总星数/总人数        |
| image        | string      | 图片链接         |
| description  | string      | 活动描述         |
| organizer    | string      | 活动负责人姓名       |
| contact      | string      | 活动负责人联系方式       |
| contact      | string      | 联系方式         |
| requirements | string      | 参与要求（可选） |
| club      |  string  | 申请社团/单位       |
| registrationDeadline |string | 报名截止时间 |
| activitySummary   |  string  | 活动简介     |
| activityGoals     |  string  | 活动目标     |
| activityProcess    | string  | 活动流程     |
| notes             |  string  | 备注         |
|status1 | string | 审核状态1（all、pending、approved、rejected）   | 
|status2 | string | 审核状态2（报名中、审核中、已结束、未开始、已驳回）| 
|statusColor|string| 审核状态2对应颜色（green、yellow、gray、blue、red） 报名中-绿色、审核中、黄色.....|


# 社团表
| 字段名   | 含义   |
|----------|--------|
| username | 社团id |
| name     | 社团名 |


# 登录表

| 字段名   | 含义   |
|----------|--------|
| username | 账号   |
| password | 密码   |
| role     | 权限   |


# 个人报名表（报名活动、学生信息）报名成功后，
                                    
| 字段名  |类型 | 含义   |   
|---------|----|--------|
| username | string |账号    |
|id      | number |参与过的活动id |


首先思考，这个数据库还有什么需要完善的地方吗？
然后你需要建立数据库、设计以上表的 MySQL 建表语句。




user: get_all_activities() -> all_activity_info

club_admin: create_activity(access_token, activity_data) -> activity_id
    admin: status = "approved"
    club_admin: status = "pending"
 
club_admin: modify_activity(access_token, activity_id, activity_data)
    token = admin -> all access
    token = club_admin -> activity in this club (managing club)

club_admin: delete_activity(access_token, activity_id)
    token = admin -> all access
    token = club_admin -> activity in this club (managing club)

user: query_registered_activities(access_token) -> registered_activity_info (filtered by user)

user: update_likes(activity_id)

club_admin: get_activity_statistic(access_token) -> total_activity_num, total_registered_num, avg_likes, json: {activity_category: activity_num}
    token = admin -> all access
    token = club_admin -> activity in this club (managing club)

admin: update_activity_status(access_token, activity_id, status)

club_admin: query_managing_activities(access_token)

user: register_activity(access_token, activity_id)