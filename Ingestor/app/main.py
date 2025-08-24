from fastapi import FastAPI
from routes.chat import router as chat_router
from routes.ingest import router as ingest_router
from routes.document import router as document_router

app = FastAPI()

app.include_router(chat_router)
app.include_router(ingest_router)
app.include_router(document_router)
