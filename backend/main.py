from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models  # noqa: F401 - ensures models are registered before create_all
from routers import auth, loans, analysis, letters

# Create all tables on startup (fine for SQLite/dev; use Alembic migrations for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Powered Debt Relief & Financial Recovery Platform",
    description="API for financial health analysis, settlement prediction, and AI negotiation letters.",
    version="1.0.0",
)

# Allow the Vite dev server (and any origin in dev) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(loans.router)
app.include_router(analysis.router)
app.include_router(letters.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Debt Relief Platform API is running"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
