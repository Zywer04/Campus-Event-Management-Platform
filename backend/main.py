"""
Campus Club Activity Management System – FastAPI backend
Author: ChatGPT
Date: 2025-06-17

▶ 运行步骤
    pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic[dotenv] python-multipart passlib[bcrypt] 
    uvicorn main:app --reload

数据库: 参见 docs / schema.sql (已由题目给出)
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict

from fastapi import FastAPI, HTTPException, Depends, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseSettings, BaseModel, Field, constr
from sqlalchemy import (Column, String, DateTime, Enum, Integer, BigInteger, Text,
                        ForeignKey, Date, Time, create_engine, func)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, Session

# ============================
# Settings & JWT Config
# ============================
class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:1234Qwer,@142.171.42.174:3306/campus_events"
    JWT_SECRET: str = "fuck_the_software_engineering_class"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 day

    class Config:
        env_file = ".env"

settings = Settings()

# ============================
# Database
# ============================
Base = declarative_base()
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================
# Auth helpers
# ============================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None or role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"username": username, "role": role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

# ============================
# ORM Models
# ============================

class User(Base):
    __tablename__ = "users"
    username = Column(String(64), primary_key=True, index=True)
    password_hash = Column(String(60), nullable=False)
    role = Column(Enum("student", "club", "admin"), default="student", nullable=False)
    name = Column(String(128))
    created_at = Column(DateTime, server_default=func.now())

    activities = relationship("Activity", back_populates="club", foreign_keys="Activity.club_username")


class Club(Base):
    __tablename__ = "clubs"
    username = Column(String(64), ForeignKey("users.username", ondelete="CASCADE"), primary_key=True)
    intro = Column(Text)
    user = relationship("User")


class Activity(Base):
    __tablename__ = "activities"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    apply_time = Column(DateTime, nullable=False)
    category = Column(Enum("学术讲座", "文体活动", "志愿服务", "职业发展", "兴趣培养"), nullable=False)
    date_start = Column(Date, nullable=False)
    date_end = Column(Date, nullable=False)
    time_start = Column(Time, nullable=False)
    time_end = Column(Time, nullable=False)
    location = Column(String(255), nullable=False)
    registered = Column(Integer, default=0)
    capacity = Column(Integer, nullable=False)
    rating_total = Column(Integer, default=0)
    rating_count = Column(Integer, default=0)
    image_url = Column(String(255))
    description = Column(Text)
    organizer = Column(String(64), ForeignKey("users.username"))
    organizer_contact = Column(String(64))
    club_username = Column(String(64), ForeignKey("clubs.username"))
    requirements = Column(Text)
    registration_deadline = Column(DateTime, nullable=False)
    activity_summary = Column(Text)
    activity_goals = Column(Text)
    activity_process = Column(Text)
    notes = Column(Text)
    status = Column(Enum("报名中", "审核中", "已结束", "未开始", "已驳回"), default="审核中", nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    club = relationship("Club", back_populates="activities")
    registrations = relationship("ActivityRegistration", back_populates="activity")


class ActivityRegistration(Base):
    __tablename__ = "activity_registrations"
    activity_id = Column(BigInteger, ForeignKey("activities.id", ondelete="CASCADE"), primary_key=True)
    username = Column(String(64), ForeignKey("users.username", ondelete="CASCADE"), primary_key=True)
    registered_at = Column(DateTime, server_default=func.now())

    activity = relationship("Activity", back_populates="registrations")
    user = relationship("User")

# ============================
# Pydantic Schemas
# ============================

class TokenData(BaseModel):
    username: str
    role: str


class ActivityBase(BaseModel):
    title: str
    category: str
    date_start: datetime
    date_end: datetime
    time_start: str
    time_end: str
    location: str
    capacity: int
    image_url: Optional[str] = None
    description: Optional[str] = None
    organizer_contact: Optional[str] = None
    requirements: Optional[str] = None
    registration_deadline: datetime
    activity_summary: Optional[str] = None
    activity_goals: Optional[str] = None
    activity_process: Optional[str] = None
    notes: Optional[str] = None


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str]
    category: Optional[str]
    date_start: Optional[datetime]
    date_end: Optional[datetime]
    time_start: Optional[str]
    time_end: Optional[str]
    location: Optional[str]
    capacity: Optional[int]
    image_url: Optional[str]
    description: Optional[str]
    organizer_contact: Optional[str]
    requirements: Optional[str]
    registration_deadline: Optional[datetime]
    activity_summary: Optional[str]
    activity_goals: Optional[str]
    activity_process: Optional[str]
    notes: Optional[str]


class ActivityOut(ActivityBase):
    id: int
    registered: int
    rating_total: int
    rating_count: int
    status: str

    class Config:
        orm_mode = True


class StatOut(BaseModel):
    total_activity_num: int
    total_registered_num: int
    avg_likes: float
    category_breakdown: Dict[str, int]

# ============================
# FastAPI Application
# ============================

app = FastAPI(title="Campus Activity Backend", openapi_url="/api/openapi.json")


# --------------------------------------------------
# Utility permissions
# --------------------------------------------------

def ensure_role(token_data: dict, *roles):
    if token_data["role"] not in roles:
        raise HTTPException(status_code=403, detail="Insufficient privileges")


def ensure_activity_ownership(db: Session, token_data: dict, activity_id: int):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    # Admin can do everything
    if token_data["role"] == "admin":
        return activity
    # Club can manage activities under its username
    if token_data["role"] == "club" and activity.club_username == token_data["username"]:
        return activity
    raise HTTPException(status_code=403, detail="Not authorized to manage this activity")

# --------------------------------------------------
# API endpoints
# --------------------------------------------------

@app.get("/api/get-all-activities", response_model=List[ActivityOut])
def get_all_activities(db: Session = Depends(get_db)):
    activities = db.query(Activity).all()
    return activities


@app.post("/api/create-activity", response_model=int)
def create_activity(activity: ActivityCreate, token=Depends(verify_token), db: Session = Depends(get_db)):
    ensure_role(token, "club", "admin")
    status_value = "审核中" if token["role"] == "club" else "报名中"  # admin直接通过
    new_act = Activity(
        title=activity.title,
        apply_time=datetime.utcnow(),
        category=activity.category,
        date_start=activity.date_start,
        date_end=activity.date_end,
        time_start=activity.time_start,
        time_end=activity.time_end,
        location=activity.location,
        capacity=activity.capacity,
        image_url=activity.image_url,
        description=activity.description,
        organizer=token["username"],
        organizer_contact=activity.organizer_contact,
        club_username=token["username"] if token["role"] == "club" else None,
        requirements=activity.requirements,
        registration_deadline=activity.registration_deadline,
        activity_summary=activity.activity_summary,
        activity_goals=activity.activity_goals,
        activity_process=activity.activity_process,
        notes=activity.notes,
        status=status_value,
    )
    db.add(new_act)
    db.commit()
    db.refresh(new_act)
    return new_act.id


@app.put("/api/modify-activity/{activity_id}")
def modify_activity(activity_id: int, activity_update: ActivityUpdate, token=Depends(verify_token), db: Session = Depends(get_db)):
    activity = ensure_activity_ownership(db, token, activity_id)
    for field, value in activity_update.dict(exclude_unset=True).items():
        setattr(activity, field, value)
    activity.updated_at = datetime.utcnow()
    db.commit()
    return {"status": "succeeded"}


@app.delete("/api/delete-activity/{activity_id}")
def delete_activity(activity_id: int, token=Depends(verify_token), db: Session = Depends(get_db)):
    activity = ensure_activity_ownership(db, token, activity_id)
    db.delete(activity)
    db.commit()
    return {"status": "succeeded"}


@app.get("/api/query-registered-activities", response_model=List[ActivityOut])
def query_registered_activities(token=Depends(verify_token), db: Session = Depends(get_db)):
    ensure_role(token, "student", "club", "admin")
    q = (
        db.query(Activity)
        .join(ActivityRegistration)
        .filter(ActivityRegistration.username == token["username"])
    )
    return q.all()


@app.post("/api/update-likes/{activity_id}")
def update_likes(activity_id: int, token=Depends(verify_token), db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    # 简单起见：每次请求 +1 星，实际可接收 stars 参数
    activity.rating_total += 1
    activity.rating_count += 1
    db.commit()
    return {"status": "succeeded"}


@app.get("/api/get-activity-statistic", response_model=StatOut)
def get_activity_statistic(token=Depends(verify_token), db: Session = Depends(get_db)):
    ensure_role(token, "club", "admin")
    base_query = db.query(Activity)
    if token["role"] == "club":
        base_query = base_query.filter(Activity.club_username == token["username"])

    total_activity_num = base_query.count()
    total_registered_num = db.query(func.sum(Activity.registered)).filter(base_query.subquery().c.id == Activity.id).scalar() or 0
    rating_aggregate = db.query(func.sum(Activity.rating_total), func.sum(Activity.rating_count)).filter(base_query.subquery().c.id == Activity.id).first()
    avg_likes = 0.0
    if rating_aggregate[1]:
        avg_likes = rating_aggregate[0] / rating_aggregate[1]

    # category breakdown
    categories = db.query(Activity.category, func.count(Activity.id)).filter(base_query.subquery().c.id == Activity.id).group_by(Activity.category).all()
    category_breakdown = {c[0]: c[1] for c in categories}

    return StatOut(
        total_activity_num=total_activity_num,
        total_registered_num=total_registered_num,
        avg_likes=round(avg_likes, 2),
        category_breakdown=category_breakdown,
    )


@app.patch("/api/update-activity-status/{activity_id}")
def update_activity_status(activity_id: int, status_value: str = Field(..., alias="status"), token=Depends(verify_token), db: Session = Depends(get_db)):
    ensure_role(token, "admin")
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    activity.status = status_value
    db.commit()
    return {"status": "succeeded"}


@app.get("/api/query-managed-activities", response_model=List[ActivityOut])

def query_managed_activities(token=Depends(verify_token), db: Session = Depends(get_db)):
    ensure_role(token, "club", "admin")
    query = db.query(Activity)
    if token["role"] == "club":
        query = query.filter(Activity.club_username == token["username"])
    return query.all()


@app.post("/api/register-activity/{activity_id}")
def register_activity(activity_id: int, token=Depends(verify_token), db: Session = Depends(get_db)):
    ensure_role(token, "student")
    # 检查是否已报名
    exists = db.query(ActivityRegistration).filter_by(activity_id=activity_id, username=token["username"]).first()
    if exists:
        raise HTTPException(status_code=400, detail="Already registered")

    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    if activity.registered >= activity.capacity:
        raise HTTPException(status_code=400, detail="Activity full")

    reg = ActivityRegistration(activity_id=activity_id, username=token["username"])
    db.add(reg)
    db.commit()
    return {"status": "succeeded"}

# ----------------------------
# Initialize tables (dev only)
# ----------------------------
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
