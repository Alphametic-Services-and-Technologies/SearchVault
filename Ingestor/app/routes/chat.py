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
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "local")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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
         "content": (
             "You are a helpful and knowledgeable assistant specialized in German construction law. "
             "Use the provided context to answer questions accurately. "
             "If the answer is not clearly in the context, respond with 'The answer is not found in the provided documents.' "
             "Do not invent facts, but you may paraphrase or summarize clearly supported information."
         )},
        {"role": "user", "content": f"Context:\n{context_text}\n\nQuestion: {question}"}
    ]

    logging.info("# Step 4: Build prompt - done")

    if LLM_PROVIDER == "openai":
        logging.info("Open ai is used for chat")
        return StreamingResponse(stream_openai(prompt), media_type="text/event-stream")
    else:
        logging.info("local LLM is used for chat")
        return StreamingResponse(stream_local_llm(prompt), media_type="text/event-stream")

async def stream_local_llm(prompt):
    payload = {
        "model": "mistral",
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

async def stream_openai(prompt):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "stream": True,
        "messages": prompt
    }

    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", "https://api.openai.com/v1/chat/completions", json=payload,
                                 headers=headers) as response:
            buffer = ""
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    line = line.removeprefix("data: ").strip()
                    if line == "[DONE]":
                        break
                    try:
                        data = json.loads(line)
                        delta = data["choices"][0]["delta"].get("content", "")
                        buffer += delta
                        if any(buffer.endswith(c) for c in [" ", ".", ",", "!", "?"]):
                            yield f"data: {buffer.strip()}\n\n"
                            buffer = ""
                    except Exception as e:
                        logging.warning(f"OpenAI stream decode error: {e}")
            if buffer.strip():
                yield f"data: {buffer.strip()}\n\n"