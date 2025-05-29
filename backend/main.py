from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

# 允许跨域请求（前后端分离必需）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 实际部署时应限制为你的前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 模拟数据库路径
DB_FILE = "database.json"

# 表单数据结构
class Registration(BaseModel):
    activity_id: int
    name: str
    studentId: str
    phone: str
    email: str
    remarks: str = ""

# 加载数据库
def load_data():
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# 保存数据库
def save_data(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.get("/activities")
def get_activities():
    return load_data()["activities"]

@app.post("/register")
def register_user(registration: Registration):
    data = load_data()
    for activity in data["activities"]:
        if activity["id"] == registration.activity_id:
            if activity["registered"] >= activity["capacity"]:
                raise HTTPException(status_code=400, detail="活动已满")
            activity["registered"] += 1
            save_data(data)
            return {"message": "报名成功"}
    raise HTTPException(status_code=404, detail="未找到对应活动")
