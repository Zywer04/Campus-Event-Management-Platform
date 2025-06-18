from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "mysql+asyncmy://root:1234Qwer,@142.171.42.174:3306/campus_events"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    future=True,
)

async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

Base = declarative_base()
