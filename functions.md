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