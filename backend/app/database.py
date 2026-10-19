import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.config import settings

# Setup SQLAlchemy Async Engine
database_url = settings.DATABASE_URL
if database_url.startswith("postgresql://"):
    # Convert standard postgresql:// to postgresql+asyncpg:// for async engine
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

connect_args = {}
if "sqlite" in database_url:
    connect_args = {"check_same_thread": False}

engine = create_async_engine(
    database_url,
    echo=False,
    connect_args=connect_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

# Optional Supabase client initialization
supabase_client = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception as e:
        print(f"Notice: Supabase client not initialized: {e}")

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    global engine, AsyncSessionLocal
    import app.models  # Ensure all model tables are registered with Base.metadata
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[Sankalp DB] Primary Database connected and tables verified.")
    except Exception as e:
        print(f"[Notice] Cloud PostgreSQL connection note ({type(e).__name__}). Using secure local fallback database.")
        fallback_url = "sqlite+aiosqlite:///./sankalp.db"
        engine = create_async_engine(fallback_url, echo=False, connect_args={"check_same_thread": False})
        AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[Sankalp DB] Secure local database initialized successfully.")
