from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import httpx
from services.embedder import embed
from services.qdrant import search_similar_chunks
import logging
from pydantic import BaseModel
import json
import os

class ChatRequest(BaseModel):
    question: str
    tenantId: str

logging.basicConfig(level=logging.INFO)

router = APIRouter()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")

@router.post("/chat")

async def chat(request: ChatRequest):
    question = request.question
    tenant_id = request.tenantId

    logging.info(f"Tenant ID: {tenant_id} - Question: {question}")

    # Step 1: Embed the question
    question_vector = embed([question])[0]["vector"]

    logging.info("# Step 1: Embed the question - done")
    logging.info(f"length: {len(question_vector)}")
    logging.info(f"first 10 items: {question_vector[:10]}")

    # Step 2: Query Qdrant for relevant chunks
    top_chunks = search_similar_chunks(
        tenant=tenant_id,
        query_vector=question_vector,
        top_k=4
    )

    logging.info("# Step 2: Query Qdrant for relevant chunks - done")

    # Step 3: Construct context
    context_text = "\n".join([
        p.payload["text"]
        for p in top_chunks.points
        if p.payload and "text" in p.payload
    ])

    logging.info("# Step 3: Construct context - done")

    # Step 4: Build prompt
    prompt = [
        {"role": "system",
         "content": "You are an assistant for answering questions about German construction laws. Use only the provided context."},
        {"role": "user", "content": f"Context:\n{context_text}\n\nQuestion: {question}"}
    ]

    logging.info("# Step 4: Build prompt - done")

    async def stream():
        payload = {
            "model": "phi",
            "stream": True,
            "messages": prompt
        }
        buffer = ""
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", OLLAMA_URL, json=payload) as response:
                async for line in response.aiter_lines():
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line.removeprefix("data:").strip())
                        content = data.get("message", {}).get("content", "")
                        if content:
                            buffer += content
                            # Stream back data with SSE formatting
                            if any(buffer.endswith(c) for c in [" ", ".", ",", "!", "?"]):
                                yield f"data: {buffer.strip()}\n\n"
                                buffer = ""  # Reset buffer
                    except json.JSONDecodeError as e:
                        logging.warning(f"JSON decode error: {e} — line was: {line}")
                        continue
        # Send leftover buffer at end
        if buffer.strip():
            yield f"data: {buffer.strip()}\n\n"

    logging.info("Returning streamed data")

    return StreamingResponse(stream(), media_type="text/event-stream")
