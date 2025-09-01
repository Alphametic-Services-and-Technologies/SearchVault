from fastapi import APIRouter
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
    llmProvider: str
    modelName: str

logging.basicConfig(level=logging.INFO)

router = APIRouter()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "local")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@router.post("/chat")

async def chat(request: ChatRequest):
    question = request.question
    tenant_id = request.tenantId
    model_name = request.modelName

    # Prefer FE setting; fall back to config
    llm_provider = request.llmProvider or LLM_PROVIDER

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
        top_k=8
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
             "Answer the following question based on the provided context. Follow these rules: "
             "1. If the question is about vacation days, ALWAYS mention the company policy of 25 paid vacation days per year "
             "2. For questions about specific employees, clearly state: - Their position and department - Number of vacation days taken - Number of vacation days remaining (25 minus days taken) "
             "3. If looking at historical data, mention when we don't have the full year's context"
             "If you cannot answer this question based on the context, say \"I cannot answer this question based on the available information.\""
         )},
        {"role": "user", "content": f"Context:\n{context_text}\n\nHere's the original user prompt, answer with help of the retrieved passages:: {question}"}
    ]

    logging.info("# Step 4: Build prompt - done")

    if llm_provider == "openai":
        logging.info(f"Open ai is used for chat with model: {model_name}")
        return StreamingResponse(stream_openai(prompt), media_type="text/event-stream")
    else:
        logging.info(f"local LLM is used for chat with model: {model_name}")
        return StreamingResponse(stream_local_llm(prompt, model_name), media_type="text/event-stream")

async def stream_local_llm(prompt, model_name):
    payload = {
        # "model": "llama3.2",
        # "model": "mistral",
        "model": model_name,
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