from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from affiliate_hub.config.settings import settings
from affiliate_hub.config.logging import setup_logger

logger = setup_logger('database_connection')

logger.info(f"Connecting to database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")

# Create engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

# Create session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
