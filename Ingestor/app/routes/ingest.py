from fastapi import APIRouter, UploadFile, Form
from services import parser, chunker, embedder, qdrant
import logging

logging.basicConfig(level=logging.INFO)

router = APIRouter()


@router.post("/ingest")
async def ingest(file: UploadFile, tenant_id: str = Form(...), doc_title: str = Form(...), middleware_id: str = Form(...)):
    try:
        # 1. Extract raw text
        raw_text = await parser.extract_text(file)

        logging.info("raw_text extracted")

        # 2. Chunk into token-aware segments
        chunks = chunker.chunk_text(raw_text)

        logging.info(f"{len(chunks)} chunks extracted")

        # 3. Embed each chunk
        vectors = embedder.embed(chunks, "document")

        logging.info(f"{len(vectors)} vectors extracted")

        # 4. Store in Qdrant with metadata
        qdrant.upsert(vectors, tenant_id=tenant_id, doc_title=doc_title, middleware_id=middleware_id)

        logging.info("qdrant part done")

        return {"status": "ok", "chunks": len(chunks)}

    except Exception as e:
        return {"status": "error", "detail": str(e)}