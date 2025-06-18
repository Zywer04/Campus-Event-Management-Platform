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






你是后端开发工程师。我们正在设计一个校园社团活动管理系统，已经有了数据库，现在需要你开发后端。
数据库如下：
```sql
-- 建库
CREATE DATABASE IF NOT EXISTS campus_events
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campus_events;

-- 1. 账号表
CREATE TABLE users (
    username        VARCHAR(64)  NOT NULL COMMENT '登录账号 / 社团ID',
    password_hash   CHAR(60)     NOT NULL COMMENT 'bcrypt 等加密后的密码',
    role            ENUM('student','club','admin') NOT NULL DEFAULT 'student',
    name            VARCHAR(128) NULL COMMENT '真实姓名或社团名称',
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (username)
) ENGINE=InnoDB
  COMMENT '用户/社团/管理员统一账号表';

-- 2. 社团扩展信息表（可选）
CREATE TABLE clubs (
    username  VARCHAR(64) NOT NULL,
    intro     TEXT        NULL COMMENT '社团简介',
    PRIMARY KEY (username),
    CONSTRAINT fk_club_user FOREIGN KEY (username) REFERENCES users(username)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT '社团详情';

-- 3. 活动主表
CREATE TABLE activities (
    id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title                 VARCHAR(255)    NOT NULL,
    apply_time            DATETIME        NOT NULL COMMENT '申请提交时间',
    category              ENUM('学术讲座','文体活动','志愿服务','职业发展','兴趣培养') NOT NULL,
    date_start            DATE            NOT NULL,
    date_end              DATE            NOT NULL,
    time_start            TIME            NOT NULL,
    time_end              TIME            NOT NULL,
    location              VARCHAR(255)    NOT NULL,
    registered            INT UNSIGNED    NOT NULL DEFAULT 0,
    capacity              INT UNSIGNED    NOT NULL,
    rating_total          INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT '累计星数',
    rating_count          INT UNSIGNED    NOT NULL DEFAULT 0 COMMENT '打分人数',
    image_url             VARCHAR(255)    NULL,
    description           TEXT            NULL,
    organizer             VARCHAR(64)     NOT NULL COMMENT '负责人账号',
    organizer_contact     VARCHAR(64)     NULL,
    club_username         VARCHAR(64)     NULL COMMENT '申请单位/社团',
    requirements          TEXT            NULL,
    registration_deadline DATETIME        NOT NULL,
    activity_summary      TEXT            NULL,
    activity_goals        TEXT            NULL,
    activity_process      TEXT            NULL,
    notes                 TEXT            NULL,
    status               ENUM('报名中','审核中','已结束','未开始','已驳回') NOT NULL DEFAULT '审核中',
    created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_category_date (category, date_start),
    KEY idx_club          (club_username),
    CONSTRAINT fk_activity_club  FOREIGN KEY (club_username)
        REFERENCES clubs(username)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_activity_organizer FOREIGN KEY (organizer)
        REFERENCES users(username)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CHECK (date_end >= date_start),
    CHECK (time_end > time_start),
    CHECK (capacity >= 0)
) ENGINE=InnoDB
  COMMENT '校园活动主表';

-- 3a. 活动标签（多对多）
CREATE TABLE activity_tags (
    activity_id BIGINT UNSIGNED NOT NULL,
    tag         VARCHAR(64)     NOT NULL,
    PRIMARY KEY (activity_id, tag),
    CONSTRAINT fk_tag_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT '活动 ↔ 标签';

-- 3b. （可选）活动评分明细
CREATE TABLE activity_ratings (
    activity_id  BIGINT UNSIGNED NOT NULL,
    username     VARCHAR(64)     NOT NULL,
    stars        TINYINT UNSIGNED NOT NULL CHECK (stars BETWEEN 1 AND 5),
    rated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (activity_id, username),
    CONSTRAINT fk_rate_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rate_user FOREIGN KEY (username)
        REFERENCES users(username)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT '用户对活动的评分（若需要精确星级统计）';

-- 4. 报名表（个人报名）
CREATE TABLE activity_registrations (
    activity_id    BIGINT UNSIGNED NOT NULL,
    username       VARCHAR(64)     NOT NULL,
    registered_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (activity_id, username),
    KEY idx_user (username),
    CONSTRAINT fk_reg_activity FOREIGN KEY (activity_id)
        REFERENCES activities(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reg_user FOREIGN KEY (username)
        REFERENCES users(username)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  COMMENT '用户报名活动的记录';

-- 5. 触发器示例：报名成功自动回写已报名人数
DELIMITER $$
CREATE TRIGGER trg_after_registration_insert
AFTER INSERT ON activity_registrations
FOR EACH ROW
BEGIN
    UPDATE activities
    SET registered = registered + 1
    WHERE id = NEW.activity_id;
END$$
CREATE TRIGGER trg_after_registration_delete
AFTER DELETE ON activity_registrations
FOR EACH ROW
BEGIN
    UPDATE activities
    SET registered = registered - 1
    WHERE id = OLD.activity_id;
END$$
DELIMITER ;
```


你需要用 python sqlalchemy 和 fastAPI 实现如下 api 接口。接口的 url 为 api/函数名。举例：api/get-all-activities

student: get_all_activities() -> json: all_activity_info

club: create_activity(access_token, activity_data) -> activity_id
    admin: status = "approved"
    club: status = "pending"
 
club: modify_activity(access_token, activity_id, activity_data) -> successed | failed
    token_auth = admin -> all access
    token_auth = club -> activity in this club (managed club)

club: delete_activity(access_token, activity_id) -> successed | failed
    token_auth = admin -> all access
    token_auth = club -> activity in this club (managed club)

student: query_registered_activities(access_token) -> registered_activity_info (filtered by user)

student: update_likes(activity_id) -> successed | failed

club: get_activity_statistic(access_token) -> total_activity_num, total_registered_num, avg_likes, json: {activity_category: activity_num}
    token_auth = admin -> all access
    token_auth = club -> activity in this club (managing club)

admin: update_activity_status(access_token, activity_id, status) -> successed | failed

club: query_managed_activities(access_token) -> managed_activity_info

student: register_activity(access_token, activity_id) -> successed | failed
