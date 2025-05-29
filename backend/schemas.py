from pydantic import BaseModel

class ActivityBase(BaseModel):
    title: str
    category: str
    tags: str
    date: str
    time: str
    location: str
    registered: int
    capacity: int
    likes: int
    image: str

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int

    class Config:
        orm_mode = True
