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

INSERT INTO users (username, password_hash, role, name)
VALUES ('admin', '$2b$12$VO0pX2bS.7KJwtvxk3W6qOoyx.n6bW.TchyFjbVlyaincENHSS/Z2', 'admin', '管理员');