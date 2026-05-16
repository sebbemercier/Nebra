from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine_args = {"pool_pre_ping": True}

# CockroachDB performance optimization
if "cockroachdb" in settings.database_url:
    engine_args.update({
        "connect_args": {"application_name": "nebra_api"},
    })

engine = create_engine(settings.database_url, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
