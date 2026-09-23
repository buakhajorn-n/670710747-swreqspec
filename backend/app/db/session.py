from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import DATABASE_URL

# Supports: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
engine = create_engine(
    DATABASE_URL,
    poolclass=StaticPool if DATABASE_URL.startswith("sqlite") else None,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    future=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
