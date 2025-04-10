# file: combined_main.py
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from my_rag_app.main import app as rag_app
from predictive_backend.app.main import app as predictive_app

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

combined_app = FastAPI(
    title="Unified Clinical Platform",
    description="Single service hosting the RAG chatbot + Predictive Analytics",
    version="1.0.0",
)

combined_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

combined_app.mount("/rag", rag_app)
combined_app.mount("/predictive", predictive_app)

@combined_app.get("/")
def root_check():
    logger.info("[/] Root check endpoint called.")
    return {
        "message": "Unified service for RAG + Predictive Analytics",
        "rag_docs": "/rag/docs",
        "predictive_docs": "/predictive/docs",
    }
