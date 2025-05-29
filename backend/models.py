from sqlalchemy import Column, Integer, String
from database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    tags = Column(String)
    date = Column(String)
    time = Column(String)
    location = Column(String)
    registered = Column(Integer)
    capacity = Column(Integer)
    likes = Column(Integer)
    image = Column(String)
