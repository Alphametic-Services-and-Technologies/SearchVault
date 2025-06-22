## SearchVault

SearchVault is a fully containerized, modular, and multi-tenant Retrieval-Augmented Generation (RAG) system designed to empower organizations with a secure, private, and on-premise AI assistant. It enables users to query internal documentation through a chat-based interface using either local Large Language Models (LLMs) or OpenAI APIs.

> ✅ Suitable for deployment on **self-managed Kubernetes clusters**.

<img width="462" alt="SearchVault_Systemdesign" src="https://github.com/user-attachments/assets/da81b3ef-1a95-4e43-8590-102111de7d05" />

---

## 🔧 Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-6F4E7C?logo=qdrant&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Mistral](https://img.shields.io/badge/Mistral-black?logo=openai&logoColor=white&labelColor=black)
![Phi-2](https://img.shields.io/badge/Phi--2-lightgrey?logo=openai&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)

---

## System Overview

SearchVault is built around these core capabilities:

- 🔐 Secure document ingestion and vectorization.
- ⚡ Fast semantic search via Qdrant.
- 🔁 Flexible LLM interaction (local via Ollama or OpenAI).
- 💬 Real-time response streaming to frontend.
- 🏢 Multi-tenant isolation for enterprise usage.

---

## Architecture & Components

### 1. React Frontend

- Chat interface with real-time streaming.
- Admin panel for uploading documents.
- Language toggle (i18n).
- Tenant-aware context handling.

### 2. Middleware API (.NET)

- Handles authentication via JWT.
- Exposes endpoints for chat and document ingestion.
- Forwards requests to Python Ingestor.
- Multi-tenant aware with user/session scoping.

### 3. Ingestor (Python, FastAPI)

- `/ingest`: Accepts documents, extracts text, chunks, and embeds using BAAI/bge-base-en.
- `/chat`: Accepts questions, embeds them, searches in Qdrant, and queries LLM for answers.
- Supports both local (Mistral, Phi2 via Ollama) and cloud-based (OpenAI) models.

### 4. Qdrant (Vector DB)

- Tenant-specific collections.
- Stores document and question embeddings.
- Supports fast similarity search with filtering.

### 5. LLMs

- **Local:** Mistral, Phi2 via Ollama.
- **Remote:** OpenAI (e.g., gpt-3.5-turbo).
- Configuration via `LLM_PROVIDER` environment variable.

---

## 🔐 3. Security & Multi-Tenant Support

- 🔒 **JWT Auth** + role separation (Admin vs User)
- 🏢 Each tenant has isolated:
  - Vector space in Qdrant
  - File system (PDFs, docs)
  - Audit trail
- 🧾 Per-request logging and traceability

---

## Environment Variables

Each service accepts the following environment variables:

**Ingestor:**

- `QDRANT_HOST`
- `QDRANT_PORT`
- `OLLAMA_URL`
- `LLM_PROVIDER`
- `OPENAI_API_KEY`

**Middleware:**

- Configuration via `.NET` `appsettings.json` (PostgreSQL, JWT, etc.)

---

# Sequence diagram
![diagram](https://github.com/user-attachments/assets/76ca1e3d-983f-4ef1-ab41-4dfb02ed1d2e)


# System Flow
<img width="416" alt="search_vault_flow_diagram" src="https://github.com/user-attachments/assets/1fcc29e6-5c9b-4cd5-902d-f18cf5b7059b" />


# System overview
![SearchVault - visual selection (1)](https://github.com/user-attachments/assets/544460c8-d03d-4e74-8c12-c6a06bb6315d)

---

## Deployment

All components are dockerized and Kubernetes-ready.

## 🔧 Setup Instructions

### 1. If you are running Qdrant in a separate docker container then create Docker Network

```bash
docker network create searchvault-net
````

### 2. Pull & Run Qdrant

```bash
docker pull qdrant/qdrant
docker run -d \
  --name qdrant \
  --network searchvault-net \
  -p 6333:6333 \
  qdrant/qdrant
````

### 3. Install Dependencies (Make sure requirements.txt file is complete)

pip install -r requirements.txt

### 4. Run Ingestor

```bash
docker compose up --build
````

### 5. Access API Docs

Swagger UI: http://localhost:8000/docs - it may take some time for the app to start, so wait until you see in the logs:

<img width="403" alt="image" src="https://github.com/user-attachments/assets/3bccd1b2-221d-466e-9b5b-486637099846" />

### 6. Test in Postman

<img width="1309" alt="image" src="https://github.com/user-attachments/assets/26fae912-20da-4b75-bf12-751a89e53295" />

## 7. Middleware (.NET)

```bash
docker build -t searchvault-middleware .
docker run --name middleware -p 5080:80 --network searchvault-net searchvault-middleware
````

---

## Prompt template:

[
  {
    "role": "system",
    "content": "You are an assistant for answering questions about German construction laws. Use only the provided context."
  },
  {
    "role": "user",
    "content": "Context:\n<retrieved context>\n\nQuestion: <user question>"
  }
]

---

# Switching LLMs

## Use OpenAI

LLM_PROVIDER=openai

OPENAI_API_KEY=sk-...

## Use local model via Ollama

LLM_PROVIDER=local

OLLAMA_URL=http://host.docker.internal:11434/api/chat

---

## License & Contribution
Made with ❤️ by [AST](https://ast-lb.com/) Team. Contributions welcome.
